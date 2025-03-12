"use client"

import React from 'react';
import { ArrowRight, Clock, Zap, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define types for our data structures
interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface Insight {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface ChatHistory {
  id: number;
  title: string;
  summary: string;
  time: string;
}

const Dashboard: React.FC<{}> = () => {
  const router = useRouter();

  // Sample data with proper typing
  const topTasks: Task[] = [
    { id: 1, title: "Review Q1 Marketing Plan", dueDate: "Today", priority: "High" },
    { id: 2, title: "Prepare Financial Report", dueDate: "Tomorrow", priority: "Medium" },
    { id: 3, title: "Team Sync Meeting", dueDate: "Wed, Mar 12", priority: "Medium" }
  ];

  const latestInsights: Insight[] = [
    { id: 1, title: "User Engagement Up 27%", description: "Daily active users have increased significantly over the past month.", date: "2 hours ago" },
    { id: 2, title: "Revenue Milestone Reached", description: "Q1 revenue projections exceeded by 15%, marking our best quarter yet.", date: "Yesterday" },
    { id: 3, title: "New Market Opportunity", description: "Analysis shows potential for expansion in APAC region with minimal investment.", date: "Mar 8, 2025" }
  ];

  const chatHistory: ChatHistory[] = [
    { id: 1, title: "Product Roadmap Analysis", summary: "Discussed Q2 feature priorities and resource allocation.", time: "1 hour ago" },
    { id: 2, title: "Competitor Research", summary: "Analyzed recent market moves by key competitors.", time: "Yesterday" },
    { id: 3, title: "Customer Feedback Summary", summary: "Reviewed top themes from recent customer interviews.", time: "Mar 9, 2025" }
  ];

  // Helper function for priority badge styling
  const getPriorityBadgeClasses = (priority: Task['priority']): string => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'Low':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-medium text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Tuesday, March 11, 2025</p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Top Tasks Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-slate-900">Top Tasks</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {topTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-900">{task.title}</h3>
                        <div className="mt-1 flex items-center space-x-3">
                          <span className="flex items-center text-sm text-slate-500">
                            <Clock size={14} className="mr-1" />
                            {task.dueDate}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadgeClasses(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
                        aria-label={`View task: ${task.title}`}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                  aria-label="View all tasks"
                  onClick={() => router.push('/tasks')}
                >
                  See all tasks
                  <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </section>

          {/* Latest Insights Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-slate-900">Latest Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestInsights.map((insight) => (
                <div key={insight.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="p-4 flex-grow">
                    <div className="flex items-start mb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Zap size={16} className="text-blue-600" />
                      </div>
                      <h3 className="font-medium text-slate-900">{insight.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                    <p className="text-xs text-slate-400">{insight.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right">
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center ml-auto"
                aria-label="View all insights"
                onClick={() => router.push('/reflections')}
              >
                See all insights
                <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </section>

          {/* AI Chat History Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-slate-900">AI Chat History</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex">
                      <div className="bg-purple-100 p-2 rounded-full mr-3 h-fit">
                        <MessageSquare size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{chat.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{chat.summary}</p>
                        <p className="text-xs text-slate-400 mt-2">{chat.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                  aria-label="Show more chat history"
                >
                  Show more
                  <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
