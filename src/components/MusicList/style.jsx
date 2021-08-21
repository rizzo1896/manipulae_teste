import styled from "styled-components";

export const InfoBox = styled.div`
  width: 900px;
  margin: 0 auto;
  margin-bottom: 80px;
  .content {
    display: flex;
    img {
      width: 200px;
      height: 200px;
    }
    .Info--desc {
      padding-left: 30px;
      h1 {
        font-size: 32px;
        font-family: Deezer, Arial, sans-serif;
        font-weight: 700;
      }
      div {
        font-family: Deezer, Arial, sans-serif;
        font-size: 15px;
        span {
          color: #ccc;
          font-size: 13px;
        }
      }
    }
  }
`;

export const ListContainer = styled.div`
  font-size: 14px;
  font-weight: 400;
  font-family: Open Sans, Arial, sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 900px;
  max-width: 1600px;
  margin: auto;
  margin-bottom: 55px;
  .headerList {
    color: #72727d;
    min-width: inherit;
    max-width: inherit;
    height: 52px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    .rank {
      width: 40px;
      text-align: center;
    }
    .title--music {
      width: 300px;
      margin-left: 40px;
    }
  }

  .bodyList {
    min-width: inherit;
    max-width: inherit;
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 52px;
      border-bottom: 1px solid #ccc;
    }
    div:hover {
      background-color: #f4f4f4;
      transition: all ease 0.3s;
    }
    .rank {
      width: 40px;
      justify-content: center;
      cursor: pointer;
    }
    .favorite--icon {
      span {
        padding-right: 20px;
        svg {
          font-size: 20px;
          color: #ccc;
          cursor: pointer;
        }
        svg:hover {
          border-radius: 20px;
          color: red;
          background-color: #fff;
        }
      }
    }
  }
  .headerList,
  .bodyList {
    .title--music {
      min-width: 300px;
      max-width: 580px;
      a,
      a:visited,
      a:active {
        color: #000;
        text-decoration: none;
      }
      a:hover {
        transition: all ease 0.2s;
        color: #ca2a36;
      }
    }
    .title--artist {
      width: 220px;
    }
    .title--album {
      width: 220px;
    }
    .title--duration {
      width: 50px;
    }
  }
`;

export const PlayerStyle = styled.div`
  display: flex;
  justify-content: center;
  min-width: 900px;
  max-width: 1600px;
  margin: auto;
`;
