import React, { useState } from "react";
import { FormState, ResearchResult } from "./types";
import { generateResearchProfile } from "./services/geminiService";
import { InputForm } from "./components/InputForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { Sparkles, AlertCircle, Radar } from "lucide-react";

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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Radar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">IntelBrief AI</h1>
              <p className="text-xs text-slate-400 font-medium">Deep-Dive Professional Intelligence</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-slate-300 bg-slate-800 py-1 px-3 rounded-full border border-slate-700">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 sticky top-28">
            <InputForm
              formState={formState}
              setFormState={setFormState}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            
            {/* Context/Tips Area */}
            <div className="mt-6 p-4 rounded-lg bg-slate-200 text-slate-600 text-sm border border-slate-300">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Dossier Tips
              </h4>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>Be precise with your <strong>Research Goal</strong>.</li>
                <li>"Pitching a sale" produces different intel than "Recruiting".</li>
                <li>URLs help verify identity for common names.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-slate-200 border-dashed">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-500">Ready to Compile Dossier</h3>
                <p className="text-sm text-slate-400 max-w-xs text-center mt-2">
                  Define your research parameters on the left to generate a strategic intelligence brief.
                </p>
              </div>
            )}

            {result && <ResultDisplay result={result} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;