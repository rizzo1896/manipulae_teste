import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Container, ListContainer, PlayerStyle, InfoBox } from "./style.jsx";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SearchIcon from "@material-ui/icons/Search";
import MusicPlayer from "../MusicPlayer/index";

const List = () => {
  const [isLoading, setLoading] = useState(true);
  const [valueList, setValueList] = useState(10);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [toggleSearch, setToggleSearch] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [trackList, setTrackList] = useState([]);
  const [bannerAlbum, setBannerAlbum] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isPlayed, setIsPlayed] = useState(false);
  const [musicPlayed, setMusicPlayed] = useState("");
  const [showTrackList, setShowTrackList] = useState(true);
  const [showFavoriteList, setShowFavoriteList] = useState(false);
  const [favoriteData, setFavoriteData] = useState([]);
  const [buttonValue, setButtonValue] = useState("Mostrar Favoritos");

  const favoriteList = useSelector(
    (state) => state.FavoriteListReducer.favorites
  );
  const trackLinks = useSelector(
    (state) => state.FavoriteListReducer.trackLinks
  );
  const dispatch = useDispatch();
  let chartPlaylist = `https://api.deezer.com/playlist/1111141961?&index=0&limit=${valueList}`;

  //  handle CORS error using this snippet from https://github.com/Rob--W/cors-anywhere
  // clique no link para liberar o cors na sua maquina -> https://cors-anywhere.herokuapp.com/
  (function () {
    var cors_api_host = "cors-anywhere.herokuapp.com";
    var cors_api_url = "https://" + cors_api_host + "/";
    var slice = [].slice;
    var origin = window.location.protocol + "//" + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      var args = slice.call(arguments);
      var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
      if (
        targetOrigin &&
        targetOrigin[0].toLowerCase() !== origin &&
        targetOrigin[1] !== cors_api_host
      ) {
        args[1] = cors_api_url + args[1];
      }
      return open.apply(this, args);
    };
  })();

  // Requisição da lista principal
  useEffect(() => {
    axios.get(chartPlaylist).then((res) => {
      setDataList(res.data);
      setTrackList(res.data.tracks.data);
      setBannerAlbum(res.data.picture_medium);
      setCreatedBy(res.data.creator.name);
      // Ao terminar a requisição dos dados, mostra os componentes
      setLoading(false);
    });
  }, [chartPlaylist]);

  // Infinite scroll
  useEffect(() => {
    const activateInfiniteScroll = () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          setValueList(valueList + 20);
        }
      };
    };
    activateInfiniteScroll();
  }, [valueList]);

  // Requisição da lista de favoritos
  useEffect(() => {
    axios
      .all(
        trackLinks.map((l) =>
          axios.get(l, { headers: { "Access-Control-Allow-Origin": "*" } })
        )
      )
      .then(
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

  // gerencia o campo de pesquisa
  const handleInput = (e) => {
    e.preventDefault();
    setShowTrackList(false);
    setShowFavoriteList(false);
    setSearch(e.target.value);
    axios
      .get(`https://api.deezer.com/search?q=${search}&limit=${valueList}`)
      .then((res) => setSearchResults(res.data.data));
    setSearch("");
  };

  useEffect(() => {
    searchResults.length !== 0 ? setToggleSearch(true) : setToggleSearch(false);
  }, [searchResults, toggleSearch]);

  // Fecha a lista de pesquisa e mostra a lista default
  const resetSearch = () => {
    setSearchResults([]);
    setToggleSearch(false);
    setShowTrackList(true);
    setShowFavoriteList(false);
  };

  // eslint-disable-next-line no-unused-vars
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

  // Metodo para enviar o dados para o redux
  const Add_fav = (e) => {
    dispatch({
      type: "ADD_FAV",
      newId: parseInt(e.currentTarget.getAttribute("value")),
      add_tracks: `https://api.deezer.com/track/${e.currentTarget.getAttribute(
        "value"
      )}`,
    });
  };

  // Metodo para remover os dados do redux
  const Del_fav = (e) => {
    dispatch({
      type: "DELETE_FAV",
      remove: parseInt(e.currentTarget.getAttribute("value")),
      remove_tracks: `https://api.deezer.com/track/${e.currentTarget.getAttribute(
        "value"
      )}`,
    });
  };

  // Gerencia o envio para o redux-store
  // eslint-disable-next-line no-array-constructor
  const handleFav = (e) => {
    favoriteList.includes(parseInt(e.currentTarget.getAttribute("value"))) &&
    trackLinks.includes(
      `https://api.deezer.com/track/${e.currentTarget.getAttribute("value")}`
    )
      ? Del_fav(e)
      : Add_fav(e);
  };

  // alterna entre somente mostrar a lista default e a lista de favoritos
  const toggleData = () => {
    if (showTrackList && favoriteList.length > 0) {
      setShowTrackList(false);
      setShowFavoriteList(true);
      setButtonValue("Voltar para playlist");
    }
    if (!showTrackList) {
      setShowTrackList(true);
      setShowFavoriteList(false);
      setButtonValue("Mostrar Favoritos");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <div className="search--box">
          <form onSubmit={handleInput}>
            <SearchIcon style={{ color: "#aaa" }} />
            <input
              type="text"
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <InfoBox>
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
          <div className="button--container">
            <div>
              {!toggleSearch && (
                <button className="buttons" onClick={toggleData}>
                  {buttonValue}
                </button>
              )}
              {toggleSearch && (
                <button className="buttons" onClick={resetSearch}>
                  Voltar
                </button>
              )}
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
                let artist = item.title;
                if (artist.length > 45) {
                  artist = artist.substring(0, 45) + "...";
                }
                return (
                  <>
                    <div key={item.id}>
                      <div
                        onMouseEnter={handleIconSwap}
                        onMouseLeave={(e) => {
                          if (!isPlayed) {
                            e.currentTarget.firstElementChild.innerHTML =
                              key + 1;
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
                          onClick={() => setMusicPlayed(item.preview)}
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
                            {artist}
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
                    </div>
                  </>
                );
              })}
            {showFavoriteList &&
              favoriteData.map((item, key) => {
                let artist = item.data.title;
                if (artist.length > 45) {
                  artist = artist.substring(0, 45) + "...";
                }
                return (
                  <>
                    <div key={item.data.id}>
                      <div
                        onMouseEnter={handleIconSwap}
                        onMouseLeave={(e) => {
                          if (!isPlayed) {
                            e.currentTarget.firstElementChild.innerHTML =
                              key + 1;
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
                          onClick={() => setMusicPlayed(item.data.preview)}
                        >
                          {key + 1}
                        </div>
                        <div className="favorite--icon">
                          <span
                            value={item.data.id}
                            onClick={(e) => handleFav(e)}
                          >
                            <FavoriteIcon style={{ color: "red" }} />
                          </span>
                        </div>
                        <div className="title--music">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={item.data.link}
                          >
                            {artist}
                          </a>
                        </div>
                        <div className="title--artist">
                          {item.data.artist.name}
                        </div>
                        <div className="title--album">
                          {item.data.album.title}
                        </div>
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
                    </div>
                  </>
                );
              })}

            {toggleSearch &&
              searchResults.map((item, key) => {
                return (
                  <>
                    <div key={item.id}>
                      <div
                        onMouseEnter={handleIconSwap}
                        onMouseLeave={(e) => {
                          if (!isPlayed) {
                            e.currentTarget.firstElementChild.innerHTML =
                              key + 1;
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
                          onClick={() => setMusicPlayed(item.preview)}
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
                    </div>
                  </>
                );
              })}
          </div>
        </ListContainer>
      </Container>
      <PlayerStyle>
        <MusicPlayer url_music={musicPlayed} />
      </PlayerStyle>
    </>
  );
};

export default List;
