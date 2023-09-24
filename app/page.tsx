'use client'

import React, { useState } from 'react';
import './globals.css';

const HomePage: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isQuestionReceived, setIsQuestionReceived] = useState(false);
  const [questionData, setQuestionData] = useState<any | null>(null);
  const [textAnswer, setTextAnswer] = useState('');

  const buttonColors = ['bg-red-600', 'bg-green-600', 'bg-blue-600', 'bg-yellow-600'];

  const handleAnswer = (selectedOption: string) => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'answer',
        answer: selectedOption,
        question_id: questionData.question_id,
        trivia_id: questionData.trivia_id
      }));
    }
  };

  const handleTextAnswer = () => {
    handleAnswer(textAnswer);
  };

  // Función para manejar el evento de unirse a la trivia
  const handleJoinTrivia = () => {
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'DefaultUsername';

    // Establecer la conexión WebSocket
    const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');

    websocket.onopen = () => {
      console.log("WebSocket connection opened");

      // Enviar el evento JOIN una vez que se establezca la conexión
      websocket.send(JSON.stringify({
        type: 'join',
        id: studentNumber,
        username: username
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === 'accepted') {
        // No es necesario hacer nada específico aquí por ahora
      } else if (data.type === 'question') {
        setIsQuestionReceived(true);
        setQuestionData(data); // Actualiza con todo el objeto data
      }
    };

    setWs(websocket);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Mystical Trivia Quest!</h2>
      <p className="text-lg mb-8">Únete a la aventura y demuestra tus conocimientos.</p>

      {isQuestionReceived && questionData ? (
        <div>
          <h3>{questionData.question_title}</h3>
          <p>Puntos por esta pregunta: {questionData.question_points}</p>
          {questionData.question_type === 'button' && (
            <div>
              {Object.entries(questionData.question_options).map(([key, value], index) => (
                <button 
                  key={key} 
                  onClick={() => handleAnswer(key)}
                  className={`${buttonColors[index]} hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded m-2`}
                >
                  {String(value)}
                </button>
              ))}
            </div>
          )}
          {questionData.question_type === 'text' && (
            <div>
              <input 
                type="text" 
                value={textAnswer} 
                onChange={(e) => setTextAnswer(e.target.value)} 
                className="border p-2 rounded-md"
              />
              <button 
                onClick={handleTextAnswer} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
              >
                Enviar Respuesta
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">Número de alumno</label>
            <input 
              type="text" 
              id="studentNumber" 
              className="mt-1 p-2 w-64 border rounded-md text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario (opcional)</label>
            <input 
              type="text" 
              id="username" 
              className="mt-1 p-2 w-64 border rounded-md text-black"
            />
          </div>

          <button onClick={handleJoinTrivia} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Unirse a la Trivia
          </button>
        </>
      )}
    </div>
  );
}

export default HomePage;


