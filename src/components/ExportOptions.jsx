import React, { useState } from 'react';
import {
  copyToClipboard,
  generateAnalysisSummary,
  downloadAsText,
  downloadAsPDF,
  shareAsImage,
  shareViaWebAPI
} from '../utils/exportUtils.js';

const ExportOptions = ({ text, analysis, suggestedReplies, isOpen, onToggle }) => {
  const [copiedItems, setCopiedItems] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const showCopiedFeedback = (key) => {
    setCopiedItems(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedItems(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleCopyAnalysis = async () => {
    const summary = generateAnalysisSummary(text, analysis, suggestedReplies);
    const success = await copyToClipboard(summary);
    if (success) {
      showCopiedFeedback('analysis');
    }
  };

  const handleCopyQuickSummary = async () => {
    const quickSummary = `Analysis: ${analysis.status}\n${analysis.explanation}`;
    const success = await copyToClipboard(quickSummary);
    if (success) {
      showCopiedFeedback('quick');
    }
  };

  const handleCopyReplies = async () => {
    if (!suggestedReplies) return;
    const repliesText = suggestedReplies.map((reply, index) => 
      `${index + 1}. ${reply.type}: "${reply.text}"`
    ).join('\n\n');
    const success = await copyToClipboard(repliesText);
    if (success) {
      showCopiedFeedback('replies');
    }
  };

  const handleDownloadText = () => {
    const summary = generateAnalysisSummary(text, analysis, suggestedReplies);
    const filename = `text-analysis-${Date.now()}.txt`;
    downloadAsText(summary, filename);
  };

  const handleDownloadPDF = () => {
    downloadAsPDF(text, analysis, suggestedReplies);
  };

  const handleShareImage = async () => {
    setIsExporting(true);
    try {
      const success = await shareAsImage('analysis-content');
      if (!success) {
        // Fallback: copy text instead
        await handleCopyAnalysis();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    const success = await shareViaWebAPI(text, analysis);
    if (!success) {
      // Fallback to copying
      await handleCopyAnalysis();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-400/30 rounded-lg text-emerald-300 hover:text-emerald-200 transition-all duration-200 text-sm backdrop-blur-sm flex items-center justify-center gap-2"
      >
        <span>📤</span>
        Export & Share Analysis
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-emerald-400/20 ring-1 ring-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-200 flex items-center gap-2">
          <span>📤</span>
          Export & Share
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Copy Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 mb-2">📋 Copy to Clipboard</h4>
          
          <button
            onClick={handleCopyAnalysis}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
              copiedItems.analysis 
                ? 'bg-green-500/20 border-green-400/50 text-green-300' 
                : 'bg-gray-700/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/20'
            }`}
          >
            <div className="font-medium text-sm">
              {copiedItems.analysis ? '✅ Copied!' : '📄 Full Analysis Report'}
            </div>
            <div className="text-xs opacity-75">Complete analysis with metrics and flags</div>
          </button>

          <button
            onClick={handleCopyQuickSummary}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
              copiedItems.quick 
                ? 'bg-green-500/20 border-green-400/50 text-green-300' 
                : 'bg-gray-700/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/20'
            }`}
          >
            <div className="font-medium text-sm">
              {copiedItems.quick ? '✅ Copied!' : '⚡ Quick Summary'}
            </div>
            <div className="text-xs opacity-75">Status and main explanation only</div>
          </button>

          {suggestedReplies && suggestedReplies.length > 0 && (
            <button
              onClick={handleCopyReplies}
              className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                copiedItems.replies 
                  ? 'bg-green-500/20 border-green-400/50 text-green-300' 
                  : 'bg-gray-700/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/20'
              }`}
            >
              <div className="font-medium text-sm">
                {copiedItems.replies ? '✅ Copied!' : '💬 Reply Suggestions'}
              </div>
              <div className="text-xs opacity-75">All suggested replies with strategies</div>
            </button>
          )}
        </div>

        {/* Download & Share Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 mb-2">💾 Download & Share</h4>
          
          <button
            onClick={handleDownloadText}
            className="w-full p-3 rounded-lg border bg-gray-700/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/20 transition-all duration-200 text-left"
          >
            <div className="font-medium text-sm">📝 Download as Text</div>
            <div className="text-xs opacity-75">Save as .txt file for easy sharing</div>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="w-full p-3 rounded-lg border bg-gray-700/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/20 transition-all duration-200 text-left"
          >
            <div className="font-medium text-sm">📄 Download as HTML</div>
            <div className="text-xs opacity-75">Formatted report (open in browser to print as PDF)</div>
          </button>

          <button
            onClick={handleShareImage}
            disabled={isExporting}
            className="w-full p-3 rounded-lg border bg-gray-700/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/20 transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="font-medium text-sm">
              {isExporting ? '⏳ Generating...' : '🖼️ Share as Image'}
            </div>
            <div className="text-xs opacity-75">Create visual summary for social sharing</div>
          </button>

          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full p-3 rounded-lg border bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30 transition-all duration-200 text-left"
            >
              <div className="font-medium text-sm">📱 Native Share</div>
              <div className="text-xs opacity-75">Use device's built-in sharing</div>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600/30">
        <div className="text-xs text-gray-400 text-center">
          💡 Tip: Use the full analysis report for comprehensive sharing, or quick summary for social media
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
