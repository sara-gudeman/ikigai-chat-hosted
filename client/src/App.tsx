import { VoiceProvider } from '@humeai/voice-react';
import { useReducer, useRef, useEffect } from 'react';
import { EVIWebAudioPlayer } from 'hume';
import { chatReducer, initialState } from './reducers/reducer';
import { ButtonTest } from './ButtonTest';

function App() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const playerRef = useRef<EVIWebAudioPlayer | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`)
          .then(response => response.json())
          .then(data => {
            return data;
          });
        console.log('accessToken:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    playerRef.current = new EVIWebAudioPlayer();
    return () => disconnect();
  }, []);

  const handleMessage = async (msg: any) => {
    switch (msg.type) {
      case 'user_message':
      case 'assistant_message':
        if (msg.type === 'user_message') {
          playerRef.current?.stop();
        }
        dispatch({ type: 'append_msg', payload: msg });
        break;
      case 'audio_output':
        await playerRef.current?.enqueue(msg);
        break;
      case 'user_interruption':
        playerRef.current?.stop();
        break;
      case 'chat_metadata':
        console.log('metadata', msg);
        break;
      case 'error':
        console.error('EVI error', msg);
        break;
    }
  };

  const connect = () => {
    if (socketRef.current && socketRef.current.readyState < WebSocket.CLOSING) return;
    dispatch({ type: 'set_connected', payload: true });
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      // ws.send(...) if needed
    };

    ws.onerror = err => {
      console.error('WebSocket error', err);
    };

    ws.onmessage = event => {
      console.log('Message from server', event.data);
    };

    return () => {
      ws.close();
    };
    // try {
    //   socketRef.current = new WebSocket('ws://localhost:3001');
    //   setConnectionState('connecting');

    //   socketRef.current.onopen = () => {
    //     console.log('Connected to server');
    //     setConnectionState('connected');
    //     // Send API key for authentication
    //     socketRef.current.send(JSON.stringify({ type: 'authenticate', data: apiKey }));
    //   };

    //   socketRef.current.onmessage = event => {
    //     try {
    //       const data = JSON.parse(event.data);

    //       switch (data.type) {
    //         case 'authenticated':
    //           console.log('Authenticated successfully');
    //           setIsAuthenticated(true);
    //           setError('');
    //           break;
    //         case 'auth_error':
    //           console.error('Auth error:', data.message);
    //           setError(data.message);
    //           setIsAuthenticated(false);
    //           break;
    //         case 'message':
    //           setMessages(prev => [...prev, data.data]);
    //           break;
    //         default:
    //           console.log('Unknown message type:', data.type);
    //       }
    //     } catch (err) {
    //       console.error('Error parsing message:', err);
    //     }
    //   };

    //   socketRef.current.onclose = () => {
    //     console.log('Disconnected');
    //     setIsAuthenticated(false);
    //     setConnectionState('disconnected');
    //     socketRef.current = null;
    //   };

    //   socketRef.current.onerror = error => {
    //     console.error('WebSocket error:', error);
    //     setError('Connection error occurred');
    //     setConnectionState('error');
    //   };
    // } catch (err) {
    //   console.error('Failed to create WebSocket connection:', err);
    //   setError('Failed to connect to server');
    // }
  };

  const handleClose = () => {
    disconnect();
  };

  const disconnect = () => {
    if (!socketRef.current) return;

    // Avoid recursive close loop
    const socket = socketRef.current;
    socketRef.current = null;

    if (socket.readyState < WebSocket.CLOSING) {
      socket.close(); // Triggers handleClose, but socketRef is now null
    }

    recorderRef.current?.stream.getTracks().forEach(t => t.stop());
    recorderRef.current = null;

    playerRef.current?.dispose();

    dispatch({ type: 'set_connected', payload: false });
  };

  return (
    <VoiceProvider>
      <ButtonTest></ButtonTest>
    </VoiceProvider>
  );
}

export default App;
