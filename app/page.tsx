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
  const [highScores, setHighScores] = useState<any | null>(null);
  const [triviaName, setTriviaName] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState<{username: string, streak: number}>({username: '', streak: 0});
  const [answerResult, setAnswerResult] = useState<{correct?: boolean}>({});
  const [questionId, setQuestionId] = useState<number | null>(null);



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

  useEffect(() => {
    console.log(highScores);
  }, [highScores]);

  const handleAnswer = (selectedOption: string) => {
    console.log("Selected Option:", selectedOption); // mostrar el valor
    
    
    if (ws) {
      ws.send(JSON.stringify({
        type: 'answer',
        question_id: questionData.question_id,
        value: selectedOption,
        trivia_id: triviaName // usando triviaName aquí
      }));
    }
    console.log("Type of Selected Option:", typeof selectedOption); // mostrar el tipo de dato
  };
  

  const handleTextAnswer = () => {
    if (ws) { // Aseguramos que ws está definido
      ws.send(JSON.stringify({
        type: 'answer',
        question_id: questionData.question_id, // usando questionData.question_id aquí
        value: textAnswer // enviando el texto de la respuesta como 'value'
      }));
      setTextAnswer(''); // Limpiar la respuesta de texto después de enviarla
    }
  };

  const handleChatMessage = (message: string, username: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setChatMessages(prevMessages => [...prevMessages, { message, username, timestamp }]);
  };

  const handleJoinTrivia = () => {
    const studentNumber = (document.getElementById('studentNumber') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value || 'Vladimir Putin';

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
        // Código para manejar la aceptación
      } else if (data.type === 'question') {
        setQuestionId(data.question_id);  // Agrega esta línea
        setTriviaName(data.trivia_id); // Set the trivia name here
        setLobbyData(null); 
        setIsQuestionReceived(true);
        setQuestionData(data);
        setChatMessages([]);
      } else if (data.type === 'chat') {
        handleChatMessage(data.message, data.username);
      } else if (data.type === 'timer') {
        setSecondsRemaining(data.seconds_remaining);
      } else if (data.type === 'score') {
        setScores(data.scores);
      } else if (data.type === 'lobby') {
        setLobbyData(data);
      } else if (data.type === 'highscore') {
        console.log(data);
        setHighScores(data);
      }
        else if (data.type === 'streak') {
        setCurrentStreak({username: data.username, streak: data.streak});
      }
        else if (data.type === 'result') {
        setAnswerResult({ correct: data.correct });
      }
    };

    setWs(websocket);
  };

  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="flex flex-row justify-between min-h-screen p-4">
      <div className="flex flex-col items-start w-2/3">
      <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Mystical Trivia Quest!</h2>
      <p className="text-lg mb-8">Únete a la aventura y demuestra tus conocimientos.</p>

        {highScores && highScores.winners ? (
          <div className="highscore-info border p-4 rounded-md">
            <h3>High Scores for Trivia ID: {highScores.trivia_id}</h3>
            <ul>
              {highScores.winners.map((winner: any, index: number) => (
                <li key={index}>
                  <p>{index + 1}. Username: {winner.username}</p>
                  <p>Score: {winner.score}</p>
                  <p>Streak: {winner.streak}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : lobbyData ? (
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
            <h2>Trivia: {triviaName}</h2> {/* Displaying the trivia name here */}
            <h3>{questionData.question_title}</h3>
            {secondsRemaining !== null && (
              <p className="text-lg mb-8">Tiempo restante: {secondsRemaining} segundos</p>
            )}
            {answerResult.correct !== undefined && (
              <div className={`text-4xl ${answerResult.correct ? 'text-green-600' : 'text-red-600'}`}>
                {answerResult.correct ? '¡Correcto!' : '¡Te equivocaste!'}
              </div>
            )}
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
      <div className="mb-4">
        <p className="text-lg font-bold">
          La racha actual es de {currentStreak.streak} de {currentStreak.username}.
        </p>
      </div>
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









