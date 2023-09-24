import React from 'react';
import './globals.css';

interface QuestionProps {
  trivia_id: string;
  type: string;
  question: {
    id: number;
    type: string;
    title: string;
    points: number;
    options?: { [key: number]: string };
  };
}

const QuestionPage: React.FC<QuestionProps> = ({ trivia_id, type, question }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-3xl font-bold mb-4">{question.title}</h2>
      <p className="text-lg mb-8">Puntos: {question.points}</p>

      {question.type === 'button' && question.options && (
        <div className="mb-4">
          {Object.entries(question.options).map(([key, value]) => (
            <button key={key} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
              {value}
            </button>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Escribe tu respuesta aquí" 
            className="mt-1 p-2 w-64 border rounded-md text-black"
          />
        </div>
      )}

      {question.type === 'chat' && (
        <div className="mb-4">
          <textarea 
            placeholder="Escribe tu respuesta aquí" 
            className="mt-1 p-2 w-64 h-32 border rounded-md text-black"
          />
        </div>
      )}

      <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Enviar Respuesta
      </button>
    </div>
  );
}

export default QuestionPage;
