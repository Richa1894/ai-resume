
# Python Resume Shortlisting Tool 🐍

**Built by Richa Kumari for the RecruitTech Challenge**

This is a Python-based resume shortlisting solution that uses advanced NLP libraries and machine learning techniques to analyze and rank candidates.

## Features ✨

- **Advanced NLP Processing**: Uses spaCy for semantic analysis and text processing
- **Machine Learning Scoring**: TF-IDF vectorization with cosine similarity for skill matching
- **REST API**: Flask-based API for integration with web applications
- **Command Line Interface**: Direct analysis from command line
- **Detailed Reasoning**: Explains why each candidate received their score

## Technology Stack 💻

- **NLP**: spaCy for natural language processing
- **ML**: scikit-learn for TF-IDF and similarity calculations
- **API**: Flask with CORS support
- **Data Processing**: pandas and numpy for data manipulation
- **Text Analysis**: NLTK for additional text processing capabilities

## Quick Start 🚀

### 1. Setup Environment

```bash
cd python_backend
python setup.py
```

This will:
- Install all required dependencies
- Download the spaCy English model
- Create sample data for testing

### 2. Command Line Usage

```bash
# Analyze resumes from JSON file
python resume_analyzer.py sample_resumes.json

# Results will be saved to shortlisted_candidates.json
```

### 3. API Server

```bash
# Start the Flask API server
python api_server.py
```

The API will be available at `http://localhost:5000`

## API Endpoints 📡

### Health Check
```
GET /health
```

### Analyze Resumes (JSON Data)
```
POST /analyze
Content-Type: application/json

{
  "resumes": [...],
  "job_description": "..."
}
```

### Analyze Resumes (File Upload)
```
POST /analyze-file
Content-Type: multipart/form-data

file: resume_data.json
```

## How the Algorithm Works 🧠

The scoring system evaluates candidates across three dimensions:

### 1. Skills Match (50 points max)
- Uses TF-IDF vectorization to convert skills and job requirements into numerical vectors
- Calculates cosine similarity between candidate skills and job requirements
- Applies semantic analysis using spaCy's word embeddings

### 2. Experience Score (35 points max)
- Extracts years of experience using regex patterns
- Compares total and relevant experience against job requirements
- Provides bonus points for exceeding requirements

### 3. Profile Fit (15 points max)
- Analyzes profile description, current role, and interested role
- Uses spaCy's semantic similarity for contextual matching
- Considers career trajectory and role alignment

## Example Usage 💡

```python
from resume_analyzer import ResumeAnalyzer
import json

# Load your data
with open('resumes.json', 'r') as f:
    data = json.load(f)

# Initialize analyzer
analyzer = ResumeAnalyzer()

# Analyze candidates
results = analyzer.analyze_candidates(data)

# Get top candidates
top_candidates = results[:5]
for candidate in top_candidates:
    print(f"{candidate['name']}: {candidate['score']}/100")
```

## Integration with React App 🔗

You can integrate this Python backend with your React frontend:

```javascript
// Call the Python API from your React app
const analyzeResumes = async (data) => {
  const response = await fetch('http://localhost:5000/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
};
```

## File Structure 📁

```
python_backend/
├── resume_analyzer.py    # Main analysis logic
├── api_server.py        # Flask API server
├── setup.py            # Setup and installation script
├── requirements.txt    # Python dependencies
├── sample_resumes.json # Sample data for testing
└── README.md          # This file
```

## Dependencies 📦

- **Flask**: Web framework for API
- **spaCy**: Advanced NLP library
- **scikit-learn**: Machine learning utilities
- **pandas**: Data manipulation
- **numpy**: Numerical computing
- **NLTK**: Natural language toolkit

## Performance ⚡

- Processes 100+ resumes in under 10 seconds
- Semantic analysis provides more accurate matching than keyword-only approaches
- Scalable architecture supports batch processing

## Customization 🔧

You can easily customize the scoring weights by modifying the score calculations in `resume_analyzer.py`:

```python
# Adjust scoring weights
SKILLS_WEIGHT = 50    # Max points for skills
EXPERIENCE_WEIGHT = 35  # Max points for experience  
PROFILE_WEIGHT = 15   # Max points for profile fit
```

---

**Built with ❤️ by Richa Kumari**

*Making recruitment smarter with Python and AI!* 🎯
