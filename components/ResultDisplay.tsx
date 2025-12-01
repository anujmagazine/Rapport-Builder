import React from "react";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../types";
import { FileText, ExternalLink, Download } from "lucide-react";

interface ResultDisplayProps {
  result: ResearchResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Intelligence Dossier
        </h2>
        <button
           onClick={() => window.print()}
           className="text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="p-8 prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-indigo-600 prose-strong:text-slate-900">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 pb-2 border-b border-slate-200" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-8 mb-4 text-indigo-900 bg-indigo-50 p-2 rounded-md border-l-4 border-indigo-500" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-6 mb-2 text-slate-700" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-600" {...props} />,
            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4 text-slate-600 leading-relaxed" {...props} />,
          }}
        >
          {result.markdownContent}
        </ReactMarkdown>

        {result.sources && result.sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Verified Sources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 line-clamp-1">
                      {source.title || "Web Source"}
                    </div>
                    <div className="text-xs text-slate-400 group-hover:text-indigo-400 line-clamp-1 break-all">
                      {source.uri}
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