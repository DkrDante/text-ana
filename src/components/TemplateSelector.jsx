import React, { useState } from 'react';
import { conversationTemplates, getAllCategories } from '../data/conversationTemplates.js';

const TemplateSelector = ({ onTemplateSelect, isOpen, onToggle }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = getAllCategories();

  const filteredTemplates = selectedCategory === 'all' 
    ? conversationTemplates 
    : conversationTemplates.filter(t => t.category === selectedCategory);

  const categoryStyles = {
    dating: 'bg-pink-500/20 border-pink-400/50 text-pink-300',
    warning: 'bg-red-500/20 border-red-400/50 text-red-300',
    positive: 'bg-green-500/20 border-green-400/50 text-green-300',
    friendship: 'bg-blue-500/20 border-blue-400/50 text-blue-300',
    professional: 'bg-purple-500/20 border-purple-400/50 text-purple-300'
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:text-cyan-200 transition-all duration-200 text-sm backdrop-blur-sm flex items-center gap-2"
      >
        <span>📝</span>
        Try Example Conversations
      </button>
    );
  }

  return (
    <div className="mb-4 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-purple-400/20 ring-1 ring-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-200 flex items-center gap-2">
          <span>📝</span>
          Example Conversations
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'all' 
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50' 
                : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:text-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                selectedCategory === category 
                  ? categoryStyles[category] || 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                  : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:text-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => {
              onTemplateSelect(template.conversation);
              onToggle();
            }}
            className={`p-3 rounded-lg border backdrop-blur-sm text-left transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              categoryStyles[template.category] || 'bg-purple-500/20 border-purple-400/50 text-purple-300'
            }`}
          >
            <div className="font-medium mb-1 text-sm">{template.title}</div>
            <div className="text-xs opacity-75 line-clamp-2">{template.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400 text-center">
        Click any example to load it into the analyzer
      </div>
    </div>
  );
};

export default TemplateSelector;
