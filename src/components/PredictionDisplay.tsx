import React from 'react';
import { ClassificationResult, PredictionResponse } from '../shared/types';
import Plant2 from '../assets/plant2.svg';
import Plant3 from '../assets/plant3.svg';
import Fertilizacao from '../assets/Fertilizacao.svg';
import Planting_machine from '../assets/planting_machine.svg';
import Reflorestamento from '../assets/reflorestamento_natural.svg';
import Irrigacao from '../assets/irrigacao.svg';

interface PredictionDisplayProps {
  classification?: ClassificationResult;
  predictionResponse?: PredictionResponse;
  message?: string;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
  classification,
  predictionResponse,
  message,
}) => {
  const classificationContent = {
    pinha: {
      title: "Área de Pinheiro",
      description: "Esta área é classificada como plantação de pinheiro.",
      image: Plant2,
      tips: `Dicas para manejo de pinheiros:
      
• Realize uma boa preparação do solo, incluindo correção de pH e limpeza de resíduos.
• Faça podas seletivas para favorecer o crescimento uniforme das árvores.
• Adote práticas preventivas no controle de pragas e doenças.
• Acompanhe a umidade do solo para evitar estresse hídrico.`,
    },
    eucalipto: {
      title: "Área de Eucalipto",
      description: "Devido às características e dados climáticos e ambientais da área registrada, a melhor espécie para o reflorestamento é eucalipto.",
      image: Plant3,
      tips: `Dicas para manejo de eucaliptos:
      
• Selecione clones ou espécies adaptadas às condições climáticas da região.
• Garanta o espaçamento adequado entre as mudas para evitar competição por recursos.
• Realize irrigação complementar durante o período inicial, especialmente em épocas secas.
• Aplique fertilizantes de forma equilibrada, conforme análise do solo.`,
    },
  };

  const predictionContent = {
    mecanizacao: {
      title: "Mecanização da Área",
      description: "A área apresenta condições ideais para o uso de máquinas e implementos agrícolas, otimizando o processo de plantio e reduzindo o custo operacional.",
      image: Planting_machine,
    },
    reflorestamento_natural: {
      title: "Reflorestamento Natural",
      description: "Esta área apresenta alta resiliência ambiental e pode se regenerar naturalmente, com o mínimo de intervenção humana.",
      image: Reflorestamento,
    },
    intensiva_irrigacao: {
      title: "Intensiva com Irrigação",
      description: "A área possui características que exigem um manejo intensivo, com destaque para o uso de irrigação controlada para garantir o crescimento saudável das espécies.",
      image: Irrigacao,
    },
    fertilizacao_alta: {
      title: "Fertilização Alta",
      description: "O solo desta área demanda altos níveis de nutrientes, sendo indicada uma fertilização mais frequente e robusta para alcançar o potencial produtivo desejado.",
      image: Fertilizacao,
    },
  };

  return (
    <div className="prediction-results">
      {message && (
        <div className="success-message" style={{ color: 'green', marginBottom: '15px' }}>
          {message}
        </div>
      )}

      {classification && classificationContent[classification] && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">{classificationContent[classification].title}</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-gray-700 mb-4">{classificationContent[classification].description}</p>
              <pre className="text-gray-500 whitespace-pre-wrap">{classificationContent[classification].tips}</pre>
            </div>
            <img
              src={classificationContent[classification].image}
              alt={classificationContent[classification].title}
              className="rounded-md w-96 h-72 object-cover"
            />
          </div>
        </div>
      )}

      {predictionResponse && predictionContent[predictionResponse.estrategia_prevista] && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">Estratégia Recomendada: {predictionContent[predictionResponse.estrategia_prevista].title}</h3>
          <p className="text-gray-700 mb-4">{predictionContent[predictionResponse.estrategia_prevista].description}</p>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={predictionContent[predictionResponse.estrategia_prevista].image}
              alt={predictionContent[predictionResponse.estrategia_prevista].title}
              className="rounded-md w-96 h-72 object-cover"
            />
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">Justificativa:</h4>
              <p className="text-gray-700 mb-2">{predictionResponse.justificativa}</p>
              <h4 className="text-xl font-semibold mb-2">Recomendações para Eucalipto:</h4>
              <p className="text-gray-700 mb-2">{predictionResponse.eucalipto}</p>
              <h4 className="text-xl font-semibold mb-2">Orientações de Adubação:</h4>
              <p className="text-gray-700">{predictionResponse.adubacao}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;
