import React, { useState, useEffect } from 'react';
import { getQualitativeAnalysis, getQuantitativeScores, getReplySuggestions } from './api/geminiService';
import { MessageIcon, SparklesIcon } from './components/icons.jsx';
import FriendsTake from './components/FriendsTake.jsx';
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <main className="w-full max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-xl shadow-2xl rounded-3xl border border-purple-500/20 overflow-hidden relative z-10 ring-1 ring-white/10">
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          <div className="md:col-span-3 p-6">
            <div className="mb-4 p-4 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-purple-400/20 flex flex-col sm:flex-row gap-4 justify-between ring-1 ring-white/5">
              <ToggleSwitch label="Sassy Friend Mode" isEnabled={isSassy} onToggle={() => setIsSassy(!isSassy)} />
              <ToggleSwitch label="Established Relationship" isEnabled={isRelationship} onToggle={() => setIsRelationship(!isRelationship)} />
            </div>
            <label htmlFor="text-input" className="text-sm font-semibold text-gray-200 mb-2 block">
              Alright, spill. Paste the texts here...
            </label>
            <textarea 
              id="text-input" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Don't hold back. I need the whole conversation to give you the real story." 
              className="w-full h-[380px] p-4 border-2 border-gray-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 resize-none text-gray-100 leading-relaxed bg-gray-800/50 backdrop-blur-sm placeholder-gray-400 shadow-inner"
            />
          </div>

          <div className="md:col-span-2 bg-gray-800/20 backdrop-blur-sm p-6 border-t md:border-t-0 md:border-l border-purple-400/20">
            <h2 className="text-lg font-bold text-gray-100 mb-4 text-center">My Honest Take:</h2>
            <div className="h-[450px] overflow-y-auto pr-2">
              {isLoading ? <Spinner text="Okay, reading the texts... gimme a sec." /> : error ? (
                <div className="flex justify-center items-center h-full text-center text-red-400 p-4 bg-red-900/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                  <p>{error}</p>
                </div>
              ) : analysis ? (
                <div>
                  <FriendsTake status={analysis.status} explanation={analysis.explanation} />

                  {analysis.metrics && analysis.metrics.map((item) => (<VibeBar key={item.metric} {...item} />))}

                  {analysis.greenFlags && analysis.greenFlags.length > 0 && (
                    <div className="mt-4">
                      {analysis.greenFlags.map((flag, i) => <FlaggedQuote key={`g-${i}`} {...flag} type="green" />)}
                    </div>
                  )}

                  {analysis.redFlags && analysis.redFlags.length > 0 && (
                    <div className="mt-4">
                      {analysis.redFlags.map((flag, i) => <FlaggedQuote key={`r-${i}`} {...flag} type="red" />)}
                    </div>
                  )}

                  {!isReplyLoading && !suggestedReplies && (
                    <button 
                      onClick={handleGetReplies} 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 hover:scale-105 ring-1 ring-white/20"
                    >
                      <SparklesIcon /> Craft a Reply...
                    </button>
                  )}

                  {isReplyLoading && <Spinner text="Thinking of the perfect reply..." />}

                  {suggestedReplies && (
                    <div className="mt-6">
                      <h3 className="font-bold text-gray-100 mb-3 text-center">Okay, here's how you could reply:</h3>
                      {suggestedReplies.map((reply, index) => <ReplySuggestionCard key={`${reply.type}-${index}`} {...reply} />)}
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
