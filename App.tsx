
import React, { useState } from "react";
import { FormState, ResearchResult } from "./types";
import { generateResearchProfile } from "./services/geminiService";
import { InputForm } from "./components/InputForm";
import { ResultDisplay } from "./components/ResultDisplay";
// Fixed the missing BrainCircuit import
import { Sparkles, AlertCircle, ScanSearch, UserSearch, BrainCircuit } from "lucide-react";

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    personName: "",
    linkedinUrl: "",
    researchGoal: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formState.personName || !formState.researchGoal) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateResearchProfile(
        formState.personName,
        formState.linkedinUrl,
        formState.researchGoal
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 py-6 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg">
              <UserSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">VANTAGE</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Psychographic Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analysis Engine</span>
              <span className="text-xs font-bold text-slate-900">Gemini 3 Pro Deep Research</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="lg:sticky lg:top-32">
              <InputForm
                formState={formState}
                setFormState={setFormState}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
              
              <div className="mt-8 p-6 rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-200">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Deep Analysis Tips
                </h4>
                <ul className="space-y-4 text-sm opacity-90 font-medium">
                  <li className="flex gap-3">
                    <span className="text-indigo-400">01</span>
                    Focus on "How to engage" goals to trigger the behavioral playbook.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-indigo-400">02</span>
                    Provide a LinkedIn URL to increase accuracy for common names.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-indigo-400">03</span>
                    The engine scans for "soft signals" in public writing and interviews.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-100 p-6 mb-8 rounded-2xl flex items-start gap-4 shadow-sm">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider">Analysis Failed</h3>
                  <p className="text-sm text-red-700 mt-1 font-medium">{error}</p>
                </div>
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <ScanSearch className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">System Idle</h3>
                <p className="text-slate-400 text-sm max-w-[280px] text-center mt-3 font-medium">
                  Enter a subject's details to begin psychographic signal extraction.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  {/* BrainCircuit is now imported correctly */}
                  <BrainCircuit className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-8 tracking-tight animate-pulse">Scanning Public Signals</h3>
                <p className="text-slate-400 text-sm mt-2 font-medium">Extracting behavioral patterns and playbook insights...</p>
              </div>
            )}

            {result && !isLoading && <ResultDisplay result={result} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
