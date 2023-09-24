'use client'

import React, { useState } from 'react';
import '../globals.css';

const QuestionPage: React.FC = () => {
  const [questionData, setQuestionData] = useState({
    trivia_id: '',
    type: '',
    question: {
      id: 0,
      type: '',
      title: '',
      points: 0,
      options: {}
    }
  });

  // Aquí puedes actualizar setQuestionData cuando recibas datos del WebSocket

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-3xl font-bold mb-4">{questionData.question.title}</h2>
      <p className="text-lg mb-8">Puntos: {questionData.question.points}</p>

      {questionData.question.type === 'button' && questionData.question.options && (
        <div className="mb-4">
          {Object.entries(questionData.question.options).map(([key, value]) => (
            <button key={key} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
            {typeof value === 'string' ? value : null}
            </button>
          ))}
        </div>
      )}

      {questionData.question.type === 'text' && (
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Escribe tu respuesta aquí" 
            className="mt-1 p-2 w-64 border rounded-md text-black"
          />
        </div>
      )}

      {questionData.question.type === 'chat' && (
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

