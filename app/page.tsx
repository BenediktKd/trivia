import React from 'react';
// import Layout from './components/Layout';
import './globals.css';

const HomePage: React.FC = () => {
  return (
    // <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Mystical Trivia Quest!</h2>
        <p className="text-lg mb-8">Únete a la aventura y demuestra tus conocimientos.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Unirse a la Trivia
        </button>
      </div>
    // </Layout>
  );
}

export default HomePage;