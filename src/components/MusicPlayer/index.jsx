import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";

const PlayerAudio = (props) => {
  const [musicLink, setMusicLink] = useState("");

  useEffect(() => {
    setMusicLink(props.url_music);
  }, [props.url_music]);

  return (
    <>
      <ReactAudioPlayer
        style={{
          minWidth: "inherit",
          maxWidth: "inherit",
          position: "fixed",
          bottom: "0",
        }}
        volume={0.3}
        autoPlay
        controls
        src={musicLink}
      />
    </>
  );
};

export default PlayerAudio;