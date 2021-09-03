import React from "react";

function HeaderPlaylist() {
  return (
    <>
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
    </>
  );
}

export default HeaderPlaylist;
