// Importamos las dependencias necesarias
'use client'
import React, { useEffect, useState } from 'react';
import '../globals.css';

// Definimos la interfaz para la estructura de datos de la pregunta
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
  // Usamos el hook useState para mantener la información de la pregunta en el estado local
  const [questionData, setQuestionData] = useState<Question | null>(null);

  // Usamos el hook useEffect para ejecutar código cuando el componente se monta
  useEffect(() => {
    // Asumimos que hemos guardado la conexión WebSocket en una variable global
    const ws: WebSocket = (window as any).websocket; 

    if (ws) {
      // Establecemos un manejador de eventos para cuando se recibe un mensaje a través del WebSocket
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Si el tipo de mensaje es "question", actualizamos el estado con la información de la pregunta
        if (data.type === "question") {
          setQuestionData(data);
        }
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Si tenemos datos de la pregunta, los mostramos */}
      {questionData && (
        <>
          {/* Mostramos el título de la pregunta */}
          <h2 className="text-3xl font-bold mb-4">{questionData.question.title}</h2>
          {/* Mostramos los puntos de la pregunta */}
          <p className="text-lg mb-8">Puntos: {questionData.question.points}</p>

          {/* Si el tipo de pregunta es "button", mostramos las opciones como botones */}
          {questionData.question.type === 'button' && questionData.question.options && (
            <div className="mb-4">
              {Object.entries(questionData.question.options).map(([key, value]) => (
                <button key={key} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
                  {value}
                </button>
              ))}
            </div>
          )}

          {/* Si el tipo de pregunta es "text", mostramos un campo de entrada para texto */}
          {questionData.question.type === 'text' && (
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Escribe tu respuesta aquí" 
                className="mt-1 p-2 w-64 border rounded-md text-black"
              />
            </div>
          )}

          {/* Si el tipo de pregunta es "chat", mostramos un área de texto */}
          {questionData.question.type === 'chat' && (
            <div className="mb-4">
              <textarea 
                placeholder="Escribe tu respuesta aquí" 
                className="mt-1 p-2 w-64 h-32 border rounded-md text-black"
              />
            </div>
          )}

          {/* Mostramos un botón para enviar la respuesta */}
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Enviar Respuesta
          </button>
        </>
      )}
    </div>
  );
}

export default QuestionPage;




// return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-3xl font-bold mb-4">Pregunta</h2>
//       {/* Aquí iría el resto de tu diseño para mostrar la pregunta y las opciones de respuesta */}
//     </div>
//   );


