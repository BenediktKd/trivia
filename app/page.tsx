'use client'

import React, { useState } from 'react';
import './globals.css';

const HomePage: React.FC = () => {

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isQuestionReceived, setIsQuestionReceived] = useState(false); // Nuevo estado
  const [questionData, setQuestionData] = useState<any>(null); // Datos de la pregunta

  // Función para manejar el evento de unirse a la trivia
  const handleJoinTrivia = () => {
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'DefaultUsername';

    // Establecer la conexión WebSocket
    const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');

    websocket.onopen = () => {
      console.log("WebSocket connection opened");

      // Adjuntar el objeto websocket al objeto window
      (window as any).websocket = websocket;

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
        localStorage.setItem('shouldContinueListening', 'true');
      } else if (data.type === 'question') {
        setIsQuestionReceived(true); // Cambiar el estado para mostrar el contenido de la pregunta
        setQuestionData(data.question); // Guardar los datos de la pregunta
      }
    };

    setWs(websocket);
  };

  // Si se ha recibido una pregunta, mostrar el contenido relacionado con la pregunta
  if (isQuestionReceived && questionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">{questionData.title}</h2>
        {/* Aquí puedes agregar más contenido relacionado con la pregunta */}
      </div>
    );
  }

  // Contenido inicial
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Mystical Trivia Quest!</h2>
      <p className="text-lg mb-8">Únete a la aventura y demuestra tus conocimientos.</p>

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
    </div>
  );
}

export default HomePage;

