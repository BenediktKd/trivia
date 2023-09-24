'use client'
import React, { useEffect, useState } from 'react';
import '../globals.css';

interface Question {
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

const QuestionPage: React.FC = () => {
  const [questionData, setQuestionData] = useState<Question | null>(null);

  useEffect(() => {
    console.log("Componente QuestionPage montado."); // Verificar que el componente se monta

    const ws: WebSocket = (window as any).websocket;

    if (ws) {
      console.log("WebSocket encontrado."); // Verificar que el WebSocket existe

      ws.onmessage = (event) => {
        console.log("Mensaje recibido:", event.data); // Imprimir cada mensaje que se recibe

        const data = JSON.parse(event.data);
        if (data.type === "question") {
          console.log("Datos de la pregunta:", data); // Imprimir los datos de la pregunta
          setQuestionData(data);
        }
      };
    } else {
      console.log("WebSocket no encontrado."); // Si no se encuentra el WebSocket
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {questionData && (
        <>
          <h2 className="text-3xl font-bold mb-4">{questionData.question.title}</h2>
          <p className="text-lg mb-8">Puntos: {questionData.question.points}</p>

          {questionData.question.type === 'button' && questionData.question.options && (
            <div className="mb-4">
              {Object.entries(questionData.question.options).map(([key, value]) => (
                <button key={key} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
                  {value}
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
        </>
      )}
    </div>
  );
}

export default QuestionPage;







