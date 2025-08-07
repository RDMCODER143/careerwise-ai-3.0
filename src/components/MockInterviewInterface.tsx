
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMockInterview } from '@/hooks/useMockInterview';
import { 
  Brain, 
  Users, 
  Target, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  StopCircle
} from 'lucide-react';

interface MockInterviewInterfaceProps {
  type: 'technical' | 'behavioral' | 'system_design';
  onBack: () => void;
}

const MockInterviewInterface: React.FC<MockInterviewInterfaceProps> = ({ type, onBack }) => {
  const { session, evaluation, isLoading, startInterview, submitResponse, endInterview, resetInterview } = useMockInterview();
  const [currentResponse, setCurrentResponse] = useState('');

  const getTypeIcon = () => {
    switch (type) {
      case 'technical': return <Brain className="w-5 h-5" />;
      case 'behavioral': return <Users className="w-5 h-5" />;
      case 'system_design': return <Target className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'technical': return 'bg-blue-500';
      case 'behavioral': return 'bg-green-500';
      case 'system_design': return 'bg-purple-500';
    }
  };

  const getTypeName = () => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleStart = () => {
    startInterview(type);
  };

  const handleSubmit = () => {
    if (currentResponse.trim()) {
      submitResponse(currentResponse);
      setCurrentResponse('');
    }
  };

  const handleEnd = () => {
    endInterview(currentResponse.trim() || undefined);
    setCurrentResponse('');
  };

  const handleReset = () => {
    resetInterview();
    onBack();
  };

  // Pre-interview state
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${getTypeColor()}`}>
                {getTypeIcon()}
                <span className="sr-only">{getTypeName()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{getTypeName()} Interview</h2>
                <p className="text-muted-foreground">AI-powered mock interview session</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What to expect:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {type === 'technical' && (
                  <>
                    <li>• Coding problems and algorithmic challenges</li>
                    <li>• Data structures and system architecture questions</li>
                    <li>• Problem-solving and optimization scenarios</li>
                  </>
                )}
                {type === 'behavioral' && (
                  <>
                    <li>• Questions about your past experiences</li>
                    <li>• Teamwork and leadership scenarios</li>
                    <li>• Cultural fit and communication assessment</li>
                  </>
                )}
                {type === 'system_design' && (
                  <>
                    <li>• Large-scale system architecture design</li>
                    <li>• Scalability and performance considerations</li>
                    <li>• Trade-offs and technology choices</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" className="flex-1">
                Back to Selection
              </Button>
              <Button onClick={handleStart} disabled={isLoading} className="flex-1 bg-gradient-hero hover:opacity-90">
                {isLoading ? 'Starting...' : 'Start Interview'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Post-interview evaluation
  if (evaluation && !session.isActive) {
    const getScoreColor = (score: number) => {
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    };

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Interview Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(evaluation.score)} mb-2`}>
                {evaluation.score}
              </div>
              <p className="text-lg text-muted-foreground">Overall Score</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Strengths
                </h3>
                <ul className="space-y-1">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-1">
                  {evaluation.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Detailed Feedback</h3>
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                {evaluation.feedback}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Recommendations</h3>
              <p className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-4">
                {evaluation.recommendations}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Back to Dashboard
              </Button>
              <Button onClick={() => startInterview(type)} className="flex-1 bg-gradient-hero hover:opacity-90">
                Take Another Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active interview state
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Interview Header */}
      <Card className="bg-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor()}`}>
                {getTypeIcon()}
              </div>
              <div>
                <h2 className="font-semibold">{getTypeName()} Interview</h2>
                <p className="text-sm text-muted-foreground">Question {session.questionNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {session.startTime && Math.floor((new Date().getTime() - session.startTime.getTime()) / 60000)} min
              </Badge>
              <Button onClick={handleEnd} variant="outline" size="sm">
                <StopCircle className="w-4 h-4 mr-1" />
                End Interview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Responses */}
      {session.responses.length > 0 && (
        <Card className="bg-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Previous Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.responses.slice(-2).map((item, index) => (
              <div key={index} className="border-l-2 border-primary pl-4 space-y-2">
                <p className="font-medium text-sm">{item.question}</p>
                <p className="text-sm text-muted-foreground bg-muted/30 rounded p-2">{item.response}</p>
                {item.feedback && (
                  <p className="text-sm text-blue-600 bg-blue-50 rounded p-2 italic">{item.feedback}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Current Question */}
      <Card className="bg-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Current Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-card rounded-lg p-4">
            <p className="text-lg">{session.currentQuestion}</p>
          </div>

          <div className="space-y-3">
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-32"
              disabled={isLoading}
            />
            
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit} 
                disabled={!currentResponse.trim() || isLoading}
                className="flex-1 bg-gradient-hero hover:opacity-90"
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Response
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MockInterviewInterface;
