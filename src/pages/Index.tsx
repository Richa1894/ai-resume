
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Brain, Users, Trophy, Clock, Sparkles, Target, Zap, Heart } from 'lucide-react';
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
        title: "Hold on! 🤔",
        description: "I need a job description to work my magic. Tell me what you're looking for!",
        variant: "destructive",
      });
      return;
    }

    if (!candidateData?.resumes?.length) {
      toast({
        title: "Oops! No candidates yet 📂",
        description: "Please upload some candidate data so I can help you find the perfect match!",
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
        title: "🎉 Perfect! Analysis Complete!",
        description: `I've analyzed ${analysisResults.length} candidates and found some great matches for you!`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Oops! Something went wrong 😅",
        description: "Don't worry, let's try that again. Sometimes these things happen!",
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
      title: "🎉 Awesome! Data uploaded successfully",
      description: `Got ${data.resumes.length} candidate profiles loaded. Ready to find your perfect hire!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-indigo-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RecruitTech Pro
                </h1>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span>Built by Richa Kumari</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">RecruitTech Challenge</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">Smart & Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl opacity-50 blur-3xl"></div>
          <div className="relative">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Find Your Dream
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Team Members</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Hey there! I'm Richa, and I've built this tool to make your hiring process incredibly efficient. 
              Just upload your candidate data, describe what you're looking for, and I'll help you 
              <span className="font-semibold text-indigo-600"> identify the best talent </span>
              in seconds, not hours.
            </p>
            <div className="flex justify-center space-x-2 mb-8">
              {["🎯", "💫", "🚀", "✨"].map((emoji, index) => (
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Smart Analysis</h3>
                <p className="text-sm text-gray-600 mt-2">Intelligent algorithms analyze skills, experience, and cultural fit</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Super Fast</h3>
                <p className="text-sm text-gray-600 mt-2">Get comprehensive results in under 10 seconds</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Accurate Matching</h3>
                <p className="text-sm text-gray-600 mt-2">Reliable scoring system that actually makes sense</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Job Description Input */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <span>Tell me about your ideal candidate</span>
              </CardTitle>
              <p className="text-sm text-gray-600">The more specific you are, the better I can help you find the right match!</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="✨ Describe your perfect candidate here...

Example: I'm looking for a Senior Full Stack Developer with 4+ years of experience in React and Node.js. They should be passionate about clean code, have experience with cloud platforms like AWS, and bonus points if they have some AI/ML background. Team player with good communication skills is a must!"
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
                  <span>More details = better matches</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span>Upload your candidate data</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Upload your candidate profiles in JSON format</p>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} />
              {candidateData && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-green-700 font-medium">
                      🎉 Great! I've loaded {candidateData.resumes.length} candidate profiles
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analyze Button */}
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
                <span className="animate-pulse">Working my magic...</span>
              </>
            ) : (
              <>
                <Brain className="h-6 w-6 mr-3" />
                <span>✨ Find My Perfect Candidates</span>
              </>
            )}
          </Button>
          {(!jobDescription.trim() || !candidateData?.resumes?.length) && (
            <p className="text-sm text-gray-500 mt-3 flex items-center justify-center space-x-1">
              <span>💡</span>
              <span>Please upload candidate data and describe your ideal hire to get started</span>
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
