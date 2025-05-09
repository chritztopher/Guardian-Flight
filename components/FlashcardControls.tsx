import React from 'react';

interface FlashcardControlsProps {
  onFlip: () => void;
  onNext: () => void;
}

const FlashcardControls: React.FC<FlashcardControlsProps> = ({ onFlip, onNext }) => {
  return (
    <div className="mt-6 flex justify-between items-center w-full">
      <button
        onClick={onFlip}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Flip Card
      </button>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Next Card &rarr;
      </button>
    </div>
  );
};

export default FlashcardControls; 