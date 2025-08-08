import myVideo from './bg.mp4';
import './VideoPlayer.css';

export const VideoPlayer = () => {
  // TODO: this is massive and should be optimized :)
  // also this could be in assets
  return (
    <video autoPlay playsInline muted width="640" height="360">
      <source src={myVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
