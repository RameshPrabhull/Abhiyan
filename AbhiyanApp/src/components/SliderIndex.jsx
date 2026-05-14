import React from "react";
import "../css/bootstrap.css";
import '../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

function SliderIndex() {
  return (
    <section className="slider_section">
      <div id="customCarousel1" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className="row">
                <div className="col-md-10 mx-auto">
                  <div className="detail-box">
                    <h1><b>ABHIYAN</b></h1>
                    <div className="btn-box">
                      <Link to="/pages/Registration.jsx" className="btn1">SignIn</Link>
                      <Link to="/pages/Registration.jsx" className="btn2">LogIn</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Add other carousel items here */}
          <div className="carousel-item">
            <div className="container">
            <div className="row">
                <div className="col-md-10 mx-auto">
                  <div className="detail-box"><br/>
                  <h2>Your Information Assistant</h2>
                    <div className="btn-box">
                       <Link to="/pages/Registration.jsx" className="btn1">SignIn</Link>
                      <Link to="/pages/Registration.jsx" className="btn2">LogIn</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
            <div className="row">
                <div className="col-md-10 mx-auto">
                  <div className="detail-box"><br/>
                  <h2>We recommend, You Choose</h2>
                    <div className="btn-box">
                       <Link to="/pages/Registration.jsx" className="btn1">SignIn</Link>
                      <Link to="/pages/Registration.jsx" className="btn2">LogIn</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ol className="carousel-indicators">
          <li data-bs-target="#customCarousel1" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#customCarousel1" data-bs-slide-to="1"></li>
          <li data-bs-target="#customCarousel1" data-bs-slide-to="2"></li>
        </ol>
      </div>
    </section>
  );
}


export default SliderIndex;
