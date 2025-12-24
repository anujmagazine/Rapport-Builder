
import React, { useState } from "react";
import { FormState, ResearchResult } from "./types";
import { generateResearchProfile } from "./services/geminiService";
import { InputForm } from "./components/InputForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { Coffee, AlertCircle, Search, Sparkles, ArrowLeft, Loader2, Network } from "lucide-react";

type ViewMode = "form" | "loading" | "result";

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [formState, setFormState] = useState<FormState>({
    personName: "",
    linkedinUrl: "",
    researchGoal: "",
  });

  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formState.personName || !formState.researchGoal) return;

    setViewMode("loading");
    setError(null);

    try {
      const data = await generateResearchProfile(
        formState.personName,
        formState.linkedinUrl,
        formState.researchGoal
      );
      setResult(data);
      setViewMode("result");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setViewMode("form");
    }
  };

  const handleBack = () => {
    setViewMode("form");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {viewMode === "result" && (
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                title="Start New Insight"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none uppercase">People Insight</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Generator</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full">
              Meeting Preparation Tool
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {viewMode === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start no-print">
            <div className="lg:col-span-7">
              {error && (
                <div className="bg-red-50 border border-red-200 p-5 mb-8 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}
              <InputForm
                formState={formState}
                setFormState={setFormState}
                onSubmit={handleSubmit}
                isLoading={false}
              />
            </div>
            
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  How it works
                </h4>
                
                <ul className="space-y-6 relative z-10">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">01</div>
                    <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                      <strong className="text-white block">Digital Search:</strong> We scour public records, news, and profiles for recent professional activity.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">02</div>
                    <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                      <strong className="text-white block">Persona Mapping:</strong> Our AI groups behaviors into clear "personality buckets" you can actually use.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">03</div>
                    <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                      <strong className="text-white block">Actionable Briefing:</strong> You get a one-page guide with clear tips on how to start and sustain a great talk.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Coffee className="w-4 h-4 text-slate-600" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Focus on Connection</h5>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Meeting new people is hard. This generator removes the guesswork by providing a clear summary of professional goals and personality traits.
                </p>
              </div>
            </div>
          </div>
        )}

        {viewMode === "loading" && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500 no-print">
            <div className="w-20 h-20 relative mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Search className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generating Insight Profile...</h2>
              <p className="text-slate-500 text-sm font-medium">
                Researching {formState.personName} for your meeting goal...
              </p>
              <div className="flex items-center justify-center gap-1 mt-6">
                <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

        {viewMode === "result" && result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ResultDisplay result={result} onBack={handleBack} />
          </div>
        )}
      </main>
      
      <footer className="py-12 border-t border-slate-100 text-center no-print">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          People Insight Generator © 2025 • Know your people
        </p>
      </footer>
    </div>
  );
};

export default App;
