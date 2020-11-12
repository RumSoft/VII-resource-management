import React, { Component } from "react";
import { Link } from "react-router-dom";
import bgmovie from "./resmgr.mp4";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>home</h1>
        <p>logo tutaj</p>
        <Link to="/dashboard">przejdź do programu</Link>
        <p>info o programie</p>
        <video autoPlay controls>
          <source src={bgmovie} type="video/mp4" />
        </video>
      </div>
    );
  }
}
