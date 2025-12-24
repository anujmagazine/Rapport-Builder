
import React from "react";
import { FormState } from "../types";
// Added missing Sparkles and Loader2 icons to the import
import { Search, Link as LinkIcon, Target, User, Sparkles, Loader2 } from "lucide-react";

interface InputFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  formState,
  setFormState,
  onSubmit,
  isLoading,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formState.personName.trim() !== "" && formState.researchGoal.trim() !== "";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Insight Generation</h2>
        <p className="text-slate-500 mt-2 text-base font-medium">
          Tell us about the person you're meeting to generate a custom profile.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <label htmlFor="personName" className="block text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
            Target Person Name <span className="text-red-500 opacity-50">*</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              name="personName"
              id="personName"
              value={formState.personName}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
            Public Profile Link <span className="text-slate-400 font-normal lowercase italic">(optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="url"
              name="linkedinUrl"
              id="linkedinUrl"
              value={formState.linkedinUrl}
              onChange={handleChange}
              placeholder="LinkedIn, Portfolio, or Company URL"
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="researchGoal" className="block text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
            What is your goal for this interaction? <span className="text-red-500 opacity-50">*</span>
          </label>
          <div className="relative group">
            <div className="absolute top-4 left-4 pointer-events-none">
              <Target className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <textarea
              name="researchGoal"
              id="researchGoal"
              rows={4}
              value={formState.researchGoal}
              onChange={handleChange}
              placeholder="e.g. Closing a sale, pitching a new product, or an informational interview..."
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium resize-none"
            />
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Specific goals generate much deeper communication insights.
          </p>
        </div>

        <button
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          className={`w-full flex justify-center items-center py-5 px-6 rounded-2xl text-base font-black uppercase tracking-[0.15em] text-white transition-all duration-300 shadow-xl ${
            (!isFormValid || isLoading) 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-slate-900 hover:bg-indigo-600 shadow-slate-100 active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            "Generate Insight Profile"
          )}
        </button>
      </div>
    </div>
  );
};
