
from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_analyzer import ResumeAnalyzer
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the analyzer
analyzer = ResumeAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Resume Shortlisting API by Richa Kumari"})

@app.route('/analyze', methods=['POST'])
def analyze_resumes():
    """Analyze resumes endpoint"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate data structure
        if 'resumes' not in data or not isinstance(data['resumes'], list):
            return jsonify({"error": "Invalid data structure. Expected 'resumes' array."}), 400
        
        if len(data['resumes']) == 0:
            return jsonify({"error": "No resumes provided for analysis"}), 400
        
        if 'job_description' not in data or not data['job_description']:
            return jsonify({"error": "Job description is required"}), 400
        
        # Analyze candidates
        results = analyzer.analyze_candidates(data)
        
        return jsonify({
            "success": True,
            "candidates_analyzed": len(data['resumes']),
            "results": results
        })
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@app.route('/analyze-file', methods=['POST'])
def analyze_from_file():
    """Analyze resumes from uploaded file"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.endswith('.json'):
            return jsonify({"error": "File must be a JSON file"}), 400
        
        # Parse JSON from file
        try:
            data = json.loads(file.read().decode('utf-8'))
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON format"}), 400
        
        # Validate and analyze
        if 'resumes' not in data or not isinstance(data['resumes'], list):
            return jsonify({"error": "Invalid data structure. Expected 'resumes' array."}), 400
        
        if 'job_description' not in data:
            return jsonify({"error": "Job description is required"}), 400
        
        results = analyzer.analyze_candidates(data)
        
        return jsonify({
            "success": True,
            "candidates_analyzed": len(data['resumes']),
            "results": results
        })
        
    except Exception as e:
        return jsonify({"error": f"File analysis failed: {str(e)}"}), 500

if __name__ == '__main__':
    print("🚀 Resume Shortlisting API by Richa Kumari")
    print("📡 Starting server on http://localhost:5000")
    print("📋 Endpoints:")
    print("   GET  /health - Health check")
    print("   POST /analyze - Analyze resumes from JSON data")
    print("   POST /analyze-file - Analyze resumes from uploaded file")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
