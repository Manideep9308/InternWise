'use client';

import { useState, useRef, useEffect } from 'react';
import { interviewCoach } from '@/ai/flows/ai-interview-coach';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Bot, Loader2, Send, User } from 'lucide-react';
import type { Internship, StudentProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface InterviewCoachChatProps {
  studentProfile: StudentProfile;
  internships: Internship[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function InterviewCoachChat({ studentProfile, internships }: InterviewCoachChatProps) {
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] =useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const studentProfileString = `Name: ${studentProfile.name}, Education: ${studentProfile.education}, Skills: ${studentProfile.skills}, About: ${studentProfile.about}`;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedInternshipId) {
        if (!selectedInternshipId) {
            toast({ title: 'Please select an internship first.', variant: 'destructive' });
        }
        return;
    }

    const newUserMessage: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const selectedInternship = internships.find(i => i.id === selectedInternshipId);
      if (!selectedInternship) throw new Error('Internship not found');

      const result = await interviewCoach({
        studentProfile: studentProfileString,
        selectedInternship: `Title: ${selectedInternship.title}, Description: ${selectedInternship.description}`,
        userMessage: inputMessage,
      });

      const newAiMessage: Message = { role: 'assistant', content: result.aiResponse };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Error with AI Coach:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI coach. Please try again.',
        variant: 'destructive',
      });
      setMessages(prev => prev.slice(0, -1)); // Remove the user message if AI fails
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);
  
  const selectedInternship = internships.find(i => i.id === selectedInternshipId);

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <Select onValueChange={setSelectedInternshipId} value={selectedInternshipId || ''}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an internship to practice for..." />
          </SelectTrigger>
          <SelectContent>
            {internships.map(internship => (
              <SelectItem key={internship.id} value={internship.id}>{internship.title} at {internship.company}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {!selectedInternshipId ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4"/>
                    <p>Please select an internship to begin your mock interview.</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4"/>
                    <p>You've selected to practice for <span className="font-semibold text-foreground">{selectedInternship?.title}</span>.</p>
                    <p>Say "hi" or "let's start" to begin!</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn(
                        'max-w-sm md:max-w-md rounded-xl px-4 py-3',
                        message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                    )}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback><User size={20}/></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))
            )}
             {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-xl px-4 py-3 rounded-bl-none flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your answer..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading || !selectedInternshipId}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !selectedInternshipId}>
            <Send className="h-4 w-4"/>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
