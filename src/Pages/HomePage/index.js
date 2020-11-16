import React, { Component } from "react";
import { Link } from "react-router-dom";
import bgmovie1 from "./resmgr.mp4";
import bgmovie2 from "./resmgr2.mp4";
import bgmovie3 from "./resmgr3.mp4";
import "./index.scss";
import Title from "../Title";
import { Image } from 'semantic-ui-react'
import enderchest from "../../enderchest2.png"

export default class HomePage extends Component {
  render() {
    const bgmovies = [bgmovie1, bgmovie2, bgmovie3];
    const i = Math.floor(Math.random() * bgmovies.length);
    const movie = bgmovies[i];

    return (
      <>
        <Title>Strona główna</Title>
        <div className="home-page">
          <Image className="home-image" src={enderchest} size='small' centered></Image>
          <div >
            <h1 className="home-header">RumSoft's Resource Manager</h1>
          </div>
          <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="home-text">
              <b>Kliknij</b>, aby kontynuować
            </div>
          </Link>

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
