// change isListening and isLoading to something like listeningState

import { Mic } from 'lucide-react';
import './VoiceInterface.css';

export const VoiceInterface = ({
  connect,
  disconnect,
  connected,
}: {
  connect: () => void;
  disconnect: () => void;
  connected: boolean;
}) => {
  return (
    <div className="voice-interface">
      <div className="voice-controls">
        <div className="voice-button-container">
          <div className="voice-button-wrapper">
            <button
              onClick={connected ? disconnect : connect}
              className={`voice-button ${connected ? 'listening' : 'idle'}`}
            >
              <Mic className="voice-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
