// TODO: clean this up!!
import { Mic, LoaderCircle, MicOff } from 'lucide-react';
import './VoiceInterface.css';
import { useVoice } from '@humeai/voice-react';
import { useEffect, useState } from 'react';

type MicrophoneAccess =
  | 'permissions_loading'
  | 'permissions_denied'
  | 'permissions_error'
  | 'permissions_granted';

export const VoiceInterface = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [microphoneAccess, setMicrophoneAccess] = useState<MicrophoneAccess>('permissions_loading');
  const { connect, status, disconnect } = useVoice();

  useEffect(() => {
    async function checkMicrophoneAccess() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Permission granted - clean up the stream
        stream.getTracks().forEach(track => track.stop());
        console.log('granted');
        setMicrophoneAccess('permissions_granted');
        return 'granted';
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          console.log('denied');
          setMicrophoneAccess('permissions_denied');
          return 'denied';
        } else if (error instanceof DOMException && error.name === 'NotFoundError') {
          setMicrophoneAccess('permissions_error');
          return 'no-device';
        } else {
          setMicrophoneAccess('permissions_denied');
          return 'error';
        }
      }
    }

    checkMicrophoneAccess();
  }, []);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`/api/token`)
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
        verboseTranscription: false,
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
  const handleClick = () => {
    if (status.value === 'connected') {
      disconnectToHume();
    } else {
      connectToHume();
    }
  };

  // Option 1: Using a mapping object (most maintainable)
  const getUIState = () => {
    // Prioritize permission states over connection states
    if (microphoneAccess === 'permissions_loading') {
      return 'permissions_loading';
    }
    if (microphoneAccess === 'permissions_denied') {
      return 'permissions_denied';
    }
    if (microphoneAccess === 'permissions_error' || status.value === 'error') {
      return 'error';
    }
    return status.value; // connecting, connected, disconnected
  };

  const UI_CONFIG = {
    connecting: {
      icon: <LoaderCircle className="voice-icon connecting" />,
      text: 'connecting',
    },
    permissions_loading: {
      icon: <LoaderCircle className="voice-icon connecting" />,
      text: 'permissions loading...',
    },
    error: {
      icon: <MicOff className="voice-icon" />,
      text: 'error',
    },
    permissions_denied: {
      icon: <MicOff className="voice-icon" />,
      text: 'permissions denied',
    },
    connected: {
      icon: <Mic className="voice-icon connected" />,
      text: 'connected',
    },
    disconnected: {
      icon: <Mic className="voice-icon disconnected" />,
      text: 'click to connect',
    },
  };

  const renderIcon = () => {
    const uiState = getUIState();
    const config = UI_CONFIG[uiState];
    if (!config) {
      console.error(`Unhandled UI state: ${uiState}`);
      return <Mic className="voice-icon" />;
    }
    return config.icon;
  };

  const renderText = () => {
    const uiState = getUIState();
    const config = UI_CONFIG[uiState];
    if (!config) {
      console.error(`Unhandled UI state: ${uiState}`);
      return '';
    }
    return config.text;
  };

  const disableButton =
    status.value === 'error' ||
    microphoneAccess === 'permissions_error' ||
    microphoneAccess === 'permissions_denied';

  return (
    <div className="voice-interface">
      <div className="voice-controls">
        <div className="voice-button-container">
          <div className="voice-button-wrapper">
            <button
              disabled={disableButton}
              onClick={handleClick}
              className={`voice-button ${status.value}`}
            >
              {renderIcon()}
            </button>
            <span className="voice-status text">{renderText()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
