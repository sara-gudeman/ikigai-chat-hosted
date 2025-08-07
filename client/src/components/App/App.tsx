import './App.css';
import { MessageContainer } from '../MessageContainer';
import { Header } from '../Header';
import { VoiceInterface } from '../VoiceInterface';
import { useReducer, useRef, useEffect } from 'react';
import { EVIWebAudioPlayer } from 'hume';
import { connectEVI, startAudioCapture } from '../../evi';
import { chatReducer, initialState } from '../../reducers/reducer';
import { VideoPlayer } from '../VideoPlayer';

// Your environment keys
const apiKey = import.meta.env.VITE_HUME_API_KEY!;
const configId = import.meta.env.VITE_HUME_CONFIG_ID!;
export function App() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Update the type to match what connectEVI returns
  const socketRef = useRef<ReturnType<typeof connectEVI> | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const playerRef = useRef<EVIWebAudioPlayer | null>(null);

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

  const handleOpen = async () => {
    recorderRef.current = await startAudioCapture(socketRef.current!);
    await playerRef.current?.init();
  };

  const connect = () => {
    if (socketRef.current && socketRef.current.readyState < WebSocket.CLOSING) return;
    dispatch({ type: 'set_connected', payload: true });
    try {
      socketRef.current = new WebSocket('ws://localhost:3000/ws');
    } catch (err) {
      console.error('Connection failed', err);
      dispatch({ type: 'set_connected', payload: false });
    }
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
    <>
      <div className="chat-wrapper">
        <Header />
        <MessageContainer messages={state.messages} />
        <VoiceInterface connect={connect} disconnect={disconnect} connected={state.connected} />
      </div>
      <VideoPlayer />
    </>
  );
}

export default App;
