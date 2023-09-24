'use client'

import React, { useEffect, useState } from 'react';
import '../globals.css';

const QuestionPage: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (localStorage.getItem('shouldContinueListening') === 'true') {
      const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');
      
      websocket.onopen = () => {
        console.log("WebSocket connection opened in QuestionPage");
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        // Aquí manejas los mensajes que recibes en la página de pregunta
      };

      setWs(websocket);
    }

    return () => {
      localStorage.removeItem('shouldContinueListening');
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Pregunta</h2>
      {/* Aquí iría el resto de tu diseño para mostrar la pregunta y las opciones de respuesta */}
    </div>
  );
}

export default QuestionPage;


