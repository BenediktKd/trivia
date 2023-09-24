"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './globals.css';

const HomePage: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Función para manejar el evento de unirse a la trivia
  const handleJoinTrivia = () => {
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'DefaultUsername'; // Puedes cambiar 'DefaultUsername' según lo que desees

    if (ws) {
      ws.send(JSON.stringify({
        type: 'join',
        id: studentNumber,
        username: username
      }));
    }
  };

  useEffect(() => {
    const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');

    websocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Aquí manejas los eventos entrantes, como ACCEPTED, DENIED, etc.
      console.log(data);
    };

    setWs(websocket);

    // Asegúrate de cerrar la conexión cuando el componente se desmonte
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

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

      <button onClick={handleJoinTrivia} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        Unirse a la Trivia
      </button>

      <Link href="/lobby">
        <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ir al Lobby
        </a>
      </Link>
    </div>
  );
}

export default HomePage;

