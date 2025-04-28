import React from 'react';
import { ClassificationResult, PredictionResponse } from '../shared/types';
import Plant2 from '../assets/plant2.svg'
import Plant3 from '../assets/plant3.svg';
// import Plant4 from '../assets/plant4.svg';

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
      image: Plant2,
      tips: "Dicas para manejo de pinheiros..."
    },
    eucalipto: {
      title: "Área de Eucalipto",
      description: "Devido as características e dados climáticos e ambientais da área registrada, a melhor espécie para o reflorestamento é eucalipto.",
      image: Plant3,
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
        image: Plant2,
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
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 mr-100">
                <h3 className="text-2xl font-semibold mb-4">{classificationContent[classification].title}</h3>
                {/* New content layout */}
                <div className="flex flex-col md:flex-row items-center md:items-start w-full gap-8">
                    
                    {/* Text content */}
                    <div className="flex-1">
                    <p className="text-gray-700 mb-4">{classificationContent[classification].description}</p>
                    <p className="text-gray-500">{classificationContent[classification].tips}</p>
                    </div>

                    {/* Image */}
                    <div className="flex-shrink-0">
                    <img 
                        src={classificationContent[classification].image} 
                        alt={classificationContent[classification].title}
                        className="rounded-md object-cover 
                                w-96 h-72 md:w-[450px] md:h-[340px] 
                                transition-all duration-300" 
                    />
                    </div>
                </div>
                {/* <img src={classificationContent[classification].image} alt="..." className="w-full h-64 object-cover rounded-md mb-4" />
                <p className="text-gray-700 mb-2">{classificationContent[classification].description}</p>
                <p className="text-gray-500">{classificationContent[classification].tips}</p> */}
            </div>
        )}
  
        {predictionResponse && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold mb-4">Estratégia Recomendada: {predictionContent[predictionResponse.estrategia_prevista].title}</h3>
                
                <div className="flex flex-col md:flex-row items-center md:items-start w-full gap-8">
                    <img 
                        src={predictionContent[predictionResponse.estrategia_prevista].image} 
                        alt={predictionContent[predictionResponse.estrategia_prevista].title}
                        className="rounded-md object-cover 
                                w-96 h-72 md:w-[450px] md:h-[340px] 
                                transition-all duration-300"
                    />
                    
                    <div className="pl-10 pt-5 flex-1">
                        <h4 className="text-2xl font-semibold mb-4">Justificativa:</h4>
                        <p className="text-gray-700 mb-2">{predictionResponse.justificativa}</p>
                        
                        <h4 className="text-2xl font-semibold mb-4">Recomendações para Eucalipto:</h4>
                        <p className="text-gray-700 mb-2">{predictionResponse.eucalipto}</p>
                        
                        <h4 className="text-2xl font-semibold mb-4">Orientações de Adubação:</h4>
                        <p className="text-gray-700 mb-2">{predictionResponse.adubacao}</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };
  
  export default PredictionDisplay;