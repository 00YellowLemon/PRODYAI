"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { readReflectionQuestions } from '../../../lib/reflectionQuestions_firestore';
import { createReflection } from '../../../lib/reflections_firestore';
import { getReflectionInsights } from '../../../services/apiService';
import { ReflectionQuestionAnswer, ReflectionInsight } from '../../../lib/types';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  questionId?: string;
}

const ChatReflectionPage: React.FC = () => {
  const router = useRouter();
  const [reflectionQuestions, setReflectionQuestions] = useState<{ id: string; question: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionSummary, setReflectionSummary] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [insights, setInsights] = useState<ReflectionInsight[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch reflection questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsList = await readReflectionQuestions('userId');
        setReflectionQuestions(questionsList.map(q => ({ id: q.id, question: q.question })));
        setIsLoading(false);
        
        // Start the reflection with a welcome message
        setMessages([
          {
            id: '0',
            content: "Welcome to your guided reflection. I'll ask you a series of questions to help you reflect. Let's start with the title of your reflection.",
            isUser: false
          }
        ]);
        
        // Set up the title question as the first step
        setCurrentQuestionIndex(-1);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus the input field when a new question is asked
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestionIndex]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const message = userInput.trim();
    setUserInput('');

    // Handle title input (before starting questions)
    if (currentQuestionIndex === -1) {
      setReflectionTitle(message);
      setMessages([
        ...messages,
        { id: Date.now().toString(), content: message, isUser: true },
        { id: (Date.now() + 1).toString(), content: "Great title! Now, please provide a brief summary of what you'd like to reflect on today.", isUser: false }
      ]);
      setCurrentQuestionIndex(-2); // Move to summary step
      return;
    }

    // Handle summary input
    if (currentQuestionIndex === -2) {
      setReflectionSummary(message);
      setMessages([
        ...messages,
        { id: Date.now().toString(), content: message, isUser: true },
        { id: (Date.now() + 1).toString(), content: "Thanks for the summary. Now let's begin with the reflection questions.", isUser: false }
      ]);
      
      // If there are questions, start with the first one
      if (reflectionQuestions.length > 0) {
        const firstQuestion = reflectionQuestions[0];
        setMessages(prev => [
          ...prev,
          { 
            id: (Date.now() + 2).toString(), 
            content: firstQuestion.question, 
            isUser: false,
            questionId: firstQuestion.id
          }
        ]);
        setCurrentQuestionIndex(0);
      } else {
        // If no questions, go straight to insights
        setMessages(prev => [
          ...prev,
          { 
            id: (Date.now() + 2).toString(), 
            content: "There are no reflection questions set up. Let's generate insights based on your title and summary.", 
            isUser: false
          }
        ]);
        generateInsights();
      }
      return;
    }

    // Handle question answers
    const currentQuestion = reflectionQuestions[currentQuestionIndex];
    
    // Save the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: message
    }));

    // Add user's answer to messages
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), content: message, isUser: true }
    ]);

    // Move to next question or generate insights if done
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < reflectionQuestions.length) {
      // Ask the next question
      const nextQuestion = reflectionQuestions[nextIndex];
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          content: nextQuestion.question, 
          isUser: false,
          questionId: nextQuestion.id
        }
      ]);
      setCurrentQuestionIndex(nextIndex);
    } else {
      // All questions answered, generate insights
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          content: "Thank you for your reflections. I'm now generating insights based on your answers...", 
          isUser: false
        }
      ]);
      generateInsights();
    }
  };

  const generateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      // Combine all answers for AI analysis
      const reflectionText = Object.entries(answers).map(([id, answer]) => {
        const question = reflectionQuestions.find(q => q.id === id)?.question || '';
        return `${question}: ${answer}`;
      }).join('\n\n');
      
      // Add title and summary to the reflection text
      const fullReflectionText = `Title: ${reflectionTitle}\nSummary: ${reflectionSummary}\n\n${reflectionText}`;
      
      // Generate insights
      const { insights: generatedInsights } = await getReflectionInsights(fullReflectionText);
      setInsights(generatedInsights);
      
      // Display insights in the chat
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          content: "Based on your reflections, I've generated these insights:", 
          isUser: false
        }
      ]);

      // Add each insight as a separate message
      generatedInsights.forEach((insight, index) => {
        setMessages(prev => [
          ...prev,
          { 
            id: (Date.now() + 2 + index).toString(), 
            content: `
              <div class="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <div class="mb-3">
                  <h4 class="font-medium text-yellow-800 mb-1">Thinking Patterns</h4>
                  <p class="text-yellow-700">${insight.thinking}</p>
                </div>
                
                <div class="mb-3">
                  <h4 class="font-medium text-yellow-800 mb-1">Potential Blindspots</h4>
                  <p class="text-yellow-700">${insight.blindspot}</p>
                </div>
                
                <div class="mb-3">
                  <h4 class="font-medium text-yellow-800 mb-1">Growth Opportunity</h4>
                  <p class="text-yellow-700">${insight.growth}</p>
                </div>
                
                <div>
                  <h4 class="font-medium text-yellow-800 mb-1">Recommended Action</h4>
                  <p class="text-yellow-700">${insight.action}</p>
                </div>
              </div>
            `, 
            isUser: false
          }
        ]);
      });

      // Add completion message and save the reflection
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 100).toString(), 
          content: "Your reflection has been saved. You can view it in your reflections list.", 
          isUser: false
        }
      ]);

      // Prepare Q&A pairs for saving
      const questionsAnswers: ReflectionQuestionAnswer[] = Object.entries(answers).map(([id, answer]) => ({
        question: reflectionQuestions.find(q => q.id === id)?.question || '',
        answer
      }));
      
      // Save the reflection
      await createReflection('userId', reflectionTitle, reflectionSummary, questionsAnswers, generatedInsights);
      
      setIsComplete(true);
    } catch (error) {
      console.error("Error generating insights:", error);
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          content: "I apologize, but I couldn't generate insights at this time. Your reflection has still been saved.", 
          isUser: false
        }
      ]);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const navigateBack = () => {
    router.push('/reflections');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center">
          <button 
            onClick={navigateBack}
            className="p-2 rounded-full hover:bg-gray-100 mr-3"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium text-gray-900">Guided Reflection</h1>
        </div>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full px-6">
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </div>
            ))}
            {isGeneratingInsights && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white border border-gray-200 text-gray-700 flex items-center">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Generating insights...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        {!isComplete && (
          <div className="py-4 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGeneratingInsights}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isGeneratingInsights}
                className={`ml-2 p-3 rounded-full ${
                  !userInput.trim() || isGeneratingInsights
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors duration-200`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
        
        {/* Completed Reflection Actions */}
        {isComplete && (
          <div className="py-4 border-t border-gray-200 bg-white sticky bottom-0">
            <button
              onClick={navigateBack}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors duration-200"
            >
              Return to Reflections
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatReflectionPage;