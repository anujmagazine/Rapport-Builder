
import React from "react";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../types";
import { FileText, ExternalLink, Download, Copy, BrainCircuit, PlayCircle } from "lucide-react";

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
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          Intelligence Report
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
             onClick={() => window.print()}
             className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            PDF Export
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-16 max-w-[72ch] mx-auto bg-white">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-12 pb-6 border-b-4 border-slate-900" {...props} />
              ),
              h2: ({ node, children, ...props }) => {
                const isPlaybook = String(children).toLowerCase().includes("playbook");
                const isPsych = String(children).toLowerCase().includes("psychographic");
                
                return (
                  <h2 
                    className={`text-xl font-black uppercase tracking-widest mt-16 mb-8 flex items-center gap-3 p-3 rounded-lg ${
                      isPlaybook ? "bg-amber-50 text-amber-900 border-l-4 border-amber-500" : 
                      isPsych ? "bg-indigo-50 text-indigo-900 border-l-4 border-indigo-500" : 
                      "text-slate-900 border-b-2 border-slate-100"
                    }`} 
                    {...props}
                  >
                    {isPlaybook && <PlayCircle className="w-5 h-5" />}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 italic before:content-['//'] before:text-indigo-500 before:font-mono" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-[17px] leading-relaxed text-slate-700 mb-6 font-normal selection:bg-indigo-100" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="space-y-4 mb-8 list-none pl-0" {...props} />
              ),
              li: ({ node, children, ...props }) => {
                const content = String(children);
                const isNegative = content.toLowerCase().includes("friction") || content.toLowerCase().includes("dislike");
                return (
                  <li className={`p-4 rounded-xl border leading-relaxed shadow-sm transition-all hover:shadow-md ${
                    isNegative ? "bg-red-50/30 border-red-100" : "bg-slate-50/50 border-slate-100"
                  }`} {...props}>
                    {children}
                  </li>
                );
              },
              strong: ({ node, ...props }) => (
                <strong className="font-extrabold text-slate-900 bg-slate-100 px-1 rounded" {...props} />
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Sources */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-24 pt-10 border-t border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
              Verification Footprints
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-700 truncate">
                        {source.title || "External Intelligence Source"}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
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
