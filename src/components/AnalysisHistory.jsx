import React, { useState, useEffect } from 'react';
import { 
  getAnalysisHistory, 
  deleteAnalysisFromHistory, 
  clearAnalysisHistory,
  getHistoryStats 
} from '../utils/localStorage.js';

const AnalysisHistory = ({ onLoadAnalysis, onCompareAnalysis, isOpen, onToggle }) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const historyData = getAnalysisHistory();
    const statsData = getHistoryStats();
    setHistory(historyData);
    setStats(statsData);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation();
    if (window.confirm('Delete this analysis? This action cannot be undone.')) {
      deleteAnalysisFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all analysis history? This action cannot be undone.')) {
      clearAnalysisHistory();
      loadHistory();
    }
  };

  const handleToggleComparison = (entry, event) => {
    event.stopPropagation();
    setSelectedForComparison(prev => {
      const isSelected = prev.some(item => item.id === entry.id);
      if (isSelected) {
        return prev.filter(item => item.id !== entry.id);
      } else if (prev.length < 2) {
        return [...prev, entry];
      } else {
        // Replace oldest selection
        return [prev[1], entry];
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      onCompareAnalysis(selectedForComparison);
      setSelectedForComparison([]);
      onToggle();
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(entry => entry.analysis?.status?.toLowerCase().includes(filter.toLowerCase()));

  const getStatusColor = (status) => {
    const statusColors = {
      'healthy': 'text-green-400',
      'red alert': 'text-red-400',
      'situationship': 'text-amber-400',
      'friendzone': 'text-blue-400',
      'complicated': 'text-purple-400',
      'disagreement': 'text-orange-400'
    };
    
    const key = Object.keys(statusColors).find(k => 
      status?.toLowerCase().includes(k)
    );
    return statusColors[key] || 'text-gray-400';
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-200 text-sm backdrop-blur-sm flex items-center gap-2"
      >
        <span>📚</span>
        Analysis History ({history.length})
      </button>
    );
  }

  return (
    <div className="mb-4 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-purple-400/20 ring-1 ring-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-200 flex items-center gap-2">
          <span>📚</span>
          Analysis History
        </h3>
        <div className="flex items-center gap-2">
          {selectedForComparison.length === 2 && (
            <button
              onClick={handleCompare}
              className="px-3 py-1 bg-blue-600/20 border border-blue-400/30 rounded text-blue-300 text-xs hover:bg-blue-600/30 transition-colors"
            >
              Compare Selected
            </button>
          )}
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && stats.totalAnalyses > 0 && (
        <div className="mb-4 p-3 bg-gray-700/20 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-cyan-400">{stats.totalAnalyses}</div>
              <div className="text-xs text-gray-400">Total Analyses</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {Object.keys(stats.statusBreakdown).length}
              </div>
              <div className="text-xs text-gray-400">Status Types</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-400 mb-1">Most Common:</div>
              <div className="text-sm font-medium text-gray-200">
                {Object.entries(stats.statusBreakdown)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded text-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">All Analyses</option>
          <option value="healthy">Healthy Conversations</option>
          <option value="red">Red Alerts</option>
          <option value="situationship">Situationships</option>
          <option value="complicated">Complicated</option>
        </select>
      </div>

      {/* History List */}
      <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">📝</div>
            <div>No analyses yet</div>
            <div className="text-xs mt-1">Start analyzing conversations to build your history</div>
          </div>
        ) : (
          filteredHistory.map(entry => (
            <div
              key={entry.id}
              onClick={() => onLoadAnalysis(entry)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedForComparison.some(item => item.id === entry.id)
                  ? 'bg-blue-500/20 border-blue-400/50 ring-2 ring-blue-400/30'
                  : 'bg-gray-700/20 border-gray-600/30 hover:bg-gray-600/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium text-gray-200 truncate">
                      {entry.title}
                    </div>
                    <div className={`text-xs ${getStatusColor(entry.analysis?.status)}`}>
                      {entry.analysis?.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-gray-300 line-clamp-2">
                    {entry.preview}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => handleToggleComparison(entry, e)}
                    className={`p-1 rounded text-xs transition-colors ${
                      selectedForComparison.some(item => item.id === entry.id)
                        ? 'bg-blue-600/30 text-blue-300'
                        : 'bg-gray-600/30 text-gray-400 hover:text-gray-200'
                    }`}
                    title="Select for comparison"
                  >
                    ⚖️
                  </button>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="p-1 rounded text-xs bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                    title="Delete analysis"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-600/30 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {selectedForComparison.length > 0 && 
              `${selectedForComparison.length} selected for comparison`
            }
          </div>
          <button
            onClick={handleClearAll}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
