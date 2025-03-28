import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getReflectionInsights } from '../services/apiService';

interface CreateReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    summary: string,
    questionsAnswers: { question: string; answer: string }[],
    insights: { thinking: string; blindspot: string; growth: string; action: string }[]
  ) => Promise<void>;
  availableQuestions: { id: string; question: string }[];
}

const CreateReflectionModal: React.FC<CreateReflectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableQuestions
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<{id: string; question: string}[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsGenerating(true);
    try {
      // Combine all answers for AI analysis
      const reflectionText = selectedQuestions.map(q => 
        `${q.question}: ${answers[q.id] || ''}`
      ).join('\n\n');
      
      // Generate insights
      const { insights } = await getReflectionInsights(reflectionText);
      
      // Prepare Q&A pairs
      const questionsAnswers = selectedQuestions.map(q => ({
        question: q.question,
        answer: answers[q.id] || ''
      }));
      
      // Save everything
      await onSave(title, summary, questionsAnswers, insights);
      
      // Reset form
      setTitle('');
      setSummary('');
      setSelectedQuestions([]);
      setAnswers({});
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-2"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-medium text-gray-900 mb-6">Create New Reflection</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reflection title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Overall summary of your reflection"
            />
          </div>
          
          {selectedQuestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Your Reflection Answers</h3>
              {selectedQuestions.map((question) => (
                <div key={question.id} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-700 mb-2">{question.question}</p>
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => setAnswers({
                      ...answers,
                      [question.id]: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>
          )}
          
          {availableQuestions.filter(q => !selectedQuestions.some(sq => sq.id === q.id)).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Reflection Questions</label>
              <select
                onChange={(e) => {
                  const questionId = e.target.value;
                  if (questionId) {
                    const question = availableQuestions.find(q => q.id === questionId);
                    if (question) {
                      setSelectedQuestions([...selectedQuestions, question]);
                    }
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value=""
              >
                <option value="">Select a question to add</option>
                {availableQuestions
                  .filter(q => !selectedQuestions.some(sq => sq.id === q.id))
                  .map(question => (
                    <option key={question.id} value={question.id}>
                      {question.question}
                    </option>
                  ))}
              </select>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={!title.trim() || isGenerating}
              className={`px-6 py-3 rounded-full text-white font-medium transition-colors ${
                !title.trim() || isGenerating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isGenerating ? 'Generating Insights...' : 'Save Reflection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReflectionModal;