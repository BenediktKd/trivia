# Documento de Diseño para `HomePage`

## Descripción General

`HomePage` es un componente en React que gestiona la página principal de un juego de trivia. Utiliza tanto estados como efectos de React para gestionar la lógica de la aplicación.

## Estados

- `ws` (WebSocket): Se utiliza para la comunicación en tiempo real con el servidor del juego.
- `isQuestionReceived` (booleano): Determina si se ha recibido una pregunta del servidor.
- `questionData` (objeto): Almacena la pregunta actual recibida del servidor.
- `textAnswer` (cadena): Almacena la respuesta de texto ingresada por el usuario.
- `chatMessages` (array): Almacena los mensajes de chat enviados y recibidos.
- `secondsRemaining` (número): Almacena los segundos restantes para responder a la pregunta actual.
- `scores` (objeto): Almacena las puntuaciones de los jugadores.
- `lobbyData` (objeto): Almacena la información del lobby, como los jugadores conectados.
- `highScores` (array): Almacena las puntuaciones más altas del juego.
- `triviaName` (cadena): Almacena el nombre de la trivia actual.
- `currentStreak` (número): Almacena la racha actual de respuestas correctas del jugador.
- `answerResult` (cadena): Almacena si la respuesta del jugador es correcta o incorrecta.
- `questionId` (número): Almacena el ID de la pregunta actual.

## Efectos

1. Efecto para manejar el temporizador de cuenta atrás:
   - Se dispara cada vez que cambia `secondsRemaining`.
   - Actualiza `secondsRemaining` cada segundo.
   - Se limpia al desmontar el componente o al recibir una nueva pregunta.
  
2. Efecto para mostrar las puntuaciones más altas:
   - Se dispara cada vez que cambia `highScores`.
   - Muestra un modal o notificación con las puntuaciones más altas.

## Funciones

### `handleAnswer`

- Parámetros: `answer` (cadena)
- Descripción: Maneja las respuestas de opción múltiple.
- Funcionalidad:
  - Envía la `answer` al servidor a través de `ws`.
  - Actualiza `answerResult` basándose en la respuesta del servidor.
  - Actualiza `scores` y `currentStreak` basándose en la respuesta del servidor.
  
### `handleTextAnswer`

- Parámetros: `event` (evento)
- Descripción: Maneja las respuestas de texto.
- Funcionalidad:
  - Actualiza `textAnswer` con el valor actual del input.
  - Envía `textAnswer` al servidor a través de `ws` cuando el usuario presiona Enter.
  
### `handleChatMessage`

- Parámetros: `message` (cadena)
- Descripción: Maneja los mensajes de chat.
- Funcionalidad:
  - Añade `message` a `chatMessages`.
  - Envía `message` al servidor a través de `ws`.

### `handleJoinTrivia`

- Parámetros: `name` (cadena)
- Descripción: Permite al usuario unirse a una trivia.
- Funcionalidad:
  - Envía una solicitud al servidor para unirse a una trivia con `name`.
  - Al recibir la confirmación del servidor, actualiza `triviaName` y `lobbyData`.

## Renderizado

- Si `isQuestionReceived` es `false`, muestra la interfaz de usuario para unirse a una trivia.
- Si `isQuestionReceived` es `true`, muestra la pregunta actual y las opciones de respuesta.
- Muestra `secondsRemaining` como un temporizador de cuenta atrás.
- Muestra `chatMessages` como una lista de mensajes de chat.
- Muestra `scores`, `highScores` y `currentStreak` en la interfaz de usuario.

## Referencias

Este documento ha sido elaborado con la ayuda de ChatGPT de OpenAI[^1].

[^1]: "ChatGPT - OpenAI." https://www.openai.com/research/publications/chatgpt.
