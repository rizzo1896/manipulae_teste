import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import { ListContainer, PlayerAudio } from "./style.jsx";
import ReactAudioPlayer from "react-audio-player";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayerMusic from "../MusicPlayer/index";

const List = () => {
  const [isLoading, setLoading] = useState(true);
  const [valueList, setValueList] = useState(10);
  const [search, setSearch] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isPlayed, setIsPlayed] = useState(false);
  const [musicPlayed, setMusicPlayed] = useState("");

  let chartURL = `https://api.deezer.com/chart/0/tracks?&limit=${valueList}`;

  useEffect(() => {
    axios.get(chartURL).then((res) => {
      console.log(res.data);
      setDataList(res.data.data);
      setLoading(false);
    });
  }, [valueList]);

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handlePlayed = () => {
    if (!isPlayed) {
      setIsPlayed(true);
    } else {
      setIsPlayed(false);
    }
  };
  const handleIconSwap = (e) => {
    e.currentTarget.firstElementChild.innerHTML = ReactDOMServer.renderToString(
      !isPlayed ? <PlayCircleOutlineIcon /> : <PauseCircleOutlineIcon />
    );
  };

  // if (isLoading) {
  //   return <div className="App">Loading...</div>;
  // }

  return (
    <>
      <h1>ola</h1>
      <button
        onClick={() => {
          if (valueList < 100) {
            setValueList(valueList + 10);
          }
        }}
      >
        Adicionar
      </button>
      <br />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ListContainer>
        <div className="headerList">
          <div className="rank">#</div>
          <div className="favorite--icon">
            {/* <FavoriteBorderIcon fontSize={"inherit"} /> */}
          </div>
          <div className="title--music">FAIXA</div>
          <div className="title--artist">ARTISTA</div>
          <div className="title--album">ALBUM</div>
          <div className="title--duration">D.</div>
        </div>

        <div className="bodyList">
          {dataList.map((item, index) => {
            return (
              <>
                <div
                  key={index}
                  onMouseEnter={handleIconSwap}
                  onMouseLeave={(e) => {
                    if (!isPlayed) {
                      e.currentTarget.firstElementChild.innerHTML = index + 1;
                    } else {
                      e.currentTarget.firstElementChild.innerHTML =
                        ReactDOMServer.renderToString(
                          <PauseCircleOutlineIcon />
                        );
                    }
                  }}
                >
                  <div
                    className="rank"
                    onClick={() => setMusicPlayed(dataList[index].preview)}
                  >
                    {index + 1}
                  </div>
                  <div className="favorite--icon">
                    <span>
                      <FavoriteBorderIcon
                        fontSize={"inherit"}
                        // htmlColor={"red"}
                      />
                    </span>
                  </div>
                  <div className="title--music">{item.title}</div>
                  <div className="title--artist">{item.artist.name}</div>
                  <div className="title--album">{item.album.title}</div>
                  <div className="title--duration">
                    {item.duration / 60 < 10
                      ? "0" +
                        (item.duration / 60)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")
                      : (item.duration / 60)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")}
                  </div>
                </div>
              </>
            );
          })}
        </div>
        {/* <ReactAudioPlayer
          className="audio--player"
          controls
          src="https://cdns-preview-7.dzcdn.net/stream/c-70255a40b7c438c3239e94ba0c909128-3.mp3"
        /> */}
        <PlayerMusic url_music={musicPlayed} />
      </ListContainer>
    </>
  );
};

export default List;
