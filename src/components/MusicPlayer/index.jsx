import { red } from "@material-ui/core/colors";
import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
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
        // onPause={}
      />
    </>
  );
};

export default PlayerAudio;
