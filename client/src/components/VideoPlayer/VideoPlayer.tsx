import myVideo from './bg.mp4';
import './VideoPlayer.css';

export const VideoPlayer = () => {
  return (
    <video autoPlay muted width="640" height="360">
      <source src={myVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
