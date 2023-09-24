import React, { useState } from 'react';
import { useRouter } from 'next/router';
import './globals.css';

const HomePage: React.FC = () => {
  const router = useRouter();

  // Estados para los valores de los inputs
  const [studentNumber, setStudentNumber] = useState('');
  const [username, setUsername] = useState('');

  const handleJoinClick = () => {
    // Aquí puedes manejar la validación o enviar los datos antes de redirigir
    router.push('/lobby');  // Redirige al usuario a la página del lobby
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Mystical Trivia Quest!</h2>
      <p className="text-lg mb-8">Únete a la aventura y demuestra tus conocimientos.</p>

      <div className="mb-4">
        <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">Número de alumno</label>
        <input 
          type="text" 
          id="studentNumber" 
          value={studentNumber} 
          onChange={(e) => setStudentNumber(e.target.value)} 
          className="mt-1 p-2 w-64 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario (opcional)</label>
        <input 
          type="text" 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="mt-1 p-2 w-64 border rounded-md"
        />
      </div>

      <button onClick={handleJoinClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Unirse a la Trivia
      </button>
    </div>
  );
}

export default HomePage;
