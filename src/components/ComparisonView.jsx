import React from 'react';
import VibeBar from './VibeBar.jsx';
import FlaggedQuote from './FlaggedQuote.jsx';

const ComparisonView = ({ analyses, onClose }) => {
  if (!analyses || analyses.length !== 2) return null;

  const [analysis1, analysis2] = analyses;

  const getScoreDifference = (metric1, metric2) => {
    const score1 = analysis1.analysis.metrics?.find(m => m.metric === metric1)?.score || 0;
    const score2 = analysis2.analysis.metrics?.find(m => m.metric === metric2)?.score || 0;
    return score2 - score1;
  };

  const getOverallComparison = () => {
    const metrics1 = analysis1.analysis.metrics || [];
    const metrics2 = analysis2.analysis.metrics || [];
    
    const avg1 = metrics1.reduce((sum, m) => sum + m.score, 0) / metrics1.length || 0;
    const avg2 = metrics2.reduce((sum, m) => sum + m.score, 0) / metrics2.length || 0;
    
    const redFlags1 = analysis1.analysis.redFlags?.length || 0;
    const redFlags2 = analysis2.analysis.redFlags?.length || 0;
    
    const greenFlags1 = analysis1.analysis.greenFlags?.length || 0;
    const greenFlags2 = analysis2.analysis.greenFlags?.length || 0;

    return {
      healthierConversation: avg2 - redFlags2 + greenFlags2 > avg1 - redFlags1 + greenFlags1 ? 2 : 1,
      scoreDifference: Math.abs(avg2 - avg1),
      flagDifference: { red: redFlags2 - redFlags1, green: greenFlags2 - greenFlags1 }
    };
  };

  const comparison = getOverallComparison();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <span>⚖️</span>
              Conversation Comparison
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-700/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Overall Comparison Summary */}
          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-200 mb-2">
                Analysis: Conversation {comparison.healthierConversation} appears healthier
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-cyan-400 font-medium">Score Difference</div>
                  <div className="text-gray-300">{comparison.scoreDifference.toFixed(1)} points</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-medium">Red Flag Difference</div>
                  <div className="text-gray-300">{Math.abs(comparison.flagDifference.red)} flags</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-medium">Green Flag Difference</div>
                  <div className="text-gray-300">{Math.abs(comparison.flagDifference.green)} flags</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversation 1 */}
            <div className="space-y-4">
              <div className="bg-gray-700/20 p-4 rounded-lg border border-gray-600/30">
                <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                  {analysis1.title}
                </h3>
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(analysis1.timestamp).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-300 mb-3 p-2 bg-gray-800/30 rounded">
                  {analysis1.preview}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  analysis1.analysis.status?.toLowerCase().includes('healthy') ? 'bg-green-500/20 text-green-300' :
                  analysis1.analysis.status?.toLowerCase().includes('red') ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {analysis1.analysis.status}
                </div>
              </div>

              {/* Metrics for Conversation 1 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-200">Metrics</h4>
                {analysis1.analysis.metrics?.map((metric, index) => (
                  <VibeBar key={metric.metric} {...metric} index={index} />
                ))}
              </div>

              {/* Flags for Conversation 1 */}
              {analysis1.analysis.greenFlags?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Green Flags</h4>
                  {analysis1.analysis.greenFlags.map((flag, i) => (
                    <FlaggedQuote key={`g1-${i}`} {...flag} type="green" />
                  ))}
                </div>
              )}

              {analysis1.analysis.redFlags?.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-400 mb-2">Red Flags</h4>
                  {analysis1.analysis.redFlags.map((flag, i) => (
                    <FlaggedQuote key={`r1-${i}`} {...flag} type="red" />
                  ))}
                </div>
              )}
            </div>

            {/* Conversation 2 */}
            <div className="space-y-4">
              <div className="bg-gray-700/20 p-4 rounded-lg border border-gray-600/30">
                <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                  {analysis2.title}
                </h3>
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(analysis2.timestamp).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-300 mb-3 p-2 bg-gray-800/30 rounded">
                  {analysis2.preview}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  analysis2.analysis.status?.toLowerCase().includes('healthy') ? 'bg-green-500/20 text-green-300' :
                  analysis2.analysis.status?.toLowerCase().includes('red') ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {analysis2.analysis.status}
                </div>
              </div>

              {/* Metrics for Conversation 2 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-200">Metrics</h4>
                {analysis2.analysis.metrics?.map((metric, index) => (
                  <VibeBar key={metric.metric} {...metric} index={index} />
                ))}
              </div>

              {/* Flags for Conversation 2 */}
              {analysis2.analysis.greenFlags?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Green Flags</h4>
                  {analysis2.analysis.greenFlags.map((flag, i) => (
                    <FlaggedQuote key={`g2-${i}`} {...flag} type="green" />
                  ))}
                </div>
              )}

              {analysis2.analysis.redFlags?.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-400 mb-2">Red Flags</h4>
                  {analysis2.analysis.redFlags.map((flag, i) => (
                    <FlaggedQuote key={`r2-${i}`} {...flag} type="red" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
