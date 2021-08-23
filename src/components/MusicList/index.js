import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ListContainer, PlayerStyle, InfoBox } from "./style.jsx";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import MusicPlayer from "../MusicPlayer/index";

const List = () => {
  const [isLoading, setLoading] = useState(true);
  const [valueList, setValueList] = useState(20);
  const [search, setSearch] = useState("");
  const [dataList, setDataList] = useState([]);
  const [trackList, setTrackList] = useState([]);
  const [bannerAlbum, setBannerAlbum] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isPlayed, setIsPlayed] = useState(false);
  const [musicPlayed, setMusicPlayed] = useState("");
  const [showTrackList, setShowTrackList] = useState(true);
  const [showFavoriteList, setShowFavoriteList] = useState(false);
  const [favoriteData, setFavoriteData] = useState([]);

  const favoriteList = useSelector(
    (state) => state.FavoriteListReducer.favorites
  );
  const trackLinks = useSelector(
    (state) => state.FavoriteListReducer.trackLinks
  );
  const dispatch = useDispatch();

  let chartPlaylist = `https://api.deezer.com/playlist/1111141961?&limit=${valueList}`;

  useEffect(() => {
    axios.get(chartPlaylist).then((res) => {
      // console.log(res.data, "album");
      setDataList(res.data);
      setTrackList(res.data.tracks.data);
      setBannerAlbum(res.data.picture_medium);
      setCreatedBy(res.data.creator.name);
      // Ao terminar a requisição dos dados, mostra os componentes
      setLoading(false);
    });
  }, [chartPlaylist]);

  useEffect(() => {
    axios.all(trackLinks.map((l) => axios.get(l))).then(
      axios.spread(function (...res) {
        // all requests are now complete
        setFavoriteData(res);
      })
    );
    if (!showTrackList && trackLinks.length === 0) {
      setShowTrackList(true);
      setShowFavoriteList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackLinks]);

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

  const Add_fav = (e) => {
    dispatch({
      type: "ADD_FAV",
      newId: parseInt(e.currentTarget.getAttribute("value")),
      add_tracks: `https://api.deezer.com/track/${e.currentTarget.getAttribute(
        "value"
      )}`,
    });
  };

  const Del_fav = (e) => {
    dispatch({
      type: "DELETE_FAV",
      remove: parseInt(e.currentTarget.getAttribute("value")),
      remove_tracks: `https://api.deezer.com/track/${e.currentTarget.getAttribute(
        "value"
      )}`,
    });
  };

  // eslint-disable-next-line no-array-constructor
  const handleFav = (e) => {
    favoriteList.includes(parseInt(e.currentTarget.getAttribute("value"))) &&
    trackLinks.includes(
      `https://api.deezer.com/track/${e.currentTarget.getAttribute("value")}`
    )
      ? Del_fav(e)
      : Add_fav(e);
  };

  const toggleData = () => {
    if (showTrackList && favoriteList.length > 0) {
      setShowTrackList(false);
      setShowFavoriteList(true);
    }
    if (!showTrackList) {
      setShowTrackList(true);
      setShowFavoriteList(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button
        onClick={() => {
          if (valueList < 100) {
            setValueList(valueList + 20);
          }
        }}
      >
        adicionar +20 musicas
      </button>
      <br />

      <br />
      <br />
      <button
        onClick={() => {
          toggleData();
        }}
      >
        Mostrar Favoritos
      </button>
      <InfoBox>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="content">
          <img src={bannerAlbum} alt="" />
          <div className="Info--desc">
            <h1>{dataList.title}</h1>
            <div>
              <span>criado por: </span>
              {createdBy}
            </div>
          </div>
        </div>
      </InfoBox>
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
          {showTrackList &&
            trackList.map((item, key) => {
              return (
                <>
                  <div
                    key={key}
                    onMouseEnter={handleIconSwap}
                    onMouseLeave={(e) => {
                      if (!isPlayed) {
                        e.currentTarget.firstElementChild.innerHTML = key + 1;
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
                      onClick={() => setMusicPlayed(trackList[key].preview)}
                    >
                      {key + 1}
                    </div>
                    <div className="favorite--icon">
                      <span value={item.id} onClick={(e) => handleFav(e)}>
                        {favoriteList.includes(item.id) ? (
                          <FavoriteIcon style={{ color: "red" }} />
                        ) : (
                          <FavoriteBorderIcon fontSize={"inherit"} />
                        )}
                      </span>
                    </div>
                    <div className="title--music">
                      <a target="_blank" rel="noreferrer" href={item.link}>
                        {item.title}
                      </a>
                    </div>
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
          {/* Lista de Favoritos */}
          {showFavoriteList &&
            favoriteData.map((item, key) => {
              return (
                <>
                  <div
                    key={key}
                    onMouseEnter={handleIconSwap}
                    onMouseLeave={(e) => {
                      if (!isPlayed) {
                        e.currentTarget.firstElementChild.innerHTML = key + 1;
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
                      onClick={() => setMusicPlayed(trackList[key].preview)}
                    >
                      {key + 1}
                    </div>
                    <div className="favorite--icon">
                      <span value={item.data.id} onClick={(e) => handleFav(e)}>
                        <FavoriteIcon style={{ color: "red" }} />
                      </span>
                    </div>
                    <div className="title--music">
                      <a target="_blank" rel="noreferrer" href={item.data.link}>
                        {item.data.title}
                      </a>
                    </div>
                    <div className="title--artist">{item.data.artist.name}</div>
                    <div className="title--album">{item.data.album.title}</div>
                    <div className="title--duration">
                      {item.data.duration / 60 < 10
                        ? "0" +
                          (item.data.duration / 60)
                            .toFixed(2)
                            .toString()
                            .replace(".", ":")
                        : (item.data.duration / 60)
                            .toFixed(2)
                            .toString()
                            .replace(".", ":")}
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </ListContainer>
      <PlayerStyle>
        <MusicPlayer url_music={musicPlayed} />
      </PlayerStyle>
    </>
  );
};

export default List;
