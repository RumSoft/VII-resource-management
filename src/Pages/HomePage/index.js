import React, { Component } from "react";
import { Link } from "react-router-dom";
import bgmovie from "./resmgr.mp4";
import "./index.scss";

export default class HomePage extends Component {
  render() {
    return (
      <div className="home-page">
        <h1>home</h1>
        <p>logo tutaj</p>
        <Link to="/dashboard">przejdź do programu</Link>
        <p>info o programie</p>
        <div className="background-video-container">
          <video autoPlay muted>
            <source src={bgmovie} type="video/mp4" />
          </video>
          <div className="gridbg"></div>
        </div>
      </div>
    );
  }
}
