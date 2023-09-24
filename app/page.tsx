'use client'

import React, { useState } from 'react';
import './globals.css';

const HomePage: React.FC = () => {
  // Estado para mantener la conexión WebSocket
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Función que se ejecuta cuando el usuario intenta unirse a la trivia
  const handleJoinTrivia = () => {
    // Obtiene el número del estudiante y el nombre de usuario de los campos de entrada
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'DefaultUsername';

    // Establece una nueva conexión WebSocket
    const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');

    // Función que se ejecuta cuando la conexión WebSocket se abre correctamente
    websocket.onopen = () => {
      console.log("WebSocket connection opened");

      // Envía un mensaje de tipo 'join' para unirse a la trivia
      websocket.send(JSON.stringify({
        type: 'join',
        id: studentNumber,
        username: username
      }));
    };

    // Función que se ejecuta cuando se recibe un mensaje a través de la conexión WebSocket
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      // Si el mensaje es de tipo 'accepted', guarda un indicador en el localStorage
      if (data.type === 'accepted') {
        localStorage.setItem('shouldContinueListening', 'true');
      } 
      // Si el mensaje es de tipo 'question', muestra una alerta y redirige a la página de pregunta
      else if (data.type === 'question') {
        alert("Te has unido a una partida en curso. Comenzarás con 0 puntos.");
        window.location.href = '/question';
      }
    };

    // Actualiza el estado con la conexión WebSocket
    setWs(websocket);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Mystical Trivia Quest!</h2>
      <p className="text-lg mb-8">Únete a la aventura y demuestra tus conocimientos.</p>

      {/* // Campo de entrada para el número del estudiante */}
      <div className="mb-4">
        <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">Número de alumno</label>
        <input 
          type="text" 
          id="studentNumber" 
          className="mt-1 p-2 w-64 border rounded-md text-black"
        />
      </div>

      {/* // Campo de entrada para el nombre de usuario */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario (opcional)</label>
        <input 
          type="text" 
          id="username" 
          className="mt-1 p-2 w-64 border rounded-md text-black"
        />
      </div>

      {/* // Botón para unirse a la trivia */}
      <button onClick={handleJoinTrivia} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Unirse a la Trivia
      </button>
    </div>
  );
}

export default HomePage;


