import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChatMessage } from '@/types/health';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const healthResponses: Record<string, string> = {
  'biological age': 'Biological age measures how well your body has aged compared to your chronological age. It\'s influenced by lifestyle factors, genetics, and environment. Unlike your birth date, biological age can be improved through healthy habits.',
  'longevity': 'Longevity refers to living a long, healthy life. Key factors include: quality sleep (7-9 hours), regular exercise, balanced nutrition, stress management, social connections, and avoiding harmful habits like smoking.',
  'sleep': 'Sleep is crucial for longevity. During deep sleep, your body repairs cells, consolidates memories, and regulates hormones. Aim for 7-9 hours of quality sleep. Tips: maintain a consistent schedule, limit screens before bed, and keep your room cool and dark.',
  'exercise': 'Regular exercise can reduce biological age by 3-10 years. Aim for 150 minutes of moderate activity weekly, plus strength training twice a week. Even walking 10,000 steps daily significantly impacts longevity.',
  'diet': 'A longevity-focused diet includes: plenty of vegetables and fruits, whole grains, lean proteins, healthy fats (olive oil, nuts), and limited processed foods. The Mediterranean diet is associated with increased lifespan.',
  'stress': 'Chronic stress accelerates cellular aging. Practice stress management through: meditation, deep breathing, regular exercise, adequate sleep, and maintaining social connections. Even 10 minutes of daily meditation can help.',
  'supplements': 'While a healthy diet is best, some supplements may support longevity: Vitamin D, Omega-3 fatty acids, and antioxidants. Always consult a healthcare provider before starting any supplement regimen.',
  'bmi': 'BMI (Body Mass Index) between 18.5-24.9 is considered healthy. However, it doesn\'t account for muscle mass. Focus on body composition and overall health markers rather than just BMI.',
  'heart': 'Heart health is a key longevity factor. Keep your resting heart rate low (60-80 bpm), blood pressure under 120/80 mmHg, and cholesterol in check. Regular cardio exercise strengthens your heart.',
  'default': 'I can help you understand biological age, longevity factors, and health optimization. Ask me about sleep, exercise, diet, stress management, or any specific health metric. For medical advice, please consult a healthcare professional.',
};

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(healthResponses)) {
    if (keyword !== 'default' && lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return healthResponses.default;
}

export function HealthChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your health and longevity assistant. Ask me anything about biological age, lifestyle optimization, or health metrics. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getResponse(input);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          variant="hero"
          size="icon"
          className="w-14 h-14 rounded-full shadow-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="overflow-hidden shadow-2xl border-primary/10">
              {/* Header */}
              <div className="gradient-primary p-4 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">Health Assistant</h3>
                    <p className="text-xs text-primary-foreground/80">AI-powered longevity insights</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        message.role === 'user'
                          ? 'gradient-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about health & longevity..."
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
