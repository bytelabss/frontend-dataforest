import React from 'react';
import { ReforestedArea } from '../shared/types';

interface PredictionButtonProps {
  selectedArea: ReforestedArea | null;
  onClassify: (area: ReforestedArea) => Promise<void>;
  onPredict: (area: ReforestedArea) => Promise<void>;
  isLoading?: boolean;
}

const PredictionButton: React.FC<PredictionButtonProps> = ({
  selectedArea,
  onClassify,
  onPredict,
  isLoading = false
}) => {
  if (!selectedArea) return null;

  const handleClick = async () => {
    try {
      // First classify the area
      await onClassify(selectedArea);
      // Then predict the strategy
      await onPredict(selectedArea);
    } catch (error) {
      // Errors will be handled by the parent component
      console.error('Error in prediction flow:', error);
    }
  };

  return (
    <div className="prediction-buttons">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition duration-300"
      >
        {isLoading ? 'Processando...' : 'Gerar Predição Customizada'} 
      </button>
    </div>
  );
};

export default PredictionButton;