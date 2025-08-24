import React, { useState, useEffect } from 'react';
import { useSwipeGesture } from './hooks/useSwipeGesture.js';
import { getQualitativeAnalysis, getQuantitativeScores, getReplySuggestions } from './api/geminiService';
import { MessageIcon, SparklesIcon } from './components/icons.jsx';
import FriendsTake from './components/FriendsTake.jsx';
import TypewriterText from './components/TypewriterText.jsx';
import ExpandableSection from './components/ExpandableSection.jsx';
import SectionDivider from './components/SectionDivider.jsx';
import MessageTypeIndicator from './components/MessageTypeIndicator.jsx';
import TemplateSelector from './components/TemplateSelector.jsx';
import AnalysisHistory from './components/AnalysisHistory.jsx';
import ComparisonView from './components/ComparisonView.jsx';
import { saveAnalysisToHistory } from './utils/localStorage.js';
import VibeBar from './components/VibeBar.jsx';
import Spinner from './components/Spinner.jsx';
import ReplySuggestionCard from './components/ReplySuggestionCard.jsx';
import ToggleSwitch from './components/ToggleSwitch.jsx';
import FlaggedQuote from './components/FlaggedQuote.jsx';

export default function App() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [suggestedReplies, setSuggestedReplies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSassy, setIsSassy] = useState(true);
  const [isRelationship, setIsRelationship] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMobileView, setCurrentMobileView] = useState('input'); // 'input' or 'analysis'
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [comparisonAnalyses, setComparisonAnalyses] = useState(null);

  // Swipe gesture handlers for mobile navigation
  const handleSwipeLeft = () => {
    if (window.innerWidth < 768) {
      setCurrentMobileView('analysis');
    }
  };

  const handleSwipeRight = () => {
    if (window.innerWidth < 768) {
      setCurrentMobileView('input');
    }
  };

  const swipeRef = useSwipeGesture(handleSwipeLeft, handleSwipeRight);

  const handleTemplateSelect = (templateText) => {
    setText(templateText);
    setAnalysis(null);
    setSuggestedReplies(null);
    setError(null);
  };

  const handleLoadAnalysis = (historyEntry) => {
    setText(historyEntry.fullText);
    setAnalysis(historyEntry.analysis);
    setSuggestedReplies(historyEntry.suggestedReplies);
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleCompareAnalysis = (analyses) => {
    setComparisonAnalyses(analyses);
  };

  const handleCloseComparison = () => {
    setComparisonAnalyses(null);
  };

  const handleGetAnalysis = async (inputText) => {
    if (!inputText.trim()) {
      setAnalysis(null); setError(null); setSuggestedReplies(null); return;
    }
    setIsLoading(true); setError(null); setSuggestedReplies(null);

    try {
      // Step 1: Get the qualitative analysis
      const qualitativeData = await getQualitativeAnalysis(inputText, { isSassy, isRelationship });

      // Step 2: Get the quantitative scores based on the summary
      const scores = await getQuantitativeScores(qualitativeData.summary_for_scorer);

      // Step 3: Combine the results into the final analysis object
      const formattedAnalysis = {
        status: qualitativeData.status,
        explanation: qualitativeData.explanation,
        redFlags: qualitativeData.red_flags,
        greenFlags: qualitativeData.green_flags,
        metrics: [
          { metric: 'Romantic Vibe', score: scores.romantic_score, color: 'rose' },
          { metric: 'Commitment Level', score: scores.commitment_score, color: 'emerald' },
          { metric: 'Conflict & Manipulation', score: scores.conflict_score, color: 'amber' },
          { metric: 'Effort & Engagement', score: scores.effort_score, color: 'sky' }
        ]
      };

      setAnalysis(formattedAnalysis);

      // Auto-save to history
      saveAnalysisToHistory(inputText, formattedAnalysis);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Oof, my brain just short-circuited. Try pasting the text again.");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetReplies = async () => {
    if (!text || !analysis) return;
    setIsReplyLoading(true); setError(null);

    try {
      const parsedJson = await getReplySuggestions(text, analysis, { isSassy, isRelationship });
      // Safety Net: Filter out any replies that are empty or invalid
      const validReplies = parsedJson.replies.filter(reply => reply && reply.text && reply.text.trim() !== "");
      setSuggestedReplies(validReplies);

      // Update history with reply suggestions
      if (validReplies.length > 0) {
        saveAnalysisToHistory(text, analysis, validReplies);
      }
    } catch (err) {
      console.error("Reply generation failed:", err);
      setError("I'm stumped on what to say back. Try analyzing a different text.");
    } finally {
      setIsReplyLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => { handleGetAnalysis(text); }, 1200);
    return () => clearTimeout(handler);
  }, [text, isSassy, isRelationship]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-float hover:scale-110 hover:opacity-40 transition-all duration-1000 cursor-pointer"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 hover:scale-110 hover:opacity-40 transition-all duration-1000 cursor-pointer"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 hover:scale-110 hover:opacity-40 transition-all duration-1000 cursor-pointer"></div>
        </div>
      </div>

      <main ref={swipeRef} className="w-full max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-xl shadow-2xl rounded-3xl border border-purple-500/20 overflow-hidden relative z-10 ring-1 ring-white/10">
        <div className="p-6 text-center border-b border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 relative">
          <button
            onClick={() => window.open('https://whosyashvardhan.com', '_blank')}
            className="absolute left-4 top-4 flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-purple-400/30 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </button>
          <div className="flex justify-center items-center gap-3">
            <MessageIcon />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              The Text Message Reality Check
            </h1>
          </div>
          <p className="text-gray-300 mt-2">Your AI friend for decoding confusing texts.</p>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex border-b border-purple-400/20 bg-gray-800/20">
          <button
            onClick={() => setCurrentMobileView('input')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
              currentMobileView === 'input'
                ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            📝 Input Text
          </button>
          <button
            onClick={() => setCurrentMobileView('analysis')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
              currentMobileView === 'analysis'
                ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🔍 Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          <div className={`md:col-span-3 p-4 md:p-6 ${currentMobileView === 'input' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
            <div className="mb-4 p-4 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-purple-400/20 flex flex-col sm:flex-row gap-4 justify-between ring-1 ring-white/5">
              <ToggleSwitch label="Sassy Friend Mode" isEnabled={isSassy} onToggle={() => setIsSassy(!isSassy)} />
              <ToggleSwitch label="Established Relationship" isEnabled={isRelationship} onToggle={() => setIsRelationship(!isRelationship)} />
            </div>
            <TemplateSelector
              onTemplateSelect={handleTemplateSelect}
              isOpen={isTemplateOpen}
              onToggle={() => setIsTemplateOpen(!isTemplateOpen)}
            />

            <AnalysisHistory
              onLoadAnalysis={handleLoadAnalysis}
              onCompareAnalysis={handleCompareAnalysis}
              isOpen={isHistoryOpen}
              onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
            />

            <label htmlFor="text-input" className="text-sm md:text-base font-semibold text-gray-200 mb-2 block">
              Alright, spill. Paste the texts here...
            </label>
            <textarea 
              id="text-input" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Don't hold back. I need the whole conversation to give you the real story." 
              className="w-full h-[300px] md:h-[380px] p-3 md:p-4 border-2 border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 resize-none text-gray-100 leading-relaxed bg-gray-800/50 backdrop-blur-sm placeholder-gray-400 shadow-inner text-sm md:text-base"
            />
          </div>

          <div className={`md:col-span-2 bg-gray-800/20 backdrop-blur-sm p-4 md:p-6 border-t md:border-t-0 md:border-l border-purple-400/20 ${currentMobileView === 'analysis' || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-100">My Honest Take:</h2>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] min-h-[400px] overflow-y-auto pr-2 pb-4">
              {isLoading ? <Spinner text="Okay, reading the texts... gimme a sec." /> : error ? (
                <div className="flex justify-center items-center h-full text-center text-red-400 p-4 bg-red-900/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                  <p>{error}</p>
                </div>
              ) : analysis ? (
                <div className="space-y-4 pb-6">
                  <FriendsTake status={analysis.status} explanation={analysis.explanation} />

                  <SectionDivider label="Relationship Metrics" gradient={true} />

                  <ExpandableSection
                    title="Vibe Analysis"
                    icon="📊"
                    badge={`${analysis.metrics?.length || 0} metrics`}
                    defaultOpen={true}
                  >
                    {analysis.metrics && analysis.metrics.map((item, index) => (<VibeBar key={item.metric} {...item} index={index} />))}
                  </ExpandableSection>

                  {(analysis.greenFlags?.length > 0 || analysis.redFlags?.length > 0) && (
                    <SectionDivider label="Key Observations" gradient={true} />
                  )}

                  {analysis.greenFlags && analysis.greenFlags.length > 0 && (
                    <ExpandableSection
                      title="Green Flags"
                      icon="💚"
                      badge={`${analysis.greenFlags.length} found`}
                      defaultOpen={true}
                    >
                      {analysis.greenFlags.map((flag, i) => <FlaggedQuote key={`g-${i}`} {...flag} type="green" />)}
                    </ExpandableSection>
                  )}

                  {analysis.redFlags && analysis.redFlags.length > 0 && (
                    <ExpandableSection
                      title="Red Flags"
                      icon="🚩"
                      badge={`${analysis.redFlags.length} found`}
                      defaultOpen={true}
                    >
                      {analysis.redFlags.map((flag, i) => <FlaggedQuote key={`r-${i}`} {...flag} type="red" />)}
                    </ExpandableSection>
                  )}

                  <SectionDivider label="Next Steps" gradient={true} />

                  {isReplyLoading ? (
                    <Spinner text="Thinking of the perfect reply..." />
                  ) : suggestedReplies ? (
                    <ExpandableSection
                      title="Reply Suggestions"
                      icon="💬"
                      badge={`${suggestedReplies.length} options`}
                      defaultOpen={true}
                    >
                      {suggestedReplies.map((reply, index) => <ReplySuggestionCard key={`${reply.type}-${index}`} {...reply} />)}
                    </ExpandableSection>
                  ) : (
                    <div className="mb-8">
                      <button
                        onClick={handleGetReplies}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 hover:scale-105 ring-1 ring-white/20 text-lg"
                      >
                        <SparklesIcon /> Craft a Reply...
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-center text-gray-400 p-8">
                  <p>I can't read their mind until you paste the texts here. I'm waiting...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
