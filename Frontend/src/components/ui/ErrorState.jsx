import React, { useState } from "react";

const ErrorState = ({ type = "timeout", onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Fallback simulated delay if no prop is provided
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorContent = () => {
    switch (type) {
      case "server":
        return {
          title: "Service temporarily unavailable",
          description:
            "Our systems are experiencing a brief interruption. Access should be restored momentarily.",
          icon: (
            <svg
              className="w-16 h-16 text-teal-600/60 overflow-visible"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
          ),
        };
      case "timeout":
        return {
          title: "Connection attempt timed out",
          description:
            "The response took longer than expected to arrive. This is usually a momentary delay.",
          icon: (
            <svg
              className="w-16 h-16 text-teal-600/60 overflow-visible"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "offline":
      default:
        return {
          title: "No internet connection",
          description:
            "We are unable to detect an active network connection. Please verify your network settings and we will reconnect you shortly.",
          icon: (
            <svg
              className="w-16 h-16 text-teal-600/60 overflow-visible"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l18 18M18.364 5.636a9 9 0 00-12.728 0M21.196 2.804a13 13 0 00-18.392 0M15.536 8.464a5 5 0 010 7.072M12 14.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
              />
            </svg>
          ),
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-teal-50/30 p-6 font-sans selection:bg-teal-100">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
        {/* Abstract Illustration Context */}
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-sm ring-1 ring-slate-100">
          <div
            className={`absolute inset-0 rounded-full bg-teal-100/40 ${isRetrying ? "animate-ping [animation-duration:3s]" : ""}`}
          />
          <div className="absolute inset-0 rounded-full bg-teal-50/80 animate-pulse" />
          <div className="relative drop-shadow-sm">{content.icon}</div>
        </div>

        {/* Typography */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
            {content.title}
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-sm mx-auto">
            {content.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white transition-all duration-200 ease-out bg-emerald-500 rounded-full shadow-sm hover:bg-emerald-600 hover:shadow disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {isRetrying ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 -ml-1 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Reconnecting...
              </>
            ) : (
              "Retry Connection"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
