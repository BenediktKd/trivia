'use client'

import React, { useState, useEffect } from 'react';
import './globals.css';

const HomePage: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isQuestionReceived, setIsQuestionReceived] = useState(false);
  const [questionData, setQuestionData] = useState<any | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ message: string, username: string, timestamp: string }>>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [scores, setScores] = useState<{ [username: string]: number }>({});
  const [lobbyData, setLobbyData] = useState<any | null>(null);

  const buttonColors = ['bg-red-600', 'bg-green-600', 'bg-blue-600', 'bg-yellow-600'];

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (secondsRemaining !== null && secondsRemaining > 0) {
      timerId = setInterval(() => {
        setSecondsRemaining(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [secondsRemaining]);

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

  const handleChatMessage = (message: string, username: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setChatMessages(prevMessages => [...prevMessages, { message, username, timestamp }]);
  };

  const handleJoinTrivia = () => {
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'DefaultUsername';

    const websocket = new WebSocket('wss://trivia.tallerdeintegracion.cl/connect');

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
      } else if (data.type === 'question') {
        setIsQuestionReceived(true);
        setQuestionData(data);
        setChatMessages([]); // Limpiar mensajes de chat al recibir una nueva pregunta
      } else if (data.type === 'chat') {
        handleChatMessage(data.message, data.username);
      } else if (data.type === 'timer') {
        setSecondsRemaining(data.seconds_remaining);
      } else if (data.type === 'score') {
        setScores(data.scores);
      } else if (data.type === 'lobby') {
        setLobbyData(data);
      }
    };

    setWs(websocket);
  };

  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="flex flex-row justify-between min-h-screen p-4">
      <div className="flex flex-col items-start w-2/3">
        {lobbyData ? (
          <div className="lobby-info border p-4 rounded-md">
            <h3>ID de Trivia: {lobbyData.trivia_id}</h3>
            <p>{lobbyData.message}</p>
            <p>Tiempo restante: {lobbyData.seconds_remaining} segundos</p>
            <p>Jugadores:</p>
            <ul>
              {lobbyData.players.map((player: string, index: number) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
          </div>
        ) : isQuestionReceived && questionData ? (
          <div>
            <h3>{questionData.question_title}</h3>
            {questionData.question_type === 'button' && (
              <div>
                {Object.entries(questionData.question_options).map(([key, value], index) => (
                  <button 
                    key={key} 
                    onClick={() => handleAnswer(key)} 
                    className={`${buttonColors[index % buttonColors.length]} text-white font-bold py-2 px-4 rounded m-2`}
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
                  className="border p-2 rounded-md text-black"
                />
                <button 
                  onClick={handleTextAnswer} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                >
                  Enviar Respuesta
                </button>
              </div>
            )}
            {questionData.question_type === 'chat' && (
              <div>
                <div className="chat-box border p-2 rounded-md mb-2" style={{ height: '200px', overflowY: 'scroll' }}>
                  {chatMessages.map((msg, index) => (
                    <p key={index}>
                      <strong>{msg.username} ({msg.timestamp}):</strong> {msg.message}
                    </p>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={textAnswer} 
                  onChange={(e) => setTextAnswer(e.target.value)} 
                  className="border p-2 rounded-md text-black"
                />
                <button 
                  onClick={handleTextAnswer} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                >
                  Enviar Mensaje
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
  
      {/* Tabla de clasificación */}
      <div className="ranking-table mt-4 w-1/3">
        <h3 className="text-lg font-bold">Ranking</h3>
        <table className="border-collapse border border-gray-500 w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">Usuario</th>
              <th className="border border-gray-400 px-4 py-2">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map(([username, score], index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2">{username}</td>
                <td className="border border-gray-400 px-4 py-2">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;






