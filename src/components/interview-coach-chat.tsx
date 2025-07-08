
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { interviewCoach } from '@/ai/flows/ai-interview-coach';
import { summarizeInterview } from '@/ai/flows/summarize-interview';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { saveInterviewResult } from '@/lib/internship-data-manager';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Bot, Loader2, Send, User, Award, Volume2, Mic, MicOff } from 'lucide-react';
import type { Internship, StudentProfile, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface InterviewCoachChatProps {
  studentProfile: StudentProfile;
  internships: Internship[];
}

export function InterviewCoachChat({ studentProfile, internships }: InterviewCoachChatProps) {
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isTtsDisabled, setIsTtsDisabled] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const wasRecordingRef = useRef(false);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const studentProfileString = `Name: ${studentProfile.name}, Education: ${studentProfile.education}, Skills: ${studentProfile.skills}, About: ${studentProfile.about}`;

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !selectedInternshipId) {
        if (!selectedInternshipId) {
            toast({ title: 'Please select an internship first.', variant: 'destructive' });
        }
        return;
    }

    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSpeakingMessageIndex(null);

    const newUserMessage: Message = { role: 'user', content: inputMessage };
    const currentInput = inputMessage;
    const conversationHistory = messages; // Capture the history *before* adding the new message

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const selectedInternship = internships.find(i => i.id === selectedInternshipId);
      if (!selectedInternship) throw new Error('Internship not found');

      const result = await interviewCoach({
        studentProfile: studentProfileString,
        selectedInternship: `Title: ${selectedInternship.title}, Description: ${selectedInternship.description}`,
        conversationHistory: conversationHistory,
        userMessage: currentInput,
        customQuestions: selectedInternship.customQuestions,
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
      setMessages(conversationHistory); // On failure, revert to the old state
    }
    setIsLoading(false);
  }, [inputMessage, selectedInternshipId, messages, internships, studentProfileString, toast]);

  useEffect(() => {
    // Auto-send message after recording stops
    if (wasRecordingRef.current && !isRecording && inputMessage.trim() && !isLoading) {
      handleSendMessage();
    }
    wasRecordingRef.current = isRecording;
  }, [isRecording, inputMessage, isLoading, handleSendMessage]);

  useEffect(() => {
    setIsSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }, []);

  useEffect(() => {
    if (!isSpeechSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setInputMessage(transcript);
      
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      speechTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 10000); // 10-second pause timeout
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        toast({
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings.',
            variant: 'destructive',
        });
      }
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
        }
    }
  }, [isSpeechSupported, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && !isLoading && !isTtsDisabled) {
        const messageIndex = messages.length - 1;
        
        const playAudio = async () => {
            try {
                setSpeakingMessageIndex(messageIndex);
                const result = await textToSpeech(lastMessage.content);
                if (audioRef.current) {
                    audioRef.current.src = result.audioDataUri;
                    audioRef.current.play();
                }
            } catch (err) {
                console.error("Failed to generate or play audio", err);
                if (err instanceof Error && (err.message.includes('429') || err.message.toLowerCase().includes('quota'))) {
                    toast({
                        title: "AI Voice Disabled",
                        description: "You've exceeded the free daily limit for audio generation. The interview will continue in text-only mode.",
                        variant: "destructive",
                    });
                    setIsTtsDisabled(true);
                } else {
                     toast({
                        title: "Audio Error",
                        description: "An unexpected error occurred with the AI voice. Please try again.",
                        variant: "destructive",
                    });
                }
                setSpeakingMessageIndex(null);
            }
        };

        playAudio();
    }
  }, [messages, isLoading, isTtsDisabled, toast]);

  const handleEndInterview = async () => {
    if (messages.length === 0) {
        toast({ title: 'There is no conversation to summarize.', variant: 'destructive' });
        return;
    }

    setIsSummarizing(true);
    setSummary('');
    try {
        const selectedInternship = internships.find(i => i.id === selectedInternshipId);
        if (!selectedInternship) throw new Error('Internship not found');

        const result = await summarizeInterview({
            studentProfile: studentProfileString,
            selectedInternship: `Title: ${selectedInternship.title}, Description: ${selectedInternship.description}`,
            conversationHistory: messages,
        });

        setSummary(result.summary);
        setIsSummaryDialogOpen(true);

        if (selectedInternshipId && studentProfile.email) {
            saveInterviewResult(
                selectedInternshipId,
                studentProfile.email,
                messages,
                result.summary
            );
            toast({ 
                title: "Feedback Saved!", 
                description: "The employer can now view your interview results."
            });
        }

    } catch (error) {
        console.error('Error summarizing interview:', error);
        toast({
            title: 'Error',
            description: 'Failed to generate summary. Please try again.',
            variant: 'destructive',
        });
    }
    setIsSummarizing(false);
  };
  
  const handleResetChat = () => {
    setMessages([]);
    setSummary('');
    setIsSummaryDialogOpen(false);
    if (audioRef.current) {
        audioRef.current.pause();
    }
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    setSpeakingMessageIndex(null);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      recognitionRef.current.stop();
    } else {
      setInputMessage('');
      recognitionRef.current.start();
    }
  };

  const selectedInternship = internships.find(i => i.id === selectedInternshipId);

  return (
    <>
      <Card className="h-[70vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <Select onValueChange={(value) => { setSelectedInternshipId(value); handleResetChat(); }} value={selectedInternshipId || ''}>
            <SelectTrigger className="w-full md:w-[350px]">
              <SelectValue placeholder="Select an internship to practice for..." />
            </SelectTrigger>
            <SelectContent>
              {internships.map(internship => (
                <SelectItem key={internship.id} value={internship.id}>{internship.title} at {internship.company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleEndInterview} disabled={isLoading || isSummarizing || messages.length === 0} variant="outline">
            {isSummarizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</> : <><Award className="mr-2 h-4 w-4"/>Get Feedback</>}
          </Button>
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
                      <p>Say "hi", or press the mic to start!</p>
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
                          'max-w-sm md:max-w-md rounded-xl px-4 py-3 relative',
                          message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                      )}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {speakingMessageIndex === index && (
                             <Volume2 className="h-4 w-4 absolute -bottom-1 -right-1 text-primary animate-pulse" />
                          )}
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
              placeholder="Type your answer or use the mic..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading || !selectedInternshipId || isSummarizing}
            />
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    onClick={handleMicClick} 
                    variant="outline" 
                    size="icon" 
                    disabled={isLoading || !selectedInternshipId || isSummarizing || !isSpeechSupported}
                  >
                    {isRecording 
                      ? <MicOff className="h-4 w-4 text-destructive animate-pulse" /> 
                      : <Mic className="h-4 w-4" />
                    }
                    <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSpeechSupported ? (isRecording ? "Recording..." : "Speak your answer") : "Speech not supported"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={handleSendMessage} disabled={isLoading || !selectedInternshipId || isSummarizing || !inputMessage.trim()}>
              <Send className="h-4 w-4"/>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <audio ref={audioRef} onEnded={() => setSpeakingMessageIndex(null)} className="hidden" />

      <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
                <AlertDialogTitle>Interview Performance Summary</AlertDialogTitle>
                <AlertDialogDescription>
                    Here is a summary of your performance based on the mock interview.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <ScrollArea className="h-[50vh] pr-6 rounded-md border p-4">
                <div className="text-sm text-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
            </ScrollArea>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleResetChat}>
                    Start New Interview
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
