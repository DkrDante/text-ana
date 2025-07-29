
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-rose-100 to-fuchsia-100 font-sans flex items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
        <div className="p-6 text-center border-b border-slate-200/80">
          <div className="flex justify-center items-center gap-3">
            <MessageIcon />
            <h1 className="text-2xl font-bold text-slate-800">The Text Message Reality Check</h1>
          </div>
          <p className="text-slate-600 mt-2">Your AI friend for decoding confusing texts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          <div className="md:col-span-3 p-6">
            <div className="mb-4 p-4 bg-white/50 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row gap-4 justify-between">
              <ToggleSwitch label="Sassy Friend Mode" isEnabled={isSassy} onToggle={() => setIsSassy(!isSassy)} />
              <ToggleSwitch label="Established Relationship" isEnabled={isRelationship} onToggle={() => setIsRelationship(!isRelationship)} />
            </div>
            <label htmlFor="text-input" className="text-sm font-semibold text-slate-700 mb-2 block">Alright, spill. Paste the texts here...</label>
            <textarea id="text-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Don't hold back. I need the whole conversation to give you the real story." className="w-full h-[380px] p-4 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-200 resize-none text-slate-800 leading-relaxed bg-white/80" />
          </div>

          <div className="md:col-span-2 bg-slate-50/40 p-6 border-t md:border-t-0 md:border-l border-slate-200/80">
            <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">My Honest Take:</h2>
            <div className="h-[450px] overflow-y-auto pr-2">
              {isLoading ? <Spinner text="Okay, reading the texts... gimme a sec." /> : error ? (
                <div className="flex justify-center items-center h-full text-center text-rose-600 p-4 bg-rose-100 rounded-lg"><p>{error}</p></div>
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
                    <button onClick={handleGetReplies} className="w-full mt-4 bg-fuchsia-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <SparklesIcon /> Craft a Reply...
                    </button>
                  )}

                  {isReplyLoading && <Spinner text="Thinking of the perfect reply..." />}

                  {suggestedReplies && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-800 mb-3 text-center">Okay, here's how you could reply:</h3>
                      {suggestedReplies.map(reply => <ReplySuggestionCard key={reply.type} {...reply} />)}
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-center text-slate-500 p-8"><p>I can't read their mind until you paste the texts here. I'm waiting...</p></div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

