
import React, { useState } from "react";
import { FormState, ResearchResult } from "./types";
import { generateResearchProfile } from "./services/geminiService";
import { InputForm } from "./components/InputForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { Sparkles, AlertCircle, UserSearch, BrainCircuit, ArrowLeft, Loader2, BookOpen } from "lucide-react";

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
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {viewMode === "result" && (
              <button 
                onClick={handleBack}
                className="mr-2 p-2 hover:bg-slate-100 rounded-full transition-colors group"
                title="Back to Input"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
              </button>
            )}
            <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
              <UserSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">VANTAGE</h1>
              <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">Intelligence Engine</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol</span>
              <span className="text-xs font-bold text-slate-900">High-Depth Character Scan</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8">
            <div className="lg:col-span-7">
              {error && (
                <div className="bg-red-50 border-2 border-red-100 p-6 mb-8 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider">Analysis Interrupted</h3>
                    <p className="text-sm text-red-700 mt-1 font-medium">{error}</p>
                  </div>
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
              <div className="p-8 rounded-3xl bg-indigo-900 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-800 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Advanced Protocol
                </h4>
                <ul className="space-y-6 relative z-10">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-800 flex items-center justify-center text-xs font-bold">01</div>
                    <p className="text-sm leading-relaxed text-indigo-100 font-medium">
                      <strong className="text-white">Recent Footprints:</strong> Detailed tracking of public actions and statements from the last 18 months.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-800 flex items-center justify-center text-xs font-bold">02</div>
                    <p className="text-sm leading-relaxed text-indigo-100 font-medium">
                      <strong className="text-white">Multi-Bucket Analysis:</strong> Deep psychographic extraction covering 3-5 distinct character traits.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-800 flex items-center justify-center text-xs font-bold">03</div>
                    <p className="text-sm leading-relaxed text-indigo-100 font-medium">
                      <strong className="text-white">Plain English Reports:</strong> Professional insights delivered without complex corporate jargon.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h5 className="text-sm font-black uppercase tracking-wider text-slate-800">Accessibility Mode</h5>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Vantage is tuned to translate complex social and professional behaviors into actionable human insights. No prior knowledge of management theory required.
                </p>
              </div>
            </div>
          </div>
        )}

        {viewMode === "loading" && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative mb-12">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <BrainCircuit className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compiling Deep Intelligence</h2>
              <div className="flex flex-col gap-2">
                <p className="text-slate-500 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing 5 character dimensions for {formState.personName}...
                </p>
                <p className="text-slate-400 text-xs px-8 italic">
                  "Translating complex public footprints into human-centered strategy..."
                </p>
              </div>
            </div>
          </div>
        )}

        {viewMode === "result" && result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-4">
            <ResultDisplay result={result} onBack={handleBack} />
          </div>
        )}
      </main>
      
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Vantage Intelligence Protocol © 2025 • High-Depth Strategic Analysis
        </p>
      </footer>
    </div>
  );
};

export default App;
