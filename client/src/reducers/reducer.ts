import type { ChatMessage } from '../types/messages';
import { v4 as uuidv4 } from 'uuid';

export type Action =
  | { type: 'append_msg'; payload: ChatMessage }
  | { type: 'clear_msgs' }
  | { type: 'set_connected'; payload: boolean };

export type State = {
  messages: ChatMessage[];
  connected: boolean;
};

export const initialState: State = {
  messages: [],
  connected: false,
};

export function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'append_msg':
      console.log('Appending message:', action.payload);
      const messageWithId = {
        ...action.payload,
        id: uuidv4(),
      };
      return { ...state, messages: [...state.messages, messageWithId] };
    case 'clear_msgs':
      return { ...state, messages: [] };
    case 'set_connected':
      return { ...state, connected: action.payload };
    default:
      return state;
  }
}
