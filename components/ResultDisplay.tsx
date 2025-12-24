
import React from "react";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../types";
import { ExternalLink, Download, Copy, BrainCircuit, Activity, ShieldCheck, Zap, FileText, Info } from "lucide-react";

interface ResultDisplayProps {
  result: ResearchResult;
  onBack?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdownContent);
    alert("Insight profile copied to clipboard!");
  };

  const handleExportPDF = () => {
    // 1. Force focus to window
    window.focus();
    
    // 2. Small delay to ensure all React state/animations have settled
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
      }, 750);
    });
  };

  const handleDownloadMD = () => {
    const blob = new Blob([result.markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `People_Insight_Profile.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print-container transition-all">
      {/* Action Toolbar - Hidden in Print */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-[72px] z-40 text-white no-print">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
              Insight Generated
            </h2>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Copy Text"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDownloadMD}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Download Raw Markdown"
          >
            <FileText className="w-4 h-4" />
            MD
          </button>
          <button
             type="button"
             onClick={handleExportPDF}
             className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Insight Content */}
      <div className="p-8 md:p-20 max-w-[80ch] mx-auto bg-white print-content">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <div className="mb-16 pb-12 border-b-[8px] border-slate-900">
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] block mb-4">Internal Insight Profile</span>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] m-0" {...props} />
                </div>
              ),
              h2: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isPlaybook = text.includes("playbook") || text.includes("interaction");
                const isPsych = text.includes("spectrum") || text.includes("buckets") || text.includes("psychographic");
                const isActivity = text.includes("footprint") || text.includes("activity");
                const isSummary = text.includes("summary");
                
                return (
                  <h2 
                    className={`text-xl font-black uppercase tracking-[0.2em] mt-20 mb-10 flex items-center gap-4 p-6 rounded-2xl border-2 ${
                      isPlaybook ? "bg-amber-50 text-amber-900 border-amber-100" : 
                      isPsych ? "bg-indigo-50 text-indigo-900 border-indigo-100" : 
                      isActivity ? "bg-slate-900 text-white border-slate-900" :
                      isSummary ? "bg-slate-50 text-slate-900 border-slate-200" :
                      "text-slate-900 border-slate-100 bg-slate-50"
                    }`} 
                    {...props}
                  >
                    {isPlaybook && <Zap className="w-6 h-6 text-amber-500 no-print" />}
                    {isActivity && <Activity className="w-6 h-6 text-indigo-400 no-print" />}
                    {isPsych && <BrainCircuit className="w-6 h-6 no-print" />}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-black text-slate-800 mt-12 mb-6 border-b-2 border-slate-100 pb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-[18px] leading-[1.8] text-slate-700 mb-8 font-medium" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="space-y-4 mb-10 list-none pl-0" {...props} />
              ),
              li: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isNegative = text.includes("avoid") || text.includes("friction") || text.includes("irritate");
                const isAction = text.includes("best approach") || text.includes("how to") || text.includes("energize");
                
                return (
                  <li className={`p-6 rounded-2xl border-l-8 leading-relaxed shadow-sm transition-all hover:translate-x-1 ${
                    isNegative ? "bg-red-50/50 border-red-500 text-red-950" : 
                    isAction ? "bg-emerald-50/50 border-emerald-500 text-emerald-950" :
                    "bg-white border-slate-200 text-slate-700"
                  }`} {...props}>
                    {children}
                  </li>
                );
              },
              strong: ({ node, ...props }) => (
                <strong className="font-black text-slate-900 bg-indigo-50/50 px-1" {...props} />
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Sources - Styled for PDF clarity */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-32 pt-16 border-t-2 border-slate-100">
            <div className="mb-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Metadata Verification</h4>
              <h3 className="text-2xl font-black text-slate-900">Intelligence Sources</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-600 transition-all group overflow-hidden"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm source-card-icon no-print">
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                      {source.title || "Public Intelligence Point"}
                    </p>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight mt-1 opacity-70">
                      {new URL(source.uri).hostname}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Visual Footer in PDF */}
      <div className="hidden print:block text-center py-12 border-t border-slate-100">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          Generated by People Insight Generator • Confidence for Every Interaction
        </p>
      </div>
    </div>
  );
};
