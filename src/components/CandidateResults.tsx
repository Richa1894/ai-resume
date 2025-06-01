import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, User, MapPin, Briefcase, Clock, DollarSign, Star, Sparkles, Award } from 'lucide-react';

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

interface CandidateResultsProps {
  candidates: ScoredCandidate[];
}

const CandidateResults: React.FC<CandidateResultsProps> = ({ candidates }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 80) return 'from-blue-500 to-indigo-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    if (score >= 60) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    if (score >= 60) return 'outline';
    return 'destructive';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return { emoji: '🥇', text: '1st Place', color: 'text-yellow-600' };
    if (index === 1) return { emoji: '🥈', text: '2nd Place', color: 'text-gray-500' };
    if (index === 2) return { emoji: '🥉', text: '3rd Place', color: 'text-orange-600' };
    return { emoji: '🏅', text: `#${index + 1}`, color: 'text-blue-600' };
  };

  const getScoreDescription = (score: number) => {
    if (score >= 95) return 'Perfect Match! 🎯';
    if (score >= 90) return 'Excellent Match! ⭐';
    if (score >= 80) return 'Great Match! 👍';
    if (score >= 70) return 'Good Match! 👌';
    if (score >= 60) return 'Potential Match! 🤔';
    return 'Needs Review 📝';
  };

  const parseSkills = (skillsString: string): string[] => {
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl opacity-50 blur-2xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Candidate Rankings
            </h3>
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-gray-600 text-lg">
            🎉 Successfully analyzed <span className="font-semibold text-purple-600">{candidates.length} candidates</span> and ranked them by job fit
          </p>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {candidates.filter(c => c.score >= 80).length}
              </div>
              <div className="text-sm text-green-700 font-medium">Excellent Matches</div>
              <div className="text-xs text-green-600 mt-1">80+ Score</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {candidates.filter(c => c.score >= 60 && c.score < 80).length}
              </div>
              <div className="text-sm text-yellow-700 font-medium">Good Matches</div>
              <div className="text-xs text-yellow-600 mt-1">60-79 Score</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}
              </div>
              <div className="text-sm text-blue-700 font-medium">Average Score</div>
              <div className="text-xs text-blue-600 mt-1">Overall Quality</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {Math.max(...candidates.map(c => c.score))}
              </div>
              <div className="text-sm text-purple-700 font-medium">Top Score</div>
              <div className="text-xs text-purple-600 mt-1">Best Match</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Candidate Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {candidates.map((candidate, index) => {
          const rankInfo = getRankIcon(index);
          const scoreDesc = getScoreDescription(candidate.score);
          
          return (
            <Card 
              key={candidate.candidateId} 
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden group"
            >
              <CardHeader className="pb-4 relative">
                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                    <span className="text-sm font-semibold text-purple-700">
                      {rankInfo.emoji} {rankInfo.text}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-1">
                      {candidate.name}
                    </CardTitle>
                    <p className="text-base text-indigo-600 font-medium">
                      {candidate.candidate.currentDesignation}
                    </p>
                    <p className="text-sm text-gray-500">
                      {candidate.candidate.currentCompany}
                    </p>
                  </div>
                  
                  {/* Score Circle */}
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getScoreColor(candidate.score)} text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {candidate.score}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      {scoreDesc}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Contact & Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4 text-indigo-500" />
                    <span className="truncate">{candidate.candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{candidate.candidate.currentLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Briefcase className="h-4 w-4 text-green-500" />
                    <span>{candidate.candidate.totalExperience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{candidate.candidate.noticePeriod} notice</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Key Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parseSkills(candidate.candidate.skills).slice(0, 6).map((skill, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {parseSkills(candidate.candidate.skills).length > 6 && (
                      <Badge variant="outline" className="text-xs text-gray-500">
                        +{parseSkills(candidate.candidate.skills).length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2 text-sm flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>AI Match Analysis</span>
                  </h4>
                  <p className="text-sm text-purple-800 leading-relaxed">
                    {candidate.reasoning}
                  </p>
                </div>

                {/* Salary Info */}
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">
                      Current: <span className="font-medium">${parseInt(candidate.candidate.currentCTC).toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Expected: <span className="font-medium text-green-600">${parseInt(candidate.candidate.expectedCTC).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Export Section */}
      <div className="text-center pt-8">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            📊 Export Your Results
          </h4>
          <p className="text-gray-600 mb-4">
            Download the ranking results to share with your team or for future reference
          </p>
          <button
            onClick={() => {
              const results = candidates.map(c => ({
                candidateId: c.candidateId,
                name: c.name,
                score: c.score,
                reasoning: c.reasoning,
                skills: c.skills,
                experience: c.experience
              }));
              
              const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `candidate_rankings_${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:-translate-y-1 font-medium"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Download Rankings Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateResults;
