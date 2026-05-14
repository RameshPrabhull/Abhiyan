import React from "react";
import "../css/bootstrap.css";
import "../css/font-awesome.min.css";
import "../css/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const ClientSection = () => {
  return (
    <section className="client_section layout_padding">
      <div className="container col-md-12">
        <div className="heading_container heading_center">
          <h2>How to Reach Abhiyan AI?</h2>
        </div>
      </div>
      <div id="customCarousel2" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className="row">
                <div className="col-md-10 mx-auto">
                  <div className="box">
                    <div className="img-box">
                      <img src="../images/client.webp" alt="Step 1" />
                    </div>
                    <div className="detail-box">
                      <div className="client_info">
                        <div className="client_name">
                          <h5>Step 1:</h5>
                          <h6>
                            <b>Login to your account</b>
                          </h6>
                        </div>
                        <i className="fa fa-quote-left" aria-hidden="true"></i>
                      </div>
                      <p>
                        Login with your username and password if already signed
                        in. Else Sign in yourself with the link in the home
                        page.
                      </p>
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
                  <div className="box">
                    <div className="img-box">
                      <img src="../images/client.webp" alt="Step 2" />
                    </div>
                    <div className="detail-box">
                      <div className="client_info">
                        <div className="client_name">
                          <h5>Step 2:</h5>
                          <h6>
                            <b>Add your Details for Personalized
                            Recommendations</b>
                          </h6>
                        </div>
                        <i className="fa fa-quote-left" aria-hidden="true"></i>
                      </div>
                      <p>
                        Once logged in, Abhiyan will ask for your details such
                        as age, income, occupation, and location. On
                        submission, we provide recommendations on government
                        schemes.
                      </p>
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
                  <div className="box">
                    <div className="img-box">
                      <img src="../images/client.webp" alt="Step 3" />
                    </div>
                    <div className="detail-box">
                      <div className="client_info">
                        <div className="client_name">
                          <h5>Step 3:</h5>
                          <h6>
                            <b>Interact with our AI chatbot for more details</b>
                          </h6>
                        </div>
                        <i className="fa fa-quote-left" aria-hidden="true"></i>
                      </div>
                      <p>
                        Click on the recommended schemes or search for any. Your
                        Abhiyan Information Assistant will help resolve your
                        queries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ol className="carousel-indicators">
          <li data-bs-target="#customCarousel2" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#customCarousel2" data-bs-slide-to="1"></li>
          <li data-bs-target="#customCarousel2" data-bs-slide-to="2"></li>
        </ol>
      </div>
    </section>
  );
};

export default ClientSection;
