
#!/usr/bin/env python3
"""
Setup script for Resume Shortlisting Tool
Built by Richa Kumari for RecruitTech Challenge
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False
    return True

def download_spacy_model():
    """Download spaCy English model"""
    print("🔤 Downloading spaCy English model...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        print("✅ spaCy model downloaded successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to download spaCy model")
        return False
    return True

def create_sample_data():
    """Create sample resume data for testing"""
    print("📄 Creating sample data...")
    
    sample_data = {
        "resumes": [
            {
                "id": "1",
                "firstName": "John",
                "lastName": "Doe",
                "dateOfBirth": "1990-05-15",
                "email": "john.doe@email.com",
                "phoneNumber": "+1234567890",
                "gender": "Male",
                "skills": "React, JavaScript, TypeScript, Node.js, Python, Machine Learning, AWS",
                "currentCompany": "TechCorp Inc",
                "profile": "Full Stack Developer with 5 years of experience in web development and AI",
                "currentDesignation": "Senior Software Engineer",
                "totalExperience": "5 years",
                "relevantExperience": "4 years",
                "currentLocation": "San Francisco, CA",
                "preferredLocation": ["San Francisco", "New York", "Remote"],
                "currentCTC": "120000",
                "expectedCTC": "140000",
                "noticePeriod": "2 months",
                "lastWorkingDay": "2024-03-01",
                "holdingAnyOffer": "No",
                "interestedRole": "Senior Full Stack Developer",
                "createdAt": "2024-01-15T10:00:00Z",
                "updatedAt": "2024-01-15T10:00:00Z",
                "candidateId": 1
            },
            {
                "id": "2",
                "firstName": "Jane",
                "lastName": "Smith",
                "dateOfBirth": "1988-12-10",
                "email": "jane.smith@email.com",
                "phoneNumber": "+1234567891",
                "gender": "Female",
                "skills": "Java, Spring Boot, Microservices, Docker, Kubernetes, REST APIs",
                "currentCompany": "Global Systems Ltd",
                "profile": "Backend Developer specializing in enterprise applications and cloud architecture",
                "currentDesignation": "Lead Backend Developer",
                "totalExperience": "7 years",
                "relevantExperience": "6 years",
                "currentLocation": "Austin, TX",
                "preferredLocation": ["Austin", "Seattle", "Remote"],
                "currentCTC": "130000",
                "expectedCTC": "150000",
                "noticePeriod": "1 month",
                "lastWorkingDay": "2024-02-15",
                "holdingAnyOffer": "Yes",
                "interestedRole": "Backend Architect",
                "createdAt": "2024-01-10T09:00:00Z",
                "updatedAt": "2024-01-10T09:00:00Z",
                "candidateId": 2
            },
            {
                "id": "3",
                "firstName": "Mike",
                "lastName": "Johnson",
                "dateOfBirth": "1992-08-22",
                "email": "mike.johnson@email.com",
                "phoneNumber": "+1234567892",
                "gender": "Male",
                "skills": "React Native, Flutter, iOS, Android, Mobile Development, Firebase",
                "currentCompany": "MobileFirst Solutions",
                "profile": "Mobile App Developer with expertise in cross-platform development",
                "currentDesignation": "Mobile Developer",
                "totalExperience": "3 years",
                "relevantExperience": "3 years",
                "currentLocation": "Chicago, IL",
                "preferredLocation": ["Chicago", "Remote"],
                "currentCTC": "85000",
                "expectedCTC": "100000",
                "noticePeriod": "1 month",
                "lastWorkingDay": "2024-04-01",
                "holdingAnyOffer": "No",
                "interestedRole": "Senior Mobile Developer",
                "createdAt": "2024-01-20T11:00:00Z",
                "updatedAt": "2024-01-20T11:00:00Z",
                "candidateId": 3
            }
        ],
        "job_description": "We are looking for a Senior Full Stack Developer with expertise in React, Node.js, and cloud technologies. The ideal candidate should have 4+ years of experience in web development, strong knowledge of JavaScript/TypeScript, and experience with AWS or similar cloud platforms. Experience with AI/ML technologies is a plus."
    }
    
    with open('sample_resumes.json', 'w') as f:
        import json
        json.dump(sample_data, f, indent=2)
    
    print("✅ Sample data created: sample_resumes.json")

def main():
    """Main setup function"""
    print("🎯 Resume Shortlisting Tool Setup")
    print("Built by Richa Kumari for RecruitTech Challenge")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('requirements.txt'):
        print("❌ requirements.txt not found. Please run this script from the python_backend directory.")
        return
    
    # Install dependencies
    if not install_requirements():
        return
    
    # Download spaCy model
    if not download_spacy_model():
        return
    
    # Create sample data
    create_sample_data()
    
    print("\n🎉 Setup completed successfully!")
    print("\n🚀 You can now run:")
    print("   python resume_analyzer.py sample_resumes.json")
    print("   python api_server.py")

if __name__ == "__main__":
    main()
