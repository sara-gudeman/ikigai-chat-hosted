import React from 'react';
import './Message.css';
import type { ChatMessage } from '../../types/messages';

function extractTopThreeEmotions(message: ChatMessage): { emotion: string; score: string }[] {
  const scores = message.models.prosody?.scores;
  const scoresArray = Object.entries(scores || {});

  scoresArray.sort((a, b) => b[1] - a[1]);

  const topThreeEmotions = scoresArray.slice(0, 3).map(([emotion, score]) => ({
    emotion,
    score: Number(score).toFixed(2),
  }));

  return topThreeEmotions;
}

export const Message: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const { role, content } = msg.message;
  const timestamp = new Date().toLocaleTimeString();
  // const scores = msg.models?.prosody?.scores || {};
  const topEmotions = extractTopThreeEmotions(msg);
  const topEmotion = topEmotions[0]?.emotion.toLowerCase() || 'neutral';
  console.log('ChatMessage:', msg.id, msg);

  return (
    <div className={`message-row ${role}`}>
      {/* <div className="text-sm text-gray-600 mb-1">
        <strong>{role[0].toUpperCase() + role.slice(1)}</strong> at {timestamp}
      </div> */}
      <div className={`message-bubble ${role} ${topEmotion}`}>
        {/*role === 'assistant' && (
          <div className="emotion-header">
            emotion header
            getEmotionIcon(message.emotion)
            <EmotionIcon className="emotion-icon" /> emotion-icon
            <span className="emotion-text">{topEmotion}</span>emotion-text
          </div>
        )*/}
        <p className={`message-text`}>{content}</p>
        <span className="timestamp">{timestamp}</span>
      </div>
      {/*<div className="scores flex flex-wrap gap-2 text-xs text-gray-700">
        need to change the key here because emotions can be repeated
        {topEmotions.map(({ emotion, score }) => (
          <div key={emotion} className="score-item bg-gray-100 px-2 py-1 rounded">
            {emotion}: <strong>{score}</strong>
          </div>
        ))}
      </div>*/}
    </div>
  );
};
