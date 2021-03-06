import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  ListContainer,
  PlayerStyle,
  InfoBox,
  LoadingScene,
} from "./style.jsx";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SearchIcon from "@material-ui/icons/Search";
import MusicPlayer from "../MusicPlayer/index";
import Track from "../Track/index.js";
import HeaderPlaylist from "../HeaderPlaylist/index.js";

const List = () => {
  const [isLoading, setLoading] = useState(true);
  const [valueList, setValueList] = useState(10);
  const [searchList, setSearchList] = useState(10);

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
  let chartPlaylist = `https://my-projects-rizzo.herokuapp.com/api/${valueList}`;

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

  // Requisição da lista de favoritos
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

  useEffect(() => {
    const activateInfiniteScroll = () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          setValueList(valueList + 20);
        }
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          setSearchList(searchList + 20);
        }
      };
    };
    activateInfiniteScroll();
  }, [valueList, searchList]);

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
    return (
      <>
        <LoadingScene>
          <span></span>
        </LoadingScene>
      </>
    );
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
          <HeaderPlaylist />

          <div className="bodyList">
            {showTrackList &&
              trackList.map((item, index) => {
                let artist = item.title;
                return (
                  <div key={index}>
                    <Track
                      data={{
                        favoriteList,
                        item,
                        isPlayed,
                        index,
                        setMusicPlayed,
                        handleFav,
                        handleIconSwap,
                        artist,
                      }}
                    />
                  </div>
                );
              })}
            {showFavoriteList &&
              favoriteData.map((item, index) => {
                let artist = item.data.title;
                item = item.data;
                return (
                  <div key={index}>
                    <Track
                      data={{
                        favoriteList,
                        item,
                        isPlayed,
                        index,
                        setMusicPlayed,
                        handleFav,
                        handleIconSwap,
                        artist,
                      }}
                    />
                  </div>
                );
              })}

            {toggleSearch &&
              searchResults.map((item, index) => {
                let artist = item.title;
                return (
                  <div key={index}>
                    <Track
                      data={{
                        favoriteList,
                        item,
                        isPlayed,
                        index,
                        setMusicPlayed,
                        handleFav,
                        handleIconSwap,
                        artist,
                      }}
                    />
                  </div>
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
