'use client'

import React, { useEffect } from 'react';
import '../globals.css';

const QuestionPage: React.FC = () => {
  useEffect(() => {
    const websocket = (window as any).websocket;

    if (websocket) {
      websocket.onmessage = (event: MessageEvent) => { // Aquí especificamos el tipo
        const data = JSON.parse(event.data);
        console.log("Data received on QuestionPage:", data);
        // Aquí manejas los mensajes que recibes en la página de pregunta
      };
    } else {
      console.error("WebSocket not found on QuestionPage.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Pregunta</h2>
      {/* Aquí puedes renderizar la pregunta y las opciones basado en los datos recibidos */}
    </div>
  );
}

export default QuestionPage;









