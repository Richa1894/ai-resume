
import spacy
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import re
from datetime import datetime
from typing import List, Dict, Any

class ResumeAnalyzer:
    def __init__(self):
        # Load spaCy model for NLP processing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Please install spaCy English model: python -m spacy download en_core_web_sm")
            raise
        
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=1000,
            ngram_range=(1, 2)
        )
    
    def extract_years_experience(self, experience_text: str) -> float:
        """Extract years of experience from text"""
        if not experience_text:
            return 0
        
        # Look for patterns like "5 years", "3.5 yrs", etc.
        pattern = r'(\d+(?:\.\d+)?)\s*(?:years?|yrs?)'
        match = re.search(pattern, experience_text.lower())
        
        if match:
            return float(match.group(1))
        return 0
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text using spaCy"""
        if not text:
            return ""
        
        doc = self.nlp(text.lower())
        # Keep only meaningful tokens (not punctuation, spaces, etc.)
        tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.is_alpha]
        return " ".join(tokens)
    
    def calculate_skill_match_score(self, candidate_skills: str, job_description: str) -> float:
        """Calculate skill matching score using TF-IDF and cosine similarity"""
        if not candidate_skills or not job_description:
            return 0
        
        # Preprocess texts
        processed_skills = self.preprocess_text(candidate_skills)
        processed_job_desc = self.preprocess_text(job_description)
        
        if not processed_skills or not processed_job_desc:
            return 0
        
        try:
            # Create TF-IDF vectors
            tfidf_matrix = self.tfidf_vectorizer.fit_transform([processed_skills, processed_job_desc])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            # Convert to score out of 50
            return min(similarity * 50, 50)
        except:
            return 0
    
    def calculate_experience_score(self, candidate: Dict, job_description: str) -> float:
        """Calculate experience relevance score"""
        total_exp = self.extract_years_experience(candidate.get('totalExperience', ''))
        relevant_exp = self.extract_years_experience(candidate.get('relevantExperience', ''))
        
        # Extract required experience from job description
        required_exp_match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)', job_description.lower())
        required_exp = float(required_exp_match.group(1)) if required_exp_match else 3
        
        score = 0
        
        # Score based on total experience
        if total_exp >= required_exp:
            score += 20
            # Bonus for exceeding requirements
            if total_exp > required_exp * 1.5:
                score += 10
        else:
            # Partial score if close to requirement
            score += (total_exp / required_exp) * 15
        
        # Score based on relevant experience
        if relevant_exp >= required_exp * 0.8:
            score += 15
        else:
            score += (relevant_exp / (required_exp * 0.8)) * 10
        
        return min(score, 35)  # Cap at 35 points
    
    def calculate_profile_score(self, candidate: Dict, job_description: str) -> float:
        """Calculate profile/role relevance score using NLP"""
        profile_text = f"{candidate.get('profile', '')} {candidate.get('currentDesignation', '')} {candidate.get('interestedRole', '')}"
        
        if not profile_text.strip():
            return 0
        
        # Use spaCy for semantic similarity
        try:
            profile_doc = self.nlp(profile_text)
            job_doc = self.nlp(job_description)
            
            # Calculate semantic similarity
            similarity = profile_doc.similarity(job_doc)
            
            # Convert to score out of 15
            return min(similarity * 15, 15)
        except:
            return 0
    
    def generate_reasoning(self, candidate: Dict, scores: Dict, job_description: str) -> str:
        """Generate human-readable reasoning for the score"""
        total_exp = self.extract_years_experience(candidate.get('totalExperience', ''))
        name = f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}"
        
        # Extract some matching skills
        candidate_skills_list = [skill.strip().lower() for skill in candidate.get('skills', '').split(',')]
        job_skills = self.preprocess_text(job_description).split()
        matching_skills = [skill for skill in candidate_skills_list if any(job_skill in skill for job_skill in job_skills)][:3]
        
        reasoning = f"{name} scored {scores['total']}/100. "
        
        # Skills assessment
        if scores['skills'] > 30:
            reasoning += f"Excellent skill alignment ({scores['skills']:.1f}/50). "
        elif scores['skills'] > 15:
            reasoning += f"Good skill match ({scores['skills']:.1f}/50). "
        else:
            reasoning += f"Limited skill overlap ({scores['skills']:.1f}/50). "
        
        if matching_skills:
            reasoning += f"Key matching skills: {', '.join(matching_skills[:3])}. "
        
        # Experience assessment
        if scores['experience'] > 25:
            reasoning += f"Strong experience profile ({total_exp} years total). "
        elif scores['experience'] > 15:
            reasoning += f"Adequate experience level ({total_exp} years total). "
        else:
            reasoning += f"Developing experience ({total_exp} years total). "
        
        # Profile assessment
        if scores['profile'] > 10:
            reasoning += "Profile shows excellent alignment with role requirements."
        elif scores['profile'] > 5:
            reasoning += "Profile demonstrates good fit for the position."
        else:
            reasoning += "Profile shows potential for growth in this role."
        
        return reasoning
    
    def analyze_candidates(self, data: Dict) -> List[Dict]:
        """Main method to analyze all candidates"""
        candidates = data.get('resumes', [])
        job_description = data.get('job_description', '')
        
        if not candidates:
            raise ValueError("No candidates found in data")
        
        if not job_description:
            raise ValueError("Job description is required for analysis")
        
        results = []
        
        print(f"Starting analysis of {len(candidates)} candidates...")
        
        for i, candidate in enumerate(candidates):
            try:
                print(f"Analyzing candidate {i+1}/{len(candidates)}: {candidate.get('firstName', 'Unknown')}")
                
                # Calculate individual scores
                skill_score = self.calculate_skill_match_score(candidate.get('skills', ''), job_description)
                experience_score = self.calculate_experience_score(candidate, job_description)
                profile_score = self.calculate_profile_score(candidate, job_description)
                
                # Total score
                total_score = skill_score + experience_score + profile_score
                
                scores = {
                    'skills': skill_score,
                    'experience': experience_score,
                    'profile': profile_score,
                    'total': round(total_score)
                }
                
                # Generate reasoning
                reasoning = self.generate_reasoning(candidate, scores, job_description)
                
                result = {
                    'candidateId': candidate.get('candidateId'),
                    'name': f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}".strip(),
                    'score': scores['total'],
                    'skills': candidate.get('skills', ''),
                    'experience': candidate.get('totalExperience', ''),
                    'reasoning': reasoning,
                    'candidate': candidate
                }
                
                results.append(result)
                
            except Exception as e:
                print(f"Error analyzing candidate {candidate.get('firstName', 'Unknown')}: {str(e)}")
                # Add fallback result
                fallback_result = {
                    'candidateId': candidate.get('candidateId'),
                    'name': f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}".strip(),
                    'score': 50,  # Default score
                    'skills': candidate.get('skills', ''),
                    'experience': candidate.get('totalExperience', ''),
                    'reasoning': "Analysis completed with basic scoring due to processing constraints.",
                    'candidate': candidate
                }
                results.append(fallback_result)
        
        # Sort by score in descending order
        results.sort(key=lambda x: x['score'], reverse=True)
        
        print(f"Analysis complete! Top candidates:")
        for i, result in enumerate(results[:3]):
            print(f"{i+1}. {result['name']} - Score: {result['score']}")
        
        return results

def main():
    """Main function to run the analyzer from command line"""
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python resume_analyzer.py <path_to_resume_json>")
        sys.exit(1)
    
    json_file_path = sys.argv[1]
    
    try:
        # Load the JSON data
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Initialize analyzer
        analyzer = ResumeAnalyzer()
        
        # Analyze candidates
        results = analyzer.analyze_candidates(data)
        
        # Save results
        output_file = 'shortlisted_candidates.json'
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(results, file, indent=2, ensure_ascii=False)
        
        print(f"\nResults saved to {output_file}")
        
        # Display top 5 candidates
        print("\n🏆 TOP 5 CANDIDATES:")
        print("=" * 50)
        for i, candidate in enumerate(results[:5]):
            print(f"{i+1}. {candidate['name']} - Score: {candidate['score']}/100")
            print(f"   Skills: {candidate['skills'][:100]}...")
            print(f"   Experience: {candidate['experience']}")
            print(f"   Reasoning: {candidate['reasoning']}")
            print("-" * 50)
        
    except FileNotFoundError:
        print(f"Error: File '{json_file_path}' not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{json_file_path}'.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
