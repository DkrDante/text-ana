// localStorage utilities for analysis history

const STORAGE_KEY = 'text-analysis-history';
const MAX_HISTORY_ITEMS = 50;

export const saveAnalysisToHistory = (text, analysis, suggestedReplies = null) => {
  try {
    const history = getAnalysisHistory();
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      text: text.substring(0, 500), // Store first 500 chars for preview
      fullText: text,
      analysis,
      suggestedReplies,
      title: generateAnalysisTitle(text, analysis),
      preview: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    };

    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newEntry.id;
  } catch (error) {
    console.error('Failed to save analysis to history:', error);
    return null;
  }
};

export const getAnalysisHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load analysis history:', error);
    return [];
  }
};

export const getAnalysisById = (id) => {
  const history = getAnalysisHistory();
  return history.find(entry => entry.id === id);
};

export const deleteAnalysisFromHistory = (id) => {
  try {
    const history = getAnalysisHistory();
    const updatedHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Failed to delete analysis from history:', error);
    return false;
  }
};

export const clearAnalysisHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear analysis history:', error);
    return false;
  }
};

export const generateAnalysisTitle = (text, analysis) => {
  const date = new Date().toLocaleDateString();
  const status = analysis?.status || 'Analysis';
  
  // Try to extract conversation type
  if (text.toLowerCase().includes('me:') || text.toLowerCase().includes('them:')) {
    return `${status} - ${date}`;
  }
  
  // Use first few words as title
  const firstWords = text.trim().split(/\s+/).slice(0, 4).join(' ');
  return `${firstWords}... - ${date}`;
};

export const exportAnalysisData = () => {
  const history = getAnalysisHistory();
  const exportData = {
    exported: new Date().toISOString(),
    version: '1.0',
    analyses: history
  };
  
  return JSON.stringify(exportData, null, 2);
};

export const importAnalysisData = (jsonData) => {
  try {
    const importedData = JSON.parse(jsonData);
    if (importedData.analyses && Array.isArray(importedData.analyses)) {
      const currentHistory = getAnalysisHistory();
      const mergedHistory = [...importedData.analyses, ...currentHistory]
        .slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedHistory));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import analysis data:', error);
    return false;
  }
};

export const getHistoryStats = () => {
  const history = getAnalysisHistory();
  const stats = {
    totalAnalyses: history.length,
    statusBreakdown: {},
    dateRange: {
      oldest: null,
      newest: null
    }
  };

  if (history.length > 0) {
    // Status breakdown
    history.forEach(entry => {
      const status = entry.analysis?.status || 'Unknown';
      stats.statusBreakdown[status] = (stats.statusBreakdown[status] || 0) + 1;
    });

    // Date range
    const dates = history.map(entry => new Date(entry.timestamp)).sort();
    stats.dateRange.oldest = dates[0];
    stats.dateRange.newest = dates[dates.length - 1];
  }

  return stats;
};
