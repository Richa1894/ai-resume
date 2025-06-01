
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Brain, Users, Trophy, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CandidateResults from '@/components/CandidateResults';
import FileUpload from '@/components/FileUpload';
import { analyzeCandidates } from '@/utils/aiAnalysis';

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

interface ScoredCandidate {
  candidateId: number;
  name: string;
  score: number;
  skills: string;
  experience: string;
  reasoning: string;
  candidate: Candidate;
}

const Index = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ScoredCandidate[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please enter a job description to analyze candidates.",
        variant: "destructive",
      });
      return;
    }

    if (!candidateData?.resumes?.length) {
      toast({
        title: "No Candidate Data",
        description: "Please upload candidate data to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    console.log('Starting analysis with:', {
      jobDescription: jobDescription.substring(0, 100) + '...',
      candidateCount: candidateData.resumes.length
    });

    try {
      const analysisResults = await analyzeCandidates(candidateData.resumes, jobDescription);
      console.log('Analysis completed:', analysisResults);
      setResults(analysisResults);
      
      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${analysisResults.length} candidates.`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (data: CandidateData) => {
    setCandidateData(data);
    console.log('File uploaded successfully:', {
      resumeCount: data.resumes.length,
      hasJobDescription: !!data.job_description
    });
    
    if (data.job_description && !jobDescription) {
      setJobDescription(data.job_description);
    }
    
    toast({
      title: "File Uploaded Successfully",
      description: `Loaded ${data.resumes.length} candidate resumes.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RecruitTech AI</h1>
                <p className="text-sm text-gray-600">AI-Powered Resume Shortlisting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>Challenge</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>&lt; 10s Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Shortlisting Tool
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Automate your recruitment process with advanced NLP technology. 
            Upload candidate resumes and job descriptions to get instant AI-powered 
            scoring and ranking of the most qualified candidates.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
              <p className="text-sm text-gray-600">Advanced NLP analysis</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Fast Processing</h3>
              <p className="text-sm text-gray-600">Results in under 10 seconds</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Smart Ranking</h3>
              <p className="text-sm text-gray-600">Precise candidate scoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Description Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Job Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your job description here... Include required skills, experience, qualifications, and any other relevant criteria."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                {jobDescription.length} characters
              </p>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Candidate Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} />
              {candidateData && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Loaded {candidateData.resumes.length} candidate resumes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim() || !candidateData?.resumes?.length}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Candidates...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Analyze & Rank Candidates
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <CandidateResults candidates={results} />
        )}
      </div>
    </div>
  );
};

export default Index;
