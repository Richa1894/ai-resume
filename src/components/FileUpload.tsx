
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, Sparkles } from 'lucide-react';
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
        title: "Oops! Wrong file type 📄",
        description: "I need a JSON file with your candidate data. Could you upload that instead?",
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
          throw new Error("I couldn't find the 'resumes' array in your file. Could you check the format?");
        }

        if (data.resumes.length === 0) {
          throw new Error("Your file seems empty - no candidate resumes found!");
        }

        // Validate each resume has required fields
        const requiredFields = ['candidateId', 'firstName', 'lastName', 'skills', 'totalExperience'];
        for (const resume of data.resumes) {
          for (const field of requiredFields) {
            if (!(field in resume)) {
              throw new Error(`Missing '${field}' field in candidate data. This helps me analyze better!`);
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
          title: "Having trouble reading your file 😅",
          description: error instanceof Error ? error.message : "Could you double-check the file format? I've included a sample you can download!",
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
    a.download = 'candidate_sample_by_richa.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "🎉 Sample data ready!",
      description: "I've created a sample file for you. Perfect for testing how this works!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50 group-hover:from-blue-50 group-hover:to-indigo-50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            <FileText className="h-16 w-16 text-gray-400 group-hover:text-indigo-500 mx-auto mb-4 transition-colors duration-300" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Share Your Candidate Data
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Drop your JSON file here or click to browse. 
            I'll process it faster than you can say "hired"! ⚡
          </p>
          
          <Button 
            onClick={handleUploadClick} 
            className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-8 py-3 rounded-xl"
          >
            <Upload className="h-5 w-5 mr-2" />
            Choose Your JSON File
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Sample Data Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h4 className="font-semibold text-purple-900">Need sample data to try?</h4>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-purple-700 mb-4 text-sm">
            Get started instantly with sample candidate data I've prepared for you!
          </p>
          <Button 
            variant="outline" 
            onClick={createSampleData}
            className="border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-all duration-300 rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample Data
          </Button>
        </div>
      </div>

      {/* Format Guide */}
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Expected File Format</span>
        </h4>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <pre className="text-xs text-gray-700 overflow-x-auto">
{`{
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
      "currentLocation": "San Francisco",
      ...
    }
  ],
  "job_description": "Your job requirements..."
}`}
          </pre>
        </div>
        <p className="text-xs text-gray-500 mt-3 flex items-center space-x-1">
          <span>💡</span>
          <span>All the important fields help me give you more accurate results</span>
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
