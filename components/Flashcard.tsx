import React from 'react';

interface FlashcardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ frontContent, backContent, isFlipped }) => {
  return (
    <div className={`w-full h-64 perspective`}>
      <div
        className={`relative w-full h-full transform-style-3d transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-lg shadow-lg flex items-center justify-center p-6">
          {frontContent}
        </div>
        <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-lg shadow-lg flex items-center justify-center p-6 rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

// Helper CSS (could be in a global CSS file or a style tag if not using PostCSS for JIT features)
// For perspective and transform-style, ensure your Tailwind config supports these if not by default.
// You might need to add utility classes for perspective, transform-style-3d, and backface-hidden
// or add them to a global stylesheet.
// For this example, we'll assume they are available or added via a global style or plugin.
// Example (if not using JIT or needing custom utilities beyond Tailwind's defaults):
// .perspective { perspective: 1000px; }
// .transform-style-3d { transform-style: preserve-3d; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-180 { transform: rotateY(180deg); } 