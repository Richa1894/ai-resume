
# RecruitTech AI - Smart Resume Shortlisting Tool

**Built by Richa Kumari for the RecruitTech Challenge 🚀**

## About This Project

Hey there! 👋 I'm Richa, and I built this smart resume shortlisting tool to solve one of the biggest pain points in recruitment - manually going through hundreds of resumes to find the perfect candidate. 

This tool uses intelligent algorithms to analyze candidate profiles against job requirements and provides you with ranked results in seconds, not hours!

## What Makes This Special? ✨

- **Lightning Fast**: Get results in under 10 seconds
- **Smart Scoring**: Advanced analysis of skills, experience, and profile fit
- **Beautiful Interface**: Clean, modern design that's actually enjoyable to use
- **Real Results**: Practical scoring system that recruiters can trust

## How to Use 📋

1. **Describe Your Role**: Tell the tool what kind of candidate you're looking for
2. **Upload Resumes**: Drop your candidate data in JSON format
3. **Get Results**: Watch as candidates get intelligently ranked and scored
4. **Make Decisions**: Review detailed reasoning for each candidate's score

## Quick Start 🎯

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project
cd recruittech-ai

# Install dependencies
npm install

# Start the application
npm run dev
```

## Technology Stack 💻

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Shadcn/ui for consistent design
- **Analysis Engine**: Custom NLP-based scoring algorithm
- **Build Tool**: Vite for fast development

## File Format 📄

The tool expects candidate data in this JSON format:

```json
{
  "resumes": [
    {
      "candidateId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "skills": "React, Node.js, Python",
      "totalExperience": "5 years",
      "currentDesignation": "Software Engineer",
      "email": "john@example.com",
      "currentCompany": "TechCorp",
      "currentLocation": "San Francisco"
    }
  ],
  "job_description": "Your job requirements here..."
}
```

## Features I'm Proud Of 🌟

- **Intelligent Matching**: Doesn't just look for keyword matches, but understands context
- **Detailed Reasoning**: Every score comes with clear explanations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Sample Data**: Included sample files to get you started immediately
- **Error Handling**: Helpful messages guide you through any issues

## How the Scoring Works 🎯

The algorithm evaluates candidates across three main areas:
- **Skills Match** (50 points): How well their skills align with job requirements
- **Experience Level** (35 points): Years of experience and relevance
- **Profile Fit** (15 points): Overall career trajectory and role alignment

## Future Enhancements 🔮

I'm continuously improving this tool. Here's what's coming next:
- Resume PDF parsing
- Multiple job posting support
- Advanced filtering options
- Integration with popular ATS systems

## Contact & Feedback 📬

Built with ❤️ by **Richa Kumari**

Feel free to reach out if you have questions or suggestions for improvements!

## License

This project is open source and available under the MIT License.

---

*Making recruitment smarter, one algorithm at a time!* ✨
