import React from "react";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../types";
import { FileText, ExternalLink, Download, Copy } from "lucide-react";

interface ResultDisplayProps {
  result: ResearchResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdownContent);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50/80 backdrop-blur-sm px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Intelligence Dossier
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
            title="Copy to Clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
             onClick={() => window.print()}
             className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-12 max-w-[65ch] mx-auto">
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              // Main Title
              h1: ({ node, ...props }) => (
                <h1 
                  className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8 pb-4 border-b-2 border-slate-100" 
                  {...props} 
                />
              ),
              // Section Headers (Thematic)
              h2: ({ node, ...props }) => (
                <h2 
                  className="text-2xl font-bold text-slate-900 mt-12 mb-6 border-b border-slate-200 pb-2" 
                  {...props} 
                />
              ),
              // Sub Headers (Points)
              h3: ({ node, ...props }) => (
                <h3 
                  className="text-lg font-bold text-indigo-700 mt-8 mb-3 flex items-center gap-2" 
                  {...props} 
                />
              ),
              // Standard Text
              p: ({ node, ...props }) => (
                <p 
                  className="text-[16px] leading-7 text-slate-700 mb-5 font-normal" 
                  {...props} 
                />
              ),
              // Lists
              ul: ({ node, ...props }) => (
                <ul 
                  className="space-y-3 mb-6 list-disc list-outside ml-4 text-slate-700" 
                  {...props} 
                />
              ),
              li: ({ node, ...props }) => (
                <li 
                  className="pl-2 leading-7 marker:text-indigo-400" 
                  {...props} 
                />
              ),
              // Blockquotes (for Key Insights if used)
              blockquote: ({ node, ...props }) => (
                <blockquote 
                  className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-4 py-3 italic text-slate-700 rounded-r-lg my-6" 
                  {...props} 
                />
              ),
              // Bold text
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-slate-900" {...props} />
              )
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>

        {/* Sources Section */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-16 pt-8 border-t-2 border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Verified Information Sources
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group no-underline"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-white p-1.5 rounded-md border border-slate-100 shadow-sm flex-shrink-0">
                      <ExternalLink className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 truncate">
                        {source.title || "Web Resource"}
                      </span>
                      <span className="text-xs text-slate-400 truncate font-mono">
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
