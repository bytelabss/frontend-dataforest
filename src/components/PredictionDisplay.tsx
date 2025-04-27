import React from 'react';
import { ClassificationResult, PredictionResponse } from '../shared/types';

interface PredictionDisplayProps {
    classification?: ClassificationResult;
    predictionResponse?: PredictionResponse;
    message?: string;
  }

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ 
  classification, 
  predictionResponse,
  message 
}) => {
  // Content for classification results
  const classificationContent = {
    pinheiro: {
      title: "Área de Pinheiro",
      description: "Esta área é classificada como plantação de pinheiro.",
      image: "/images/pinheiro.jpg",
      tips: "Dicas para manejo de pinheiros..."
    },
    eucalipto: {
      title: "Área de Eucalipto",
      description: "Esta área é classificada como plantação de eucalipto.",
      image: "/images/eucalipto.jpg",
      tips: "Dicas para manejo de eucaliptos..."
    }
  };
  
    // Content for prediction results
    const predictionContent = {
      mecanizacao: {
        title: "Mecanização Recomendada",
        description: "Esta área se beneficia de técnicas mecanizadas de reflorestamento.",
        image: "/images/mecanizacao.jpg",
        benefits: "Benefícios da mecanização..."
      },
      reflorestamento_natural: {
        title: "Reflorestamento Natural",
        description: "Esta área é ideal para regeneração natural da floresta.",
        image: "/images/natural.jpg",
        benefits: "Benefícios do reflorestamento natural..."
      },
      intensiva_irrigacao: {
        title: "Intensiva com Irrigação",
        description: "Esta área requer técnicas intensivas com sistema de irrigação.",
        image: "/images/irrigacao.jpg",
        benefits: "Benefícios da irrigação..."
      },
      fertilizacao_alta: {
        title: "Fertilização Alta",
        description: "Esta área requer fertilização intensiva para melhor resultados.",
        image: "/images/fertilizacao.jpg",
        benefits: "Benefícios da fertilização..."
      }
    };
  
    return (
        <div className="prediction-results">
        {message && (
          <div className="success-message" style={{ color: 'green', marginBottom: '15px' }}>
            {message}
          </div>
        )}
        
        {classification && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold mb-4">{classificationContent[classification].title}</h3>
                <img src={classificationContent[classification].image} alt="..." className="w-full h-64 object-cover rounded-md mb-4" />
                <p className="text-gray-700 mb-2">{classificationContent[classification].description}</p>
                <p className="text-gray-500">{classificationContent[classification].tips}</p>
            </div>
        )}
  
        {predictionResponse && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold mb-4">Estratégia Recomendada: {predictionContent[predictionResponse.estrategia_prevista].title}</h3>
                <img 
                    src={predictionContent[predictionResponse.estrategia_prevista].image} 
                    alt={predictionContent[predictionResponse.estrategia_prevista].title}
                    className="w-full h-64 object-cover rounded-md mb-4"
                />
                
                <div className="prediction-details">
                    <h4 className="text-2xl font-semibold mb-4">Justificativa:</h4>
                    <p className="text-gray-700 mb-2">{predictionResponse.justificativa}</p>
                    
                    <h4 className="text-2xl font-semibold mb-4">Recomendações para Eucalipto:</h4>
                    <p className="text-gray-700 mb-2">{predictionResponse.eucalipto}</p>
                    
                    <h4 className="text-2xl font-semibold mb-4">Orientações de Adubação:</h4>
                    <p className="text-gray-700 mb-2">{predictionResponse.adubacao}</p>
                </div>
            </div>
        )}
      </div>
    );
  };
  
  export default PredictionDisplay;