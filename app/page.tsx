'use client'

import React from 'react';
import './globals.css';

const HomePage: React.FC = () => {

  const handleJoinTrivia = () => {
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'DefaultUsername';

    // Establecer la conexión WebSocket
    const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');

    // Almacenar el objeto WebSocket en el objeto window
    (window as any).websocket = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connection opened");
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
        console.log("Accepted event received.");
      } else if (data.type === 'question') {
        alert("Te has unido a una partida en curso. Comenzarás con 0 puntos.");
        window.location.href = '/question';
      }
    };
  };

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



