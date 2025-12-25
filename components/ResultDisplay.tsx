
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ResearchResult } from "../types";
import { ExternalLink, Download, Copy, BrainCircuit, Activity, ShieldCheck, Zap, FileText, AlertTriangle, CheckCircle2, BookOpen, Quote, ChevronRight } from "lucide-react";

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

      {/* Accuracy Disclaimer */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-8 py-4 flex items-start gap-4 no-print">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-emerald-900 leading-relaxed font-bold uppercase tracking-wider">
          Forensic Integrity Guard: This briefing is derived solely from published professional evidence. 
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
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] block mb-4">Internal Strategic Briefing</span>
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
                    className={`text-xl font-black uppercase tracking-[0.2em] mt-20 mb-10 flex items-center gap-4 p-6 rounded-2xl border-2 break-inside-avoid ${
                      isVerification ? "bg-emerald-50 text-emerald-900 border-emerald-100" :
                      isBuckets ? "bg-indigo-900 text-white border-indigo-900" :
                      isPlaybook ? "bg-amber-50 text-amber-900 border-amber-100" :
                      isMatrix ? "bg-slate-900 text-white border-slate-900" :
                      "bg-slate-50 text-slate-900 border-slate-200"
                    }`} 
                    {...props}
                  >
                    {isVerification && <ShieldCheck className="w-6 h-6 no-print" />}
                    {isTimeline && <Activity className="w-6 h-6 no-print" />}
                    {isBuckets && <BrainCircuit className="w-6 h-6 no-print text-indigo-300" />}
                    {isPlaybook && <BookOpen className="w-6 h-6 no-print text-amber-500" />}
                    {isMatrix && <Zap className="w-6 h-6 no-print text-amber-400" />}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-black text-slate-800 mt-12 mb-6 border-b-2 border-slate-100 pb-2 flex items-center gap-2 break-inside-avoid" {...props} />
              ),
              p: ({ node, ...props }) => {
                const text = String(props.children);
                if (text.includes("Data Confidence:")) {
                   return (
                     <div className="flex items-center gap-3 bg-white border-2 border-slate-100 p-4 rounded-xl mb-12 shadow-sm break-inside-avoid">
                       <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Confidence Rating</span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         text.includes("High") ? "bg-emerald-500 text-white" :
                         text.includes("Medium") ? "bg-amber-500 text-white" :
                         "bg-red-500 text-white"
                       }`}>
                         {text.split(":")[1].trim().split(" ")[0]}
                       </span>
                       <div className="w-px h-4 bg-slate-200 hidden md:block" />
                       <span className="text-xs font-bold text-slate-500 italic">
                         {text.includes("-") || text.includes("Reasoning") ? text.split("Reasoning:")[1]?.trim() : text.split(":")[1]?.trim()}
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
                const isBucketHeader = text.includes("Bucket:");
                const isSpeech = text.toLowerCase().includes("speak");
                const isEnergy = text.toLowerCase().includes("energize");
                const isDislike = text.toLowerCase().includes("dislike");
                
                if (isBucketHeader) {
                  return (
                    <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-3xl mb-8 break-inside-avoid shadow-sm group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <BrainCircuit className="w-6 h-6 text-indigo-600" />
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">Profiling Insight</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 mb-4">{text.replace("Bucket:", "").trim()}</div>
                      {/* Children here will be the nested list items like "Evidence" and "Mindset" */}
                    </div>
                  );
                }

                return (
                  <li className={`p-6 rounded-2xl border-l-8 leading-relaxed shadow-sm break-inside-avoid bg-white border-slate-200 text-slate-700 mb-4 transition-all hover:border-slate-400 group`}>
                    <div className="flex flex-col gap-1">
                      {isSpeech && <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Communication Protocol</span>}
                      {isEnergy && <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> High Signal Trigger</span>}
                      {isDislike && <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Cautionary Signal</span>}
                      <div className="font-bold text-slate-900 mb-1 flex items-start gap-2">
                        {!isSpeech && !isEnergy && !isDislike && <ChevronRight className="w-4 h-4 mt-1 text-slate-400 group-hover:text-indigo-600 transition-colors" />}
                        {children}
                      </div>
                    </div>
                  </li>
                );
              },
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-indigo-600 bg-indigo-50/30 p-8 my-8 rounded-r-2xl italic text-indigo-950 font-medium relative break-inside-avoid" {...props}>
                  <Quote className="absolute top-2 right-4 w-12 h-12 text-indigo-200 opacity-50" />
                  {props.children}
                </blockquote>
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-black text-slate-900 bg-slate-100/80 px-1" {...props} />
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Sources */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-32 pt-16 border-t-2 border-slate-100 break-inside-avoid">
            <div className="mb-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Verification Loop</h4>
              <h3 className="text-2xl font-black text-slate-900">Intelligence Evidence Base</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group overflow-hidden break-inside-avoid transition-all hover:bg-white hover:border-indigo-600 hover:shadow-xl"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm source-card-icon no-print group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-600">
                      {source.title || "Intelligence Source"}
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
          Strategic Briefing • Strictly Evidence-Based Intelligence • People Insight Engine
        </p>
      </div>
    </div>
  );
};
