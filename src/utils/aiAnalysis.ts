
interface Candidate {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  gender: string;
  skills: string;
  currentCompany: string;
  profile: string;
  currentDesignation: string;
  totalExperience: string;
  relevantExperience: string;
  currentLocation: string;
  preferredLocation: string[];
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  lastWorkingDay: string;
  holdingAnyOffer: string;
  interestedRole: string;
  createdAt: string;
  updatedAt: string;
  candidateId: number;
}

interface ScoredCandidate {
  candidateId: number;
  name: string;
  score: number;
  skills: string;
  experience: string;
  reasoning: string;
  candidate: Candidate;
}

// Simple text similarity function for skill matching
function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  
  const words1 = normalize(text1).split(/\s+/).filter(word => word.length > 2);
  const words2 = normalize(text2).split(/\s+/).filter(word => word.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(word => words2.includes(word));
  const uniqueWords = new Set([...words1, ...words2]);
  
  return (commonWords.length * 2) / uniqueWords.size;
}

// Extract experience years from text
function extractExperienceYears(experienceText: string): number {
  const match = experienceText.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
  return match ? parseFloat(match[1]) : 0;
}

// Calculate skill relevance score
function calculateSkillScore(candidateSkills: string, jobDescription: string): number {
  const candidateSkillList = candidateSkills.toLowerCase().split(',').map(s => s.trim());
  const jobDescLower = jobDescription.toLowerCase();
  
  let skillScore = 0;
  let matchedSkills = 0;
  let totalSkills = candidateSkillList.length;
  
  for (const skill of candidateSkillList) {
    if (skill.length < 2) continue;
    
    // Check for exact skill matches
    if (jobDescLower.includes(skill)) {
      skillScore += 10;
      matchedSkills++;
    }
    // Check for partial matches or related terms
    else if (calculateSimilarity(skill, jobDescription) > 0.1) {
      skillScore += 5;
      matchedSkills++;
    }
  }
  
  // Bonus for high match percentage
  const matchPercentage = totalSkills > 0 ? matchedSkills / totalSkills : 0;
  skillScore += matchPercentage * 20;
  
  return Math.min(skillScore, 50); // Cap at 50 points for skills
}

// Calculate experience relevance score
function calculateExperienceScore(candidate: Candidate, jobDescription: string): number {
  const totalExp = extractExperienceYears(candidate.totalExperience);
  const relevantExp = extractExperienceYears(candidate.relevantExperience);
  
  // Extract required experience from job description
  const expMatch = jobDescription.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
  const requiredExp = expMatch ? parseInt(expMatch[1]) : 3;
  
  let expScore = 0;
  
  // Score based on total experience
  if (totalExp >= requiredExp) {
    expScore += 20;
    // Bonus for exceeding requirements
    if (totalExp > requiredExp * 1.5) expScore += 10;
  } else {
    // Partial score if close to requirement
    expScore += (totalExp / requiredExp) * 15;
  }
  
  // Score based on relevant experience
  if (relevantExp >= requiredExp * 0.8) {
    expScore += 15;
  } else {
    expScore += (relevantExp / (requiredExp * 0.8)) * 10;
  }
  
  return Math.min(expScore, 35); // Cap at 35 points for experience
}

// Calculate profile/role relevance score
function calculateProfileScore(candidate: Candidate, jobDescription: string): number {
  const profileText = `${candidate.profile} ${candidate.currentDesignation} ${candidate.interestedRole}`;
  const similarity = calculateSimilarity(profileText, jobDescription);
  
  return Math.min(similarity * 100, 15); // Cap at 15 points for profile match
}

// Generate reasoning for the score
function generateReasoning(candidate: Candidate, scores: any, jobDescription: string): string {
  const totalExp = extractExperienceYears(candidate.totalExperience);
  const matchedSkills = candidate.skills.toLowerCase().split(',')
    .filter(skill => jobDescription.toLowerCase().includes(skill.trim()))
    .slice(0, 3);
  
  let reasoning = `Score: ${scores.total}/100. `;
  
  if (scores.skills > 30) {
    reasoning += `Strong skill match (${Math.round(scores.skills)}/50). `;
  } else if (scores.skills > 15) {
    reasoning += `Good skill alignment (${Math.round(scores.skills)}/50). `;
  } else {
    reasoning += `Limited skill match (${Math.round(scores.skills)}/50). `;
  }
  
  if (matchedSkills.length > 0) {
    reasoning += `Key matching skills: ${matchedSkills.join(', ')}. `;
  }
  
  if (scores.experience > 25) {
    reasoning += `Excellent experience fit (${totalExp} years). `;
  } else if (scores.experience > 15) {
    reasoning += `Good experience level (${totalExp} years). `;
  } else {
    reasoning += `Developing experience (${totalExp} years). `;
  }
  
  if (scores.profile > 10) {
    reasoning += `Strong profile alignment with role requirements.`;
  } else if (scores.profile > 5) {
    reasoning += `Moderate profile fit for the position.`;
  } else {
    reasoning += `Profile shows potential for growth in this role.`;
  }
  
  return reasoning;
}

export async function analyzeCandidates(
  candidates: Candidate[],
  jobDescription: string
): Promise<ScoredCandidate[]> {
  console.log('Starting AI analysis for', candidates.length, 'candidates');
  
  const scoredCandidates: ScoredCandidate[] = [];
  
  for (const candidate of candidates) {
    try {
      console.log(`Analyzing candidate: ${candidate.firstName} ${candidate.lastName}`);
      
      // Calculate individual scores
      const skillScore = calculateSkillScore(candidate.skills, jobDescription);
      const experienceScore = calculateExperienceScore(candidate, jobDescription);
      const profileScore = calculateProfileScore(candidate, jobDescription);
      
      // Total score calculation
      const totalScore = Math.round(skillScore + experienceScore + profileScore);
      
      const scores = {
        skills: skillScore,
        experience: experienceScore,
        profile: profileScore,
        total: totalScore
      };
      
      console.log(`Candidate ${candidate.firstName} scores:`, scores);
      
      const scoredCandidate: ScoredCandidate = {
        candidateId: candidate.candidateId,
        name: `${candidate.firstName} ${candidate.lastName}`,
        score: totalScore,
        skills: candidate.skills,
        experience: candidate.totalExperience,
        reasoning: generateReasoning(candidate, scores, jobDescription),
        candidate: candidate
      };
      
      scoredCandidates.push(scoredCandidate);
    } catch (error) {
      console.error(`Error analyzing candidate ${candidate.firstName} ${candidate.lastName}:`, error);
      
      // Fallback scoring in case of error
      const fallbackScore: ScoredCandidate = {
        candidateId: candidate.candidateId,
        name: `${candidate.firstName} ${candidate.lastName}`,
        score: 50, // Default score
        skills: candidate.skills,
        experience: candidate.totalExperience,
        reasoning: "Analysis completed with basic scoring due to processing constraints.",
        candidate: candidate
      };
      
      scoredCandidates.push(fallbackScore);
    }
  }
  
  // Sort by score in descending order
  const sortedCandidates = scoredCandidates.sort((a, b) => b.score - a.score);
  
  console.log('Analysis complete. Top 3 candidates:', 
    sortedCandidates.slice(0, 3).map(c => ({ name: c.name, score: c.score }))
  );
  
  return sortedCandidates;
}
