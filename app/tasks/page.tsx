"use client"

import React, { useState } from 'react';
import { Plus, GripVertical, XCircle, MoveVertical } from 'lucide-react';

interface Task {
  id: string;
  content: string;
}

interface TaskLists {
  longTermGoals: Task[];
  highUrgentHighImportant: Task[];
  highImportantLowUrgent: Task[];
  highUrgentLowImportant: Task[];
  lowUrgentLowImportant: Task[];
}

interface TaskInputs {
  longTermGoals: string;
  highUrgentHighImportant: string;
  highImportantLowUrgent: string;
  highUrgentLowImportant: string;
  lowUrgentLowImportant: string;
}

interface ShowInputsState {
  longTermGoals: boolean;
  highUrgentHighImportant: boolean;
  highImportantLowUrgent: boolean;
  highUrgentLowImportant: boolean;
  lowUrgentLowImportant: boolean;
}

interface ColorScheme {
  border: string;
  bg: string;
  hover: string;
  light: string;
}

interface ColorSchemes {
  longTermGoals: ColorScheme;
  highUrgentHighImportant: ColorScheme;
  highImportantLowUrgent: ColorScheme;
  highUrgentLowImportant: ColorScheme;
  lowUrgentLowImportant: ColorScheme;
}

type ListId = keyof TaskLists;

const initialData: TaskLists = {
  longTermGoals: [
    { id: 'goal-1', content: 'Complete master\'s degree' },
    { id: 'goal-2', content: 'Launch personal portfolio website' }
  ],
  highUrgentHighImportant: [
    { id: 'task-1', content: 'Finish quarterly report' },
    { id: 'task-2', content: 'Prepare for client meeting' }
  ],
  highImportantLowUrgent: [
    { id: 'task-3', content: 'Research new technologies' },
    { id: 'task-4', content: 'Plan team building activities' }
  ],
  highUrgentLowImportant: [
    { id: 'task-5', content: 'Respond to emails' },
    { id: 'task-6', content: 'Schedule social media posts' }
  ],
  lowUrgentLowImportant: [
    { id: 'task-7', content: 'Clean up desktop files' },
    { id: 'task-8', content: 'Update software' }
  ]
};

const TaskManagementPage: React.FC = () => {
  const [data, setData] = useState<TaskLists>(initialData);
  const [newTaskContents, setNewTaskContents] = useState<TaskInputs>({
    longTermGoals: '',
    highUrgentHighImportant: '',
    highImportantLowUrgent: '',
    highUrgentLowImportant: '',
    lowUrgentLowImportant: '',
  });
  const [showInputs, setShowInputs] = useState<ShowInputsState>({
    longTermGoals: false,
    highUrgentHighImportant: false,
    highImportantLowUrgent: false,
    highUrgentLowImportant: false,
    lowUrgentLowImportant: false,
  });
  const [draggedItem, setDraggedItem] = useState<Task | null>(null);
  const [dragSourceList, setDragSourceList] = useState<ListId | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Task, listId: ListId): void => {
    setDraggedItem(item);
    setDragSourceList(listId);
    e.dataTransfer.effectAllowed = 'move';
    const ghost = document.createElement('div');
    ghost.classList.add('invisible');
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => {
      ghost.remove();
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, listId: ListId): void => {
    e.preventDefault();
    if (listId === 'longTermGoals' && dragSourceList !== 'longTermGoals') {
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, listId: ListId): void => {
    e.preventDefault();
    
    if (!draggedItem || dragSourceList === null) return;
    
    if (listId === 'longTermGoals' && dragSourceList !== 'longTermGoals') {
      return;
    }
    
    if (listId === dragSourceList) {
    } else {
      const newSourceList = data[dragSourceList].filter(
        item => item.id !== draggedItem.id
      );
      
      const newDestList = [...data[listId], draggedItem];
      
      setData(prev => ({
        ...prev,
        [dragSourceList]: newSourceList,
        [listId]: newDestList
      }));
    }
    
    setDraggedItem(null);
    setDragSourceList(null);
  };

  const addNewTask = (listId: ListId): void => {
    if (!newTaskContents[listId].trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskContents[listId]
    };

    setData(prev => ({
      ...prev,
      [listId]: [...prev[listId], newTask]
    }));

    setNewTaskContents(prev => ({
      ...prev,
      [listId]: ''
    }));

    setShowInputs(prev => ({
      ...prev,
      [listId]: false
    }));
  };

  const removeTask = (listId: ListId, taskId: string): void => {
    setData(prev => ({
      ...prev,
      [listId]: prev[listId].filter(task => task.id !== taskId)
    }));
  };

  const toggleInput = (listId: ListId): void => {
    setShowInputs(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, listId: ListId): void => {
    if (e.key === 'Enter') {
      addNewTask(listId);
    }
  };

  const listColors: ColorSchemes = {
    longTermGoals: {
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      light: 'bg-purple-50'
    },
    highUrgentHighImportant: {
      border: 'border-red-500',
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      light: 'bg-red-50'
    },
    highImportantLowUrgent: {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      light: 'bg-blue-50'
    },
    highUrgentLowImportant: {
      border: 'border-amber-500',
      bg: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      light: 'bg-amber-50'
    },
    lowUrgentLowImportant: {
      border: 'border-green-500',
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600',
      light: 'bg-green-50'
    }
  };

  const renderTaskList = (listId: ListId, title: string) => {
    const colors = listColors[listId];
    
    return (
      <div 
        className={`bg-white rounded-lg shadow-md p-5 mb-6 border-l-4 ${colors.border}`}
        onDragOver={(e) => handleDragOver(e, listId)}
        onDrop={(e) => handleDrop(e, listId)}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={() => toggleInput(listId)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Add new task"
          >
            <Plus size={20} className="text-gray-700" />
          </button>
        </div>

        {showInputs[listId] && (
          <div className="mb-4 flex">
            <input
              type="text"
              value={newTaskContents[listId]}
              onChange={(e) => setNewTaskContents(prev => ({ ...prev, [listId]: e.target.value }))}
              onKeyPress={(e) => handleKeyPress(e, listId)}
              placeholder="Add new task..."
              className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button 
              onClick={() => addNewTask(listId)}
              className={`px-4 py-2 ${colors.bg} text-white rounded-r ${colors.hover} transition-colors`}
            >
              Add
            </button>
          </div>
        )}

        <div className="min-h-32">
          {data[listId].map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item, listId)}
              className={`p-4 mb-2 rounded-lg bg-gray-50 border border-gray-200 group flex justify-between items-center cursor-move hover:shadow-sm transition-all`}
            >
              <div className="flex items-center flex-1">
                <GripVertical size={18} className="mr-3 text-gray-400" />
                <p className="text-gray-800">{item.content}</p>
              </div>
              <button 
                onClick={() => removeTask(listId, item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove task"
              >
                <XCircle size={18} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
          {data[listId].length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <MoveVertical size={24} className="mb-2" />
              <p>Drag tasks here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">Organize your goals and prioritize your tasks</p>
        </header>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Long Term Goals</h2>
          </div>
          {renderTaskList('longTermGoals', 'Goals & Aspirations')}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <div className="text-sm text-gray-500">Drag and drop to prioritize</div>
          </div>
          
          {renderTaskList('highUrgentHighImportant', 'Urgent & Important')}
          {renderTaskList('highImportantLowUrgent', 'Important, Not Urgent')}
          {renderTaskList('highUrgentLowImportant', 'Urgent, Not Important')}
          {renderTaskList('lowUrgentLowImportant', 'Not Urgent, Not Important')}
        </section>
      </div>
    </div>
  );
};

export default TaskManagementPage;