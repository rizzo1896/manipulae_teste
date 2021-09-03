import React from "react";
import ReactDOMServer from "react-dom/server";

import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";

// import { Container } from './styles';

function Track(props) {
  const {
    favoriteList,
    item,
    isPlayed,
    index,
    setMusicPlayed,
    handleFav,
    handleIconSwap,
    artist,
  } = props.data;

  const reduceString = (elem) => {
    if (elem.length > 45) {
      return (elem = elem.substring(0, 43) + "...");
    } else {
      return elem;
    }
  };

  return (
    <>
      <div key={item.id}>
        <div
          onMouseEnter={handleIconSwap}
          onMouseLeave={(e) => {
            if (!isPlayed) {
              e.currentTarget.firstElementChild.innerHTML = index + 1;
            } else {
              e.currentTarget.firstElementChild.innerHTML =
                ReactDOMServer.renderToString(<PauseCircleOutlineIcon />);
            }
          }}
        >
          <div className="rank" onClick={() => setMusicPlayed(item.preview)}>
            {window.innerWidth <= 425 ? <PlayCircleOutlineIcon /> : index + 1}
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
              {reduceString(artist)}
            </a>
          </div>
          <div className="title--artist">{item.artist.name}</div>
          <div className="title--album">{item.album.title}</div>
          <div className="title--duration">
            {item.duration / 60 < 10
              ? "0" +
                (item.duration / 60).toFixed(2).toString().replace(".", ":")
              : (item.duration / 60).toFixed(2).toString().replace(".", ":")}
          </div>
        </div>
      </div>
    </>
  );
}

export default Track;
