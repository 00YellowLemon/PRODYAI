import { X, Lightbulb, Trash2 as Trash2Icon } from 'lucide-react';
import { ReflectionQuestionAnswer, ReflectionInsight } from '../lib/types';

interface ReflectionModalProps {
  reflection: {
    id: string;
    title: string;
    summary: string;
    questionsAnswers: ReflectionQuestionAnswer[];
    insights: ReflectionInsight[];
    createdAt: any;
  };
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ reflection, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-2"
        >
          <X size={20} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">{reflection.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {reflection.createdAt.toDate().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-700">{reflection.summary}</p>
        </div>
        
        {reflection.questionsAnswers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Reflection Q&A</h3>
            <div className="space-y-4">
              {reflection.questionsAnswers.map((qa, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-700 mb-1">Q: {qa.question}</p>
                  <p className="text-gray-600">A: {qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {reflection.insights.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Lightbulb size={18} className="mr-2 text-yellow-500" />
              AI-Generated Insights
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {reflection.insights.map((insight, index) => (
                <div key={index} className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="mb-3">
                    <h4 className="font-medium text-yellow-800 mb-1">Thinking Patterns</h4>
                    <p className="text-yellow-700">{insight.thinking}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-yellow-800 mb-1">Potential Blindspots</h4>
                    <p className="text-yellow-700">{insight.blindspot}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-yellow-800 mb-1">Growth Opportunity</h4>
                    <p className="text-yellow-700">{insight.growth}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Recommended Action</h4>
                    <p className="text-yellow-700">{insight.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => onDelete(reflection.id)}
            className="flex items-center px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2Icon size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionModal;