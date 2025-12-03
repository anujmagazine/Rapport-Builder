import React from "react";
import { FormState } from "../types";
import { Search, Link as LinkIcon, Target, User } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Search className="w-6 h-6 text-indigo-600" />
          New Research
        </h2>
        <p className="text-slate-500 mt-1">
          Input your target subject and specific research goal to generate a comprehensive strategic profile.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name Input */}
        <div>
          <label htmlFor="personName" className="block text-sm font-medium text-slate-700 mb-1">
            Target Subject <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="personName"
              id="personName"
              value={formState.personName}
              onChange={handleChange}
              placeholder="e.g. Sam Altman"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* LinkedIn Input */}
        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-700 mb-1">
            Context URL / LinkedIn (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="url"
              name="linkedinUrl"
              id="linkedinUrl"
              value={formState.linkedinUrl}
              onChange={handleChange}
              placeholder="e.g. https://linkedin.com/in/..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Purpose Input */}
        <div>
          <label htmlFor="researchGoal" className="block text-sm font-medium text-slate-700 mb-1">
            Research Context & Goal <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <Target className="h-5 w-5 text-slate-400" />
            </div>
            <textarea
              name="researchGoal"
              id="researchGoal"
              rows={3}
              value={formState.researchGoal}
              onChange={handleChange}
              placeholder="e.g. Evaluating for potential Series A investment, Preparing for a podcast interview, or Assessing for a partnership..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Be specific. The AI structures the entire analysis based on this objective.
          </p>
        </div>

        <button
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
            (!isFormValid || isLoading) ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Compiling Analysis...
            </>
          ) : (
            "Generate Strategic Profile"
          )}
        </button>
      </div>
    </div>
  );
};