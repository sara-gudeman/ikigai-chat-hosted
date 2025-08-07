import type { ChatMessage } from '../types/messages';
import { v4 as uuidv4 } from 'uuid';

export type Action = { type: 'append_msg'; payload: ChatMessage } | { type: 'clear_msgs' };

export type State = {
  messages: ChatMessage[];
};

export const initialState: State = {
  messages: [],
};

export function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'append_msg':
      console.log('Appending message:', action.payload);
      // TODO: remove this once we figure out why messages are doubly appending
      if (
        state.messages[state.messages.length - 1]?.message.content ===
        action.payload.message.content
      ) {
        return state; // Prevent duplicate messages
      }
      const messageWithId = {
        ...action.payload,
        id: uuidv4(),
      };
      return { ...state, messages: [...state.messages, messageWithId] };
    case 'clear_msgs':
      return { ...state, messages: [] };
    default:
      return state;
  }
}
