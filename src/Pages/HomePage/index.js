import React, { Component } from "react";
import { Link } from "react-router-dom";
import bgmovie1 from "./resmgr.mp4";
import bgmovie2 from "./resmgr2.mp4";
import bgmovie3 from "./resmgr3.mp4";
import "./index.scss";
import Title from "../Title";

export default class HomePage extends Component {
  render() {
    const bgmovies = [bgmovie1, bgmovie2, bgmovie3];
    const i = Math.floor(Math.random() * bgmovies.length);
    const movie = bgmovies[i];

    return (
      <>
        <Title>Strona główna</Title>
        <div className="home-page">
          <h1>home</h1>
          <p>logo tutaj</p>
          <Link to="/dashboard">przejdź do programu</Link>
          <p>info o programie</p>
          <div className="background-video-container">
            <video autoPlay muted>
              <source src={movie} type="video/mp4" />
            </video>
            <div className="gridbg"></div>
          </div>
        </div>
      </>
    );
  }
}
