
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Brain, Users, Trophy, Clock, Sparkles, Target, Zap } from 'lucide-react';
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
      title: "🎉 File Uploaded Successfully",
      description: `Loaded ${data.resumes.length} candidate resumes. Ready to find your perfect match!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-indigo-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-xl shadow-lg animate-pulse">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RecruitTech AI
                </h1>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  <span>Smart Resume Shortlisting</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">Challenge Mode</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">&lt; 10s Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl opacity-50 blur-3xl"></div>
          <div className="relative">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Find Your Perfect
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Candidates</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your recruitment process with our AI-powered solution. 
              Upload resumes, describe your ideal candidate, and watch as our intelligent system 
              <span className="font-semibold text-indigo-600"> ranks and scores </span>
              candidates in seconds.
            </p>
            <div className="flex justify-center space-x-2 mb-8">
              {["🎯", "⚡", "🧠", "✨"].map((emoji, index) => (
                <span 
                  key={index} 
                  className="text-3xl animate-bounce" 
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600 mt-2">Advanced NLP algorithms analyze skills, experience, and cultural fit</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Lightning Fast</h3>
                <p className="text-sm text-gray-600 mt-2">Get comprehensive results in under 10 seconds, not hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Precise Matching</h3>
                <p className="text-sm text-gray-600 mt-2">Smart scoring system identifies the best candidates accurately</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Job Description Input */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <span>Describe Your Dream Role</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Tell us about the perfect candidate you're looking for</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="✨ Describe your ideal candidate here...

Example: We're seeking a Senior Full Stack Developer with 4+ years of experience in React, Node.js, and cloud technologies. The perfect candidate should be passionate about clean code, have experience with AWS or similar platforms, and bonus points for AI/ML background!"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none border-2 border-dashed border-gray-200 focus:border-indigo-300 transition-colors"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-500">
                  {jobDescription.length} characters
                </p>
                <div className="flex items-center space-x-1 text-xs text-indigo-600">
                  <Sparkles className="h-3 w-3" />
                  <span>Be descriptive for better matches</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced File Upload */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span>Upload Candidate Resumes</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Upload your candidate data in JSON format</p>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} />
              {candidateData && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-green-700 font-medium">
                      🎉 Successfully loaded {candidateData.resumes.length} candidate profiles
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Analyze Button */}
        <div className="text-center mb-12">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim() || !candidateData?.resumes?.length}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 px-12 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span className="animate-pulse">Analyzing Magic in Progress...</span>
              </>
            ) : (
              <>
                <Brain className="h-6 w-6 mr-3" />
                <span>✨ Analyze & Rank Candidates</span>
              </>
            )}
          </Button>
          {(!jobDescription.trim() || !candidateData?.resumes?.length) && (
            <p className="text-sm text-gray-500 mt-3 flex items-center justify-center space-x-1">
              <span>💡</span>
              <span>Please upload candidate data and enter a job description to get started</span>
            </p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="animate-fade-in">
            <CandidateResults candidates={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
