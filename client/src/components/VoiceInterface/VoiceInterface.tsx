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
        setAccessToken(accessToken); // TODO: this is getting called twice for some reason
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchToken();
  }, []);
  const connectToHume = () => {
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
