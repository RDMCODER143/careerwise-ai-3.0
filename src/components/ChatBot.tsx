
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useCareerWiseChatbot } from "@/hooks/useCareerWiseChatbot";
import { useAuth } from "@/hooks/useAuth";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { messages, sendMessage, clearMessages, isLoading } = useCareerWiseChatbot();
  const { profile } = useAuth();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const message = inputMessage;
    setInputMessage("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleBasedWelcome = () => {
    if (profile?.role === 'employer') {
      return "I can help with job postings, candidate screening, hiring strategies, and navigating your employer dashboard.";
    } else if (profile?.role === 'admin') {
      return "I can help with platform administration, user management, and system navigation.";
    }
    return "I can help with resume analysis, career guidance, job matching, interview prep, and navigating your dashboard.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-96 bg-card rounded-2xl shadow-elegant border border-border">
          <div className="p-4 border-b border-border bg-gradient-hero rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground">CareerWise AI</h3>
                  <p className="text-xs text-primary-foreground/80">Online now</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearMessages}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                  title="Clear chat"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 h-80 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                {message.isBot && (
                  <div className="w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[280px] rounded-lg p-3 ${
                  message.isBot 
                    ? 'bg-muted/50 text-foreground' 
                    : 'bg-gradient-hero text-primary-foreground ml-8'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-muted-foreground' : 'text-primary-foreground/70'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {!message.isBot && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>I can help with:</strong>
                  <br />{getRoleBasedWelcome()}
                </p>
              </div>
            </div>
          )}
          
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-lg border-none outline-none disabled:opacity-50"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-hero hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-hero hover:opacity-90 shadow-elegant animate-bounce-gentle"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default ChatBot;
