// change isListening and isLoading to something like listeningState

import { Mic } from 'lucide-react';
import './VoiceInterface.css';
import { useVoice } from '@humeai/voice-react';
import { useEffect, useState } from 'react';

export const VoiceInterface = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const { connect, status, disconnect } = useVoice();
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`)
          .then(response => response.json())
          .then(data => {
            return data;
          });
        const { accessToken } = response;
        setAccessToken(accessToken);
        console.log('accessToken:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchToken();
  }, []);
  const connectToHume = () => {
    console.log('Connecting to Hume with access token:', accessToken);
    try {
      connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: import.meta.env.VITE_HUME_CONFIG_ID,
        // other configuration props go here
      });
      console.log('Connected to Hume successfully');
    } catch (error) {
      console.error('Error connecting to Hume:', error);
    }
  };
  const disconnectToHume = () => {
    disconnect();
    // if (!socketRef.current) return;

    // // Avoid recursive close loop
    // const socket = socketRef.current;
    // socketRef.current = null;

    // if (socket.readyState < WebSocket.CLOSING) {
    //   socket.close(); // Triggers handleClose, but socketRef is now null
    // }

    // recorderRef.current?.stream.getTracks().forEach(t => t.stop());
    // recorderRef.current = null;

    // playerRef.current?.dispose();

    // dispatch({ type: 'set_connected', payload: false });
  };
  return (
    <div className="voice-interface">
      <div className="voice-controls">
        <div className="voice-button-container">
          <div className="voice-button-wrapper">
            <button
              onClick={status.value === 'connected' ? disconnectToHume : connectToHume}
              className={`voice-button ${status.value}`}
            >
              <Mic className="voice-icon" />
            </button>
            <span className="voice-status">{status.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const VoiceInterface = ({
//   connect,
//   disconnect,
//   connected,
// }: {
//   connect: () => void;
//   disconnect: () => void;
//   connected: boolean;
// }) => {
//   return (
//     <div className="voice-interface">
//       <div className="voice-controls">
//         <div className="voice-button-container">
//           <div className="voice-button-wrapper">
//             <button
//               onClick={connected ? disconnect : connect}
//               className={`voice-button ${connected ? 'listening' : 'idle'}`}
//             >
//               <Mic className="voice-icon" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
