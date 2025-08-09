import './App.css';
import { Header } from '../Header';
import { VideoPlayer } from '../VideoPlayer';
import { MessageContainer } from '../MessageContainer';
import { VoiceInterface } from '../VoiceInterface';
import { VoiceProvider } from '@humeai/voice-react';
import { useReducer } from 'react';
import { chatReducer, initialState } from '../../reducers/reducer';

export const App = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  // TODO: look into why this setup has introduced a lag
  const handleMessage = (msg: any) => {
    console.log(msg.type)
    switch (msg.type) {
      case 'user_message':
      case 'assistant_message':
        dispatch({ type: 'append_msg', payload: msg });
        break;
      case 'audio_output':
        // playerRef.current?.enqueue(msg);
        break;
      case 'user_interruption':
        // playerRef.current?.stop();
        break;
      case 'chat_metadata':
        console.log('metadata', msg);
        break;
      case 'error':
        console.error('EVI error', msg);
        break;
    }
  };

  return (
    <>
      <VoiceProvider onMessage={handleMessage}>
        <div className="chat-wrapper">
          <Header />
          <MessageContainer messages={state.messages} />
          <VoiceInterface />
        </div>
      </VoiceProvider>
      <VideoPlayer />
    </>
  );
};
