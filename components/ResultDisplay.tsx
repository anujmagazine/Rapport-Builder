
import React from "react";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../types";
import { ExternalLink, Download, Copy, BrainCircuit, Activity, ShieldCheck, Zap, ArrowLeft } from "lucide-react";

interface ResultDisplayProps {
  result: ResearchResult;
  onBack?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdownContent);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Dossier Header Toolbar */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center sticky top-[72px] z-40 text-white">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
            >
              <ArrowLeft className="w-3 h-3" />
              Reset
            </button>
          )}
          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
              Verified Dossier
            </h2>
          </div>
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
             className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="p-8 md:p-20 max-w-[80ch] mx-auto bg-white min-h-[1000px]">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <div className="mb-20 pb-10 border-b-[12px] border-slate-900">
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] block mb-4">Subject Profile / Internal Use Only</span>
                  <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[0.9] m-0" {...props} />
                </div>
              ),
              h2: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isPlaybook = text.includes("playbook") || text.includes("interact");
                const isPsych = text.includes("psychographic") || text.includes("personality");
                const isActivity = text.includes("activity") || text.includes("footprint");
                const isSummary = text.includes("summary");
                
                return (
                  <h2 
                    className={`text-xl font-black uppercase tracking-[0.15em] mt-20 mb-10 flex items-center gap-4 p-5 rounded-2xl border-2 ${
                      isPlaybook ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm" : 
                      isPsych ? "bg-indigo-50 text-indigo-900 border-indigo-100" : 
                      isActivity ? "bg-slate-900 text-white border-slate-900" :
                      isSummary ? "bg-slate-50 text-slate-900 border-slate-200 italic" :
                      "text-slate-900 border-slate-100 bg-slate-50"
                    }`} 
                    {...props}
                  >
                    {isPlaybook && <Zap className="w-6 h-6 text-amber-500 animate-pulse" />}
                    {isActivity && <Activity className="w-6 h-6 text-indigo-400" />}
                    {isPsych && <BrainCircuit className="w-6 h-6" />}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-black text-slate-800 mt-14 mb-6 flex items-center gap-3 pb-3 border-b-4 border-slate-100 group" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-[18px] leading-[1.7] text-slate-700 mb-10 font-medium selection:bg-indigo-100" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="space-y-6 mb-12 list-none pl-0" {...props} />
              ),
              li: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isNegative = text.includes("friction") || text.includes("dislike") || text.includes("avoid") || text.includes("negative");
                const isAction = text.includes("how to") || text.includes("energize") || text.includes("style");
                const isDated = text.includes("2024") || text.includes("2025") || text.includes("recent");
                
                return (
                  <li className={`p-6 rounded-2xl border-l-8 leading-relaxed shadow-sm transition-all hover:translate-x-1 ${
                    isNegative ? "bg-red-50/50 border-red-500 text-red-950" : 
                    isAction ? "bg-emerald-50/50 border-emerald-500 text-emerald-950" :
                    isDated ? "bg-slate-50 border-slate-800 text-slate-900" :
                    "bg-white border-slate-200 text-slate-700"
                  }`} {...props}>
                    {children}
                  </li>
                );
              },
              strong: ({ node, ...props }) => (
                <strong className="font-black text-slate-900 underline decoration-indigo-300 decoration-2 underline-offset-4 bg-indigo-50/30 px-1" {...props} />
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Source Chain Visualization */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-40 pt-16 border-t-4 border-slate-900 bg-slate-50 -mx-8 px-8 md:-mx-20 md:px-20 pb-24">
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                  Metadata
                </h4>
                <h3 className="text-2xl font-black text-slate-900">Intelligence Sources</h3>
              </div>
              <div className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {result.sources.length} Points Verified
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-3 p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12 group-hover:bg-indigo-50 transition-colors"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-slate-800 truncate leading-tight">
                        {source.title || "Classified Document Source"}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter mt-1 group-hover:tracking-widest transition-all">
                        {new URL(source.uri).hostname}
                      </span>
                    </div>
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
