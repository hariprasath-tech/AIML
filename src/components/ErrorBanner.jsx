import React from 'react';

export default function ErrorBanner({ title = "Backend Connection Error", message = "Unable to connect to the backend server at http://127.0.0.1:8000.", onRetry }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div>
        <p className="font-semibold text-amber-900">{title}</p>
        <p className="text-amber-700 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-amber-600 text-white hover:bg-amber-700 rounded font-medium transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
