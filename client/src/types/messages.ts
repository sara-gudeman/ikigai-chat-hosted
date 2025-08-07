// types.ts

// update these types to just use Hume's
export type Emotion =
  | 'Admiration'
  | 'Adoration'
  | 'Aesthetic Appreciation'
  | 'Amusement'
  | 'Anger'
  | 'Anxiety'
  | 'Awe'
  | 'Awkwardness'
  | 'Boredom'
  | 'Calmness'
  | 'Concentration'
  | 'Confusion'
  | 'Contemplation'
  | 'Contempt'
  | 'Contentment'
  | 'Craving'
  | 'Desire'
  | 'Determination'
  | 'Disappointment'
  | 'Disgust'
  | 'Distress'
  | 'Doubt'
  | 'Ecstasy'
  | 'Embarrassment'
  | 'Empathic Pain'
  | 'Entrancement'
  | 'Envy'
  | 'Excitement'
  | 'Fear'
  | 'Guilt'
  | 'Horror'
  | 'Interest'
  | 'Joy'
  | 'Love'
  | 'Nostalgia'
  | 'Pain'
  | 'Pride'
  | 'Realization'
  | 'Relief'
  | 'Romance'
  | 'Sadness'
  | 'Satisfaction'
  | 'Shame'
  | 'Surprise (negative)'
  | 'Surprise (positive)'
  | 'Sympathy'
  | 'Tiredness'
  | 'Triumph';

export type ProsodyScores = Record<Emotion, number>;

export interface ProsodyModel {
  scores: ProsodyScores;
}

export interface Models {
  prosody: ProsodyModel;
}

export interface MessageContent {
  role: 'user' | 'assistant';
  content: string;
}

export type HumeUserMessage = {
  type: 'user_message';
  message: MessageContent;
  models: Models;
  id: string;
};

export type HumeAssistantMessage = {
  type: 'assistant_message';
  message: MessageContent;
  models: Models;
  id: string;
};

export type ChatMessage = HumeUserMessage | HumeAssistantMessage;
