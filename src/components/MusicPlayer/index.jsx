import React, { useState, useEffect } from "react";

import { PlayerStyle } from "./style.jsx";

const PlayerAudio = (props) => {
  const [musicLink, setMusicLink] = useState("");

  useEffect(() => {
    setMusicLink(props.url_music);
  }, [props.url_music]);

  let audioElement = new Audio();
  const music = () => {
    // audioElement.setAttribute("src", "");
    // audioElement.removeAttribute("src");
    audioElement.load();
    audioElement.src = musicLink;

    audioElement.volume = 0.2;

    // audioElement.autoplay = true;
  };
  return (
    <>
      {/* <PlayerStyle controls="controls" autoPlay src={musicLink} /> */}

      <button onClick={music}>click</button>
      <button
        onClick={() => {
          music()
          audioElement.play();
        }}
      >
        play
      </button>
      <button
        onClick={() => {
          audioElement.pause();
        }}
      >
        pause
      </button>
    </>
  );
};

export default PlayerAudio;
