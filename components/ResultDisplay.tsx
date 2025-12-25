
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ResearchResult } from "../types";
import { ExternalLink, Download, Copy, BrainCircuit, Activity, ShieldCheck, Zap, FileText, AlertTriangle, CheckCircle2, BookOpen, Quote, ChevronRight, MessageSquare, Flame, Ban, Target } from "lucide-react";

interface ResultDisplayProps {
  result: ResearchResult;
  onBack?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdownContent);
    alert("Tactical briefing copied to clipboard!");
  };

  const handleExportPDF = () => {
    window.focus();
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([result.markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tactical_Briefing.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print-container transition-all">
      {/* Action Toolbar */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-[72px] z-40 text-white no-print shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
              Validated Strategic Intel
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
      <div className="p-8 md:p-20 max-w-[95ch] mx-auto bg-white print-content">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <div className="mb-16 pb-12 border-b-[8px] border-slate-900">
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] block mb-4">Strategic Intelligence Dossier</span>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] m-0" {...props} />
                </div>
              ),
              h2: ({ node, children, ...props }) => {
                const text = String(children).toLowerCase();
                const isVerification = text.includes("verification") || text.includes("data");
                const isTimeline = text.includes("narrative") || text.includes("timeline");
                const isBuckets = text.includes("psychographic") || text.includes("buckets");
                const isPlaybook = text.includes("playbook");
                const isMatrix = text.includes("matrix") || text.includes("competency");
                
                return (
                  <h2 
                    className={`text-xl font-black uppercase tracking-[0.2em] mt-24 mb-10 flex items-center gap-4 p-6 rounded-2xl border-2 break-inside-avoid ${
                      isVerification ? "bg-emerald-50 text-emerald-900 border-emerald-100" :
                      isBuckets ? "bg-indigo-900 text-white border-indigo-900" :
                      isPlaybook ? "bg-slate-900 text-white border-slate-900" :
                      isMatrix ? "bg-indigo-50 text-indigo-900 border-indigo-100" :
                      "bg-slate-50 text-slate-900 border-slate-200"
                    }`} 
                    {...props}
                  >
                    {isVerification && <ShieldCheck className="w-6 h-6 no-print" />}
                    {isTimeline && <Activity className="w-6 h-6 no-print" />}
                    {isBuckets && <BrainCircuit className="w-6 h-6 no-print text-indigo-300" />}
                    {isPlaybook && <BookOpen className="w-6 h-6 no-print text-amber-500" />}
                    {isMatrix && <Zap className="w-6 h-6 no-print text-indigo-400" />}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, children, ...props }) => {
                const text = String(children);
                if (text.toLowerCase().includes("bucket:")) {
                   return (
                     <div className="mt-12 mb-6 bg-indigo-50/50 border-2 border-indigo-100 p-8 rounded-t-3xl border-b-0 break-inside-avoid">
                        <div className="flex items-center gap-3 mb-3">
                          <BrainCircuit className="w-5 h-5 text-indigo-600" />
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Profiling Bucket</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 m-0" {...props}>
                          {text.replace(/bucket:/gi, "").trim()}
                        </h3>
                     </div>
                   );
                }
                return <h3 className="text-lg font-black text-slate-800 mt-12 mb-6 border-b-2 border-slate-100 pb-2 flex items-center gap-2 break-inside-avoid" {...props} />;
              },
              p: ({ node, ...props }) => {
                const text = String(props.children);
                if (text.includes("Data Confidence:")) {
                   return (
                     <div className="flex items-center gap-3 bg-white border-2 border-slate-100 p-4 rounded-xl mb-12 shadow-sm break-inside-avoid">
                       <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Confidence</span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         text.includes("High") ? "bg-emerald-500 text-white" :
                         text.includes("Medium") ? "bg-amber-500 text-white" :
                         "bg-red-500 text-white"
                       }`}>
                         {text.split(":")[1].trim().split(" ")[0]}
                       </span>
                       <span className="text-xs font-bold text-slate-500 italic ml-2">
                         {text.includes("Reasoning") ? text.split("Reasoning:")[1]?.trim() : text.split(":")[1]?.trim()}
                       </span>
                     </div>
                   );
                }
                return <p className="text-[17px] leading-[1.8] text-slate-700 mb-8 font-medium" {...props} />;
              },
              table: ({ node, ...props }) => (
                <div className="my-12 overflow-x-auto border border-slate-200 rounded-2xl shadow-sm bg-white break-inside-avoid">
                  <table className="min-w-full divide-y divide-slate-200 border-collapse m-0" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => <thead className="bg-slate-50" {...props} />,
              th: ({ node, ...props }) => <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200" {...props} />,
              td: ({ node, ...props }) => <td className="px-6 py-5 text-sm text-slate-600 border-b border-slate-100 align-top leading-relaxed font-medium" {...props} />,
              li: ({ node, children, ...props }) => {
                const text = String(children);
                
                // Detection for Tactical Tags
                const isSpeech = text.includes("[SPEECH STYLE]");
                const isEnergy = text.includes("[ENERGY DRIVERS]");
                const isFriction = text.includes("[FRICTION POINTS]");
                const isExpected = text.includes("[EXPECTED BEHAVIOR]");
                const isProof = text.includes("Proof Point:");
                const isMindset = text.includes("Operational Mindset:");

                if (isProof || isMindset) {
                  return (
                    <div className={`p-6 bg-white border-2 border-indigo-100 border-t-0 last:rounded-b-3xl mb-0 break-inside-avoid shadow-sm group hover:bg-slate-50 transition-colors`}>
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">
                        {isProof ? "Evidence Base" : "Logic Flow"}
                      </span>
                      <div className="text-slate-700 font-semibold leading-relaxed">
                        {text.replace(/proof point:|operational mindset:/gi, "").trim()}
                      </div>
                    </div>
                  );
                }

                if (isSpeech || isEnergy || isFriction || isExpected) {
                  return (
                    <div className={`p-8 rounded-3xl mb-6 shadow-sm flex items-start gap-6 break-inside-avoid border-2 transition-all hover:shadow-md ${
                      isSpeech ? "bg-indigo-50 border-indigo-100" :
                      isEnergy ? "bg-emerald-50 border-emerald-100" :
                      isFriction ? "bg-rose-50 border-rose-100" :
                      "bg-amber-50 border-amber-100"
                    }`}>
                      <div className={`p-3 rounded-2xl shadow-sm flex-shrink-0 ${
                         isSpeech ? "bg-indigo-600 text-white" :
                         isEnergy ? "bg-emerald-600 text-white" :
                         isFriction ? "bg-rose-600 text-white" :
                         "bg-amber-600 text-white"
                      }`}>
                        {isSpeech && <MessageSquare className="w-5 h-5" />}
                        {isEnergy && <Flame className="w-5 h-5" />}
                        {isFriction && <Ban className="w-5 h-5" />}
                        {isExpected && <Target className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${
                           isSpeech ? "text-indigo-600" :
                           isEnergy ? "text-emerald-600" :
                           isFriction ? "text-rose-600" :
                           "text-amber-700"
                        }`}>
                          {isSpeech ? "Communication Mode" : isEnergy ? "High-Signal Triggers" : isFriction ? "Hazard Warnings" : "Predicted Response"}
                        </span>
                        <div className="text-lg font-bold text-slate-900 leading-snug">
                          {text.split("]:")[1]?.trim() || text}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <li className="flex items-start gap-3 text-[17px] text-slate-700 mb-4 font-medium leading-relaxed">
                    <ChevronRight className="w-5 h-5 mt-1 text-slate-300 flex-shrink-0" />
                    <span>{children}</span>
                  </li>
                );
              },
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-indigo-600 bg-indigo-50/30 p-8 my-8 rounded-r-2xl italic text-indigo-950 font-medium relative break-inside-avoid" {...props}>
                  <Quote className="absolute top-2 right-4 w-12 h-12 text-indigo-200 opacity-50" />
                  {props.children}
                </blockquote>
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Sources */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-32 pt-16 border-t-2 border-slate-100 break-inside-avoid no-print">
            <div className="mb-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Evidence Index</h4>
              <h3 className="text-2xl font-black text-slate-900">Intelligence Sources</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-indigo-600 hover:shadow-xl"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-600">
                      {source.title || "Public Footprint"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1 opacity-70">
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
      <div className="hidden print:block text-center py-12 border-t border-slate-100 mt-20">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          Strategic Briefing • Strictly Evidence-Based Intelligence • Generated by People Insight
        </p>
      </div>
    </div>
  );
};
