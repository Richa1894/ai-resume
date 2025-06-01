
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, User, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';

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
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    if (score >= 60) return 'outline';
    return 'destructive';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const parseSkills = (skillsString: string): string[] => {
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Candidate Rankings</h3>
        <p className="text-gray-600">
          Analyzed {candidates.length} candidates and ranked them by relevance to the job description
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {candidates.filter(c => c.score >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Excellent Match (80+)</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {candidates.filter(c => c.score >= 60 && c.score < 80).length}
              </div>
              <div className="text-sm text-gray-600">Good Match (60-79)</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...candidates.map(c => c.score))}
              </div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {candidates.map((candidate, index) => (
          <Card key={candidate.candidateId} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getRankIcon(index)}</div>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-gray-600">{candidate.candidate.currentDesignation}</p>
                    <p className="text-sm text-gray-500">{candidate.candidate.currentCompany}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-lg ${getScoreColor(candidate.score)}`}>
                    {candidate.score}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{candidate.candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{candidate.candidate.currentLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{candidate.candidate.totalExperience} experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{candidate.candidate.noticePeriod} notice</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {parseSkills(candidate.candidate.skills).slice(0, 8).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {parseSkills(candidate.candidate.skills).length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{parseSkills(candidate.candidate.skills).length - 8} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Profile */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Profile</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {candidate.candidate.profile}
                </p>
              </div>

              {/* AI Reasoning */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1 text-sm">AI Analysis</h4>
                <p className="text-sm text-blue-800">
                  {candidate.reasoning}
                </p>
              </div>

              {/* Salary Info */}
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Current: ${parseInt(candidate.candidate.currentCTC).toLocaleString()}</span>
                </div>
                <div className="text-gray-600">
                  Expected: ${parseInt(candidate.candidate.expectedCTC).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Results */}
      <div className="text-center pt-6">
        <button
          onClick={() => {
            const results = candidates.map(c => ({
              candidateId: c.candidateId,
              name: c.name,
              score: c.score
            }));
            
            const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'candidate_rankings.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Export Rankings (JSON)
        </button>
      </div>
    </div>
  );
};

export default CandidateResults;
