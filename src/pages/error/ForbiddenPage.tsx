import React from 'react';
import ForbiddenImg from '../../assets/403.png';
import { useNavigate } from 'react-router-dom';

export const ForrbiddenPage: React.FC = () => {
  // Thay đổi logic navigate tùy thuộc vào Router bạn đang dùng (như react-router-dom hoặc Next.js Link)
  const navigate = useNavigate();
  const handleGoToWorkspaces = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 text-center font-sans selection:bg-gray-100">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Placeholder Image */}
        <div className="mb-8 w-64 h-64 flex items-center justify-center">
          <img 
            src={ForbiddenImg} 
            alt="Access Denied Illustration"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl mb-4">
          403
        </h1>

        {/* Main Title */}
        <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl mb-3">
          Looks like you need access
        </h2>

        {/* Description */}
        <p className="text-sm text-neutral-500 max-w-lg leading-relaxed mb-8">
          You don't have permission to view this page. Please contact your{' '}
          <span className="font-semibold text-neutral-800">Workspace admin</span> or the{' '}
          <span className="font-semibold text-neutral-800">document owner</span> to request access.
        </p>

        {/* Action Button */}
        <button
          onClick={handleGoToWorkspaces}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          Go to Workspaces
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

      </div>
    </div>
  );
};

