
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface CandidateData {
  resumes: Candidate[];
  job_description: string;
}

interface FileUploadProps {
  onFileUpload: (data: CandidateData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JSON file containing candidate data.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as CandidateData;
        
        // Validate the data structure
        if (!data.resumes || !Array.isArray(data.resumes)) {
          throw new Error("Invalid data structure: 'resumes' array not found");
        }

        if (data.resumes.length === 0) {
          throw new Error("No candidate resumes found in the file");
        }

        // Validate each resume has required fields
        const requiredFields = ['candidateId', 'firstName', 'lastName', 'skills', 'totalExperience'];
        for (const resume of data.resumes) {
          for (const field of requiredFields) {
            if (!(field in resume)) {
              throw new Error(`Missing required field '${field}' in candidate data`);
            }
          }
        }

        console.log('Successfully parsed candidate data:', {
          candidateCount: data.resumes.length,
          hasJobDescription: !!data.job_description,
          firstCandidate: data.resumes[0]?.firstName + ' ' + data.resumes[0]?.lastName
        });

        onFileUpload(data);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        toast({
          title: "File Parse Error",
          description: error instanceof Error ? error.message : "Failed to parse the JSON file. Please check the file format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const createSampleData = () => {
    const sampleData: CandidateData = {
      resumes: [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1990-05-15",
          email: "john.doe@email.com",
          phoneNumber: "+1234567890",
          gender: "Male",
          skills: "React, JavaScript, TypeScript, Node.js, Python, Machine Learning, AWS",
          currentCompany: "TechCorp Inc",
          profile: "Full Stack Developer with 5 years of experience in web development and AI",
          currentDesignation: "Senior Software Engineer",
          totalExperience: "5 years",
          relevantExperience: "4 years",
          currentLocation: "San Francisco, CA",
          preferredLocation: ["San Francisco", "New York", "Remote"],
          currentCTC: "120000",
          expectedCTC: "140000",
          noticePeriod: "2 months",
          lastWorkingDay: "2024-03-01",
          holdingAnyOffer: "No",
          interestedRole: "Senior Full Stack Developer",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          candidateId: 1
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          dateOfBirth: "1988-12-10",
          email: "jane.smith@email.com",
          phoneNumber: "+1234567891",
          gender: "Female",
          skills: "Java, Spring Boot, Microservices, Docker, Kubernetes, REST APIs",
          currentCompany: "Global Systems Ltd",
          profile: "Backend Developer specializing in enterprise applications and cloud architecture",
          currentDesignation: "Lead Backend Developer",
          totalExperience: "7 years",
          relevantExperience: "6 years",
          currentLocation: "Austin, TX",
          preferredLocation: ["Austin", "Seattle", "Remote"],
          currentCTC: "130000",
          expectedCTC: "150000",
          noticePeriod: "1 month",
          lastWorkingDay: "2024-02-15",
          holdingAnyOffer: "Yes",
          interestedRole: "Backend Architect",
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-10T09:00:00Z",
          candidateId: 2
        },
        {
          id: "3",
          firstName: "Mike",
          lastName: "Johnson",
          dateOfBirth: "1992-08-22",
          email: "mike.johnson@email.com",
          phoneNumber: "+1234567892",
          gender: "Male",
          skills: "React Native, Flutter, iOS, Android, Mobile Development, Firebase",
          currentCompany: "MobileFirst Solutions",
          profile: "Mobile App Developer with expertise in cross-platform development",
          currentDesignation: "Mobile Developer",
          totalExperience: "3 years",
          relevantExperience: "3 years",
          currentLocation: "Chicago, IL",
          preferredLocation: ["Chicago", "Remote"],
          currentCTC: "85000",
          expectedCTC: "100000",
          noticePeriod: "1 month",
          lastWorkingDay: "2024-04-01",
          holdingAnyOffer: "No",
          interestedRole: "Senior Mobile Developer",
          createdAt: "2024-01-20T11:00:00Z",
          updatedAt: "2024-01-20T11:00:00Z",
          candidateId: 3
        }
      ],
      job_description: "We are looking for a Senior Full Stack Developer with expertise in React, Node.js, and cloud technologies. The ideal candidate should have 4+ years of experience in web development, strong knowledge of JavaScript/TypeScript, and experience with AWS or similar cloud platforms. Experience with AI/ML technologies is a plus."
    };

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidate_sample.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Sample Data Downloaded",
      description: "A sample JSON file has been downloaded. You can modify it or use it as-is for testing.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Candidate Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a JSON file containing candidate resumes and job description
        </p>
        
        <Button onClick={handleUploadClick} className="mb-3">
          <Upload className="h-4 w-4 mr-2" />
          Choose JSON File
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Need a sample file to test with?</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={createSampleData}
            className="text-xs"
          >
            Download Sample Data
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Expected JSON format:</strong></p>
        <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
{`{
  "resumes": [
    {
      "candidateId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "skills": "React, Node.js, Python",
      "totalExperience": "5 years",
      ...
    }
  ],
  "job_description": "Job requirements..."
}`}
        </pre>
      </div>
    </div>
  );
};

export default FileUpload;
