"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Lightbulb } from 'lucide-react';
import { createReflection, readReflections, deleteReflection } from '../../lib/reflections_firestore';
import { createReflectionQuestion, readReflectionQuestions, deleteReflectionQuestion } from '../../lib/reflectionQuestions_firestore';
import ReflectionModal from '../../components/ReflectionModal';
import CreateReflectionModal from '../../components/CreateReflectionModal';
import { ReflectionQuestionAnswer, ReflectionInsight } from '../../lib/types';

interface ReflectionQuestion {
  id: string;
  question: string;
}

const ReflectionsPage: React.FC = () => {
  const [reflections, setReflections] = useState<{
    id: string;
    title: string;
    summary: string;
    questionsAnswers: ReflectionQuestionAnswer[];
    insights: ReflectionInsight[];
    createdAt: any;
  }[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<any>(null);
  const [reflectionQuestions, setReflectionQuestions] = useState<ReflectionQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reflectionsList, questionsList] = await Promise.all([
        readReflections('userId'),
        readReflectionQuestions('userId')
      ]);

      setReflections(reflectionsList);
      setReflectionQuestions(questionsList.map(q => ({ id: q.id, question: q.question })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReflection = async (
    title: string,
    summary: string,
    questionsAnswers: ReflectionQuestionAnswer[],
    insights: ReflectionInsight[]
  ) => {
    try {
      await createReflection('userId', title, summary, questionsAnswers, insights);
      fetchData();
    } catch (error) {
      console.error("Error creating reflection:", error);
    }
  };

  const deleteReflectionHandler = async (id: string) => {
    try {
      await deleteReflection('userId', id);
      setReflections(reflections.filter(reflection => reflection.id !== id));
      if (selectedReflection?.id === id) {
        setSelectedReflection(null);
      }
    } catch (error) {
      console.error("Error deleting reflection:", error);
    }
  };

  const addReflectionQuestion = async () => {
    if (newQuestion.trim() === "") return;
    try {
      await createReflectionQuestion('userId', newQuestion);
      setNewQuestion("");
      fetchData();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const deleteReflectionQuestionHandler = async (id: string) => {
    try {
      await deleteReflectionQuestion('userId', id);
      setReflectionQuestions(reflectionQuestions.filter(question => question.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
          <h1 className="text-3xl font-medium text-gray-900">Reflections</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Reflection
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Reflection Questions</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {reflectionQuestions.map((question) => (
                <div key={question.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <p className="text-gray-700">{question.question}</p>
                  <button
                    onClick={() => deleteReflectionQuestionHandler(question.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Add a new question..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && addReflectionQuestion()}
              />
              <button
                onClick={addReflectionQuestion}
                className="ml-3 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Your Reflections</h2>
          <div className="space-y-4">
            {reflections.map(reflection => (
              <div 
                key={reflection.id}
                className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                onClick={() => setSelectedReflection(reflection)}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium text-gray-900">{reflection.title}</h3>
                  <span className="text-xs text-gray-400">
                    {reflection.createdAt.toDate().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{reflection.summary}</p>
                {reflection.insights.length > 0 && (
                  <div className="mt-2 flex items-center text-xs text-yellow-600">
                    <Lightbulb size={14} className="mr-1" />
                    {reflection.insights.length} AI Insight{reflection.insights.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedReflection && (
        <ReflectionModal
          reflection={selectedReflection}
          onClose={() => setSelectedReflection(null)}
          onDelete={deleteReflectionHandler}
        />
      )}

      <CreateReflectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateReflection}
        availableQuestions={reflectionQuestions}
      />
    </div>
  );
};

export default ReflectionsPage;