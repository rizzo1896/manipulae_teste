import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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

  const dispatch = useDispatch();
  // let chart = `https://api.deezer.com/chart/0`;
  let chartPlaylist = `https://api.deezer.com/playlist/1111141961?&limit=${valueList}`;
  // let chartURL = `https://api.deezer.com/chart/0/tracks?&limit=${valueList}`;

  // useEffect(() => {
  //   axios.get(chart).then((res) => {
  //     console.log(res.data, "chart");
  //   });
  // }, []);

  // useEffect(() => {
  //   axios.get(chartURL).then((res) => {
  //     console.log(res.data, 'musicas');
  //     setTrackList(res.data.data);
  //     setLoading(false);
  //   });
  // }, [valueList]);

  useEffect(() => {
    axios.get(chartPlaylist).then((res) => {
      console.log(res.data, "album");
      setDataList(res.data);
      setTrackList(res.data.tracks.data);
      setBannerAlbum(res.data.picture_medium);
      setCreatedBy(res.data.creator.name);
      // Ao terminar a requisição dos dados, mostra os componentes
      setLoading(false);
    });
  }, [chartPlaylist]);

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

  const favoriteList = useSelector(
    (state) => state.FavoriteListReducer.favorites
  );

  const Add_fav = (e) => {
    dispatch({
      type: "ADD_FAV",
      newId: e.currentTarget.getAttribute("value"),
    });
    e.currentTarget.firstElementChild.innerHTML = ReactDOMServer.renderToString(
      favoriteList.includes(e.currentTarget.getAttribute("value")) ? (
        ""
      ) : (
        <FavoriteIcon style={{ color: "red" }} />
      )
    );
  };

  const Del_fav = (e) => {
    dispatch({
      type: "DELETE_FAV",
      remove: e.currentTarget.getAttribute("value"),
    });
    e.currentTarget.firstElementChild.innerHTML = ReactDOMServer.renderToString(
      favoriteList.includes(e.currentTarget.getAttribute("value")) ? (
        ""
      ) : (
        <FavoriteBorderIcon fontSize={"inherit"} />
      )
    );
  };

  // eslint-disable-next-line no-array-constructor
  const handleFav = (e) => {
    favoriteList.includes(e.currentTarget.getAttribute("value"))
      ? Del_fav(e)
      : Add_fav(e);

    // e.currentTarget.firstElementChild.innerHTML = ReactDOMServer.renderToString(
    //   favoriteList.includes(e.currentTarget.getAttribute("value")) ? (
    //     <FavoriteIcon style={{ color: "red" }} />
    //   ) : (
    //     <FavoriteBorderIcon fontSize={"inherit"} />
    //   )
    // );
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
        Adicionar
      </button>
      <br />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
          {trackList.map((item, key) => {
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
                      <FavoriteBorderIcon fontSize={"inherit"} />
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
        </div>
        {/* <ReactAudioPlayer
          className="audio--player"
          controls
          src="https://cdns-preview-7.dzcdn.net/stream/c-70255a40b7c438c3239e94ba0c909128-3.mp3"
        /> */}
      </ListContainer>
      <PlayerStyle>
        <MusicPlayer url_music={musicPlayed} />
      </PlayerStyle>
    </>
  );
};

export default List;

// const mapStateToProps = (state) => {
//   return {
//     favoriteList: state.FavoriteListReducer.favorite,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addFav: (nemValue) =>
//       dispatch({
//         type: "ADD_FAV",
//         payload: { favorite: nemValue },
//       }),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(List);
