"use client"

import React, { useState, useEffect } from 'react';
import { X, Pin, Trash2, Plus, ArrowRight, Check, MessageSquare } from 'lucide-react';


interface Reflection {
  id: number;
  title: string;
  summary: string;
  date: Date;
  pinned: boolean;
}

const sampleReflections = [
  {
    id: 1,
    title: "Found clarity in morning meditation routine",
    summary: "Discovered that 15-minute morning meditation significantly improves my focus throughout the day. Will continue this practice.",
    date: new Date(2025, 2, 9),
    pinned: true,
  },
  {
    id: 2,
    title: "Weekly planning reduces daily anxiety",
    summary: "Setting aside 30 minutes on Sunday to plan the week ahead has reduced my daily anxiety and improved productivity.",
    date: new Date(2025, 2, 8),
    pinned: true,
  },
];

const reflectionQuestions = [
  "What's one thing that went well for you today?",
  "What's something you struggled with recently?",
  "What patterns or insights have you noticed about yourself?",
  "What are you grateful for right now?",
  "What's one small change you could make to improve your wellbeing?"
];

const ReflectionsPage: React.FC = () => {
  const [reflections, setReflections] = useState<Reflection[]>(sampleReflections);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReflectModalOpen, setIsReflectModalOpen] = useState(false);

  // States for the new chat-like reflection interface
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});


  const [currentAnswer, setCurrentAnswer] = useState("");
  const [chatComplete, setChatComplete] = useState(false);
  const [reflectionTitle, setReflectionTitle] = useState("");
  const [reflectionSummary, setReflectionSummary] = useState("");
  const [showSummaryInput, setShowSummaryInput] = useState(false);

  // Get current date for comparison
  const now = new Date();

 // Filter reflections by time period
  const pastSevenDays = reflections.filter((reflection) => {
    const diffTime = Math.abs(now.getTime() - reflection.date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && !reflection.pinned;
  });
  
  const pastThirtyDays: Reflection[] = reflections.filter((reflection: Reflection) => {
    const diffTime = Math.abs(now.getTime() - reflection.date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7 && diffDays <= 30 && !reflection.pinned; 
  });
  
  const pastYear: Reflection[] = reflections.filter((reflection: Reflection) => {
    const diffTime = Math.abs(now.getTime() - reflection.date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30 && diffDays <= 365 && !reflection.pinned;
  });
  
  const pinnedReflections: Reflection[] = reflections.filter((reflection: Reflection) => reflection.pinned);

  const deleteReflection = (id: number, e: React.MouseEvent<HTMLButtonElement>) => { //fix
    e?.stopPropagation();
    setReflections(reflections.filter((reflection: Reflection) => reflection.id !== id));
    if (selectedReflection && selectedReflection.id === id) {
      setIsModalOpen(false);
    }
  }; 

  const togglePin = (id: number, e: React.MouseEvent<HTMLButtonElement>) => { //fix
    e.stopPropagation();
    setReflections(reflections.map((reflection: Reflection) => 
      reflection.id === id ? {...reflection, pinned: !reflection.pinned} : reflection
    ));
  };

  const openReflection = (reflection: Reflection) => {
    setSelectedReflection(reflection);
    setIsModalOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const openReflectNowModal = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer("");
    setChatComplete(false);
    setReflectionTitle("");
    setReflectionSummary("");
    setShowSummaryInput(false);
    setIsReflectModalOpen(true);
  };

  const handleAnswerSubmit = () => {
    if (currentAnswer.trim() === "") return;
    
    const updatedAnswers : {[key: number]: string} = {
      ...answers,
      [currentQuestionIndex]: currentAnswer
    };
    setAnswers(updatedAnswers);
    
    if (currentQuestionIndex < reflectionQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setCurrentAnswer("");
    } else {
      setChatComplete(true);
      const firstAnswer = updatedAnswers[0] || "";
      setReflectionTitle(firstAnswer.length > 30 ? 
        firstAnswer.substring(0, 30) + "..." : 
        firstAnswer);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  const saveReflection = () => {
    const newReflection = {
      id: Date.now(),
      title: reflectionTitle,
      summary: reflectionSummary || Object.values(answers).join(' '),
      date: new Date(),
      pinned: false
    };
    
    setReflections([newReflection, ...reflections]);
    
    setIsReflectModalOpen(false);
  };

  const generateInsights = () => {
    const answerTexts: string[] = Object.values(answers);
    
    const insights = [];
    
    if (answerTexts.some(answer => 
      answer.toLowerCase().includes('grateful') || 
      answer.toLowerCase().includes('thankful') ||
      answer.toLowerCase().includes('appreciate')) ) {
      insights.push("Practicing gratitude seems important to you");
    }
    
    if (answerTexts.some(answer => 
      answer.toLowerCase().includes('struggle') || 
      answer.toLowerCase().includes('difficult') ||
      answer.toLowerCase().includes('challenge'))) {
      insights.push("You're working through some challenges");
    }
    
    if (answerTexts.some(answer => 
      answer.toLowerCase().includes('notice') || 
      answer.toLowerCase().includes('pattern') ||
      answer.toLowerCase().includes('consistently'))) {
      insights.push("You're recognizing personal patterns");
    }
    
    if (answerTexts.some(answer => 
      answer.toLowerCase().includes('change') || 
      answer.toLowerCase().includes('improve') ||
      answer.toLowerCase().includes('better'))) {
      insights.push("You're focused on personal growth");
    }
    
    return insights.length > 0 ? insights : ["Reflecting regularly helps build self-awareness"];
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
          <h1 className="text-3xl font-medium text-gray-900">Reflections</h1>
          <button 
            onClick={openReflectNowModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Reflect Now
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Pinned Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedReflections.map(reflection => (
              <div 
                key={reflection.id}
                className="bg-gray-50 backdrop-blur-lg rounded-2xl p-5 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                onClick={() => openReflection(reflection)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{reflection.title}</h3>
                  <div className="flex space-x-2">
                    <button //fix
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => togglePin(reflection.id, e)}
                      className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                    >
                      <Pin size={16} className="fill-blue-500" />
                    </button>
                    <button
                      onClick={(e) => deleteReflection(reflection.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{reflection.summary}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(reflection.date)}</p>
              </div>
            ))}
          </div>
        </div>
        
        {pastSevenDays.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Past 7 Days</h2>
            <div className="space-y-3 overflow-y-auto max-h-96 pr-2">
              {pastSevenDays.map(reflection => (
                <div 
                  key={reflection.id}
                  className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 flex justify-between"
                  onClick={() => openReflection(reflection)}
                >
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-gray-900">{reflection.title}</h3>
                      <span className="text-xs text-gray-400">{formatDate(reflection.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{reflection.summary}</p>
                  </div>
                  <div className="flex items-start ml-4 space-x-2">
                    <button //fix
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => togglePin(reflection.id, e)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                    >
                      <Pin size={16} />
                    </button>
                    <button
                      onClick={(e) => deleteReflection(reflection.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {pastThirtyDays.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Past 30 Days</h2>
            <div className="space-y-3 overflow-y-auto max-h-96 pr-2">
              {pastThirtyDays.map(reflection => (
                <div 
                  key={reflection.id}
                  className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 flex justify-between"
                  onClick={() => openReflection(reflection)}
                >
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-gray-900">{reflection.title}</h3>
                      <span className="text-xs text-gray-400">{formatDate(reflection.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{reflection.summary}</p>
                  </div>
                  <div className="flex items-start ml-4 space-x-2">
                    <button //fix
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => togglePin(reflection.id, e)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                    >
                      <Pin size={16} />
                    </button>
                    <button
                      onClick={(e) => deleteReflection(reflection.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {pastYear.length > 0 && (
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Past Year</h2>
            <div className="space-y-3 overflow-y-auto max-h-96 pr-2">
              {pastYear.map(reflection => (
                <div 
                  key={reflection.id}
                  className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 flex justify-between"
                  onClick={() => openReflection(reflection)}
                >
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-gray-900">{reflection.title}</h3>
                      <span className="text-xs text-gray-400">{formatDate(reflection.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{reflection.summary}</p>
                  </div>
                  <div className="flex items-start ml-4 space-x-2">
                    <button //fix
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => togglePin(reflection.id, e)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                    >
                      <Pin size={16} />
                    </button>
                    <button
                      onClick={(e) => deleteReflection(reflection.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isModalOpen && selectedReflection && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-lg max-w-lg w-full p-6 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-2"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-900">{selectedReflection.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{formatDate(selectedReflection.date)}</p>
              </div>
              
              <p className="text-gray-700">{selectedReflection.summary}</p>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button //fix
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => togglePin(selectedReflection.id, e)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${selectedReflection.pinned ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'} transition-colors`}
                >
                  <Pin size={16} className={`mr-1 ${selectedReflection.pinned ? 'fill-blue-500' : ''}`} />
                  {selectedReflection.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={(e) => deleteReflection(selectedReflection.id, e)}
                  className="flex items-center px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isReflectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-6 relative">
              <button 
                onClick={() => setIsReflectModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-2"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-900">Reflection Session</h2>
                <p className="text-sm text-gray-500 mt-1">Take a moment to reflect on your thoughts and experiences</p>
              </div>
              
              <div className="mb-6 overflow-y-auto max-h-96 bg-gray-50 rounded-2xl p-4">
                {chatComplete ? (
                  <div className="space-y-4">
                    {reflectionQuestions.map((question, index) => (
                      <div key={index}>
                        <div className="flex items-start mb-2">
                          <div className="bg-blue-100 text-blue-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                            {question}
                          </div>
                        </div>
                        {answers[index] && (
                          <div className="flex items-start justify-end mb-4" key={`answer-${index}`}>
                            <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              {answers[index]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-8 border border-blue-100 bg-blue-50 rounded-2xl p-4">
                      <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                        <MessageSquare size={18} className="mr-2" />
                        Key Insights
                      </h3>
                      <ul className="space-y-2">
                        {generateInsights().map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={16} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reflectionQuestions.slice(0, currentQuestionIndex + 1).map((question, index) => (
                      <div key={index}>
                        <div className="flex items-start mb-2">
                          <div className="bg-blue-100 text-blue-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                            {question}
                          </div>
                        </div>
                        {(index < currentQuestionIndex || (index === currentQuestionIndex && answers[index])) && (
                          <div className="flex items-start justify-end mb-4" key={`answer-${index}`}>
                            <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              {answers[index]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {!chatComplete ? (
                <div className="flex items-end space-x-2">
                  <textarea 
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your answer..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={currentAnswer.trim() === ""}
                    className={`p-3 rounded-full ${currentAnswer.trim() !== "" ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200'} text-white transition-colors`}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title for this reflection</label>
                    <input 
                      type="text" 
                      id="title" 
                      value={reflectionTitle}
                      onChange={(e) => setReflectionTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Give your reflection a title"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowSummaryInput(!showSummaryInput)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      {showSummaryInput ? "Hide summary field" : "Add a summary (optional)"}
                    </button>
                  </div>
                  
                  {showSummaryInput && (
                    <div>
                      <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                      <textarea 
                        id="summary" 
                        value={reflectionSummary}
                        onChange={(e) => setReflectionSummary(e.target.value)}
                        rows={3} 
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Add a summary of your reflection..."
                      ></textarea>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={saveReflection}
                      className="px-6 py-3 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                    >
                      Save Reflection
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionsPage;