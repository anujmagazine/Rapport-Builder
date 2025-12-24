
import React from "react";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../types";
import { ExternalLink, Download, Copy, BrainCircuit, PlayCircle, Activity, ShieldCheck, Zap } from "lucide-react";

interface ResultDisplayProps {
  result: ResearchResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdownContent);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10 text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-black uppercase tracking-widest">
            Vantage Intel Report
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all"
            title="Copy Content"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
             onClick={() => window.print()}
             className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-16 max-w-[75ch] mx-auto bg-white">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <div className="mb-16 pb-8 border-b-8 border-slate-900">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] block mb-2">Subject Dossier</span>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none m-0" {...props} />
                </div>
              ),
              h2: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isPlaybook = text.includes("playbook");
                const isPsych = text.includes("psychographic");
                const isActivity = text.includes("activity") || text.includes("footprint");
                
                return (
                  <h2 
                    className={`text-xl font-black uppercase tracking-widest mt-16 mb-8 flex items-center gap-3 p-4 rounded-xl border ${
                      isPlaybook ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm" : 
                      isPsych ? "bg-indigo-50 text-indigo-900 border-indigo-200" : 
                      isActivity ? "bg-slate-900 text-white border-slate-900" :
                      "text-slate-900 border-slate-100 bg-slate-50"
                    }`} 
                    {...props}
                  >
                    {isPlaybook && <Zap className="w-5 h-5 text-amber-600 animate-pulse" />}
                    {isActivity && <Activity className="w-5 h-5 text-indigo-400" />}
                    {isPsych && <BrainCircuit className="w-5 h-5" />}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-black text-slate-800 mt-12 mb-6 flex items-center gap-2 pb-2 border-b-2 border-slate-100" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-[17px] leading-relaxed text-slate-700 mb-8 font-medium selection:bg-indigo-100" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="space-y-4 mb-10 list-none pl-0" {...props} />
              ),
              li: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isNegative = text.includes("friction") || text.includes("dislike") || text.includes("avoid");
                const isAction = text.includes("how to") || text.includes("energizing");
                
                return (
                  <li className={`p-5 rounded-xl border-l-4 leading-relaxed shadow-sm transition-all hover:translate-x-1 ${
                    isNegative ? "bg-red-50 border-red-500 text-red-900" : 
                    isAction ? "bg-emerald-50 border-emerald-500 text-emerald-900" :
                    "bg-white border-slate-300 text-slate-700"
                  }`} {...props}>
                    {children}
                  </li>
                );
              },
              strong: ({ node, ...props }) => (
                <strong className="font-black text-slate-900 underline decoration-indigo-300 underline-offset-4" {...props} />
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Verification Footer */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-32 pt-12 border-t-2 border-slate-100 bg-slate-50/50 -mx-8 px-8 md:-mx-16 md:px-16 pb-16">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Source Verification Chain
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all group"
                >
                  <div className="bg-slate-50 p-2.5 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-black text-slate-800 truncate leading-tight">
                      {source.title || "External Intelligence Source"}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter mt-1">
                      {new URL(source.uri).hostname}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
