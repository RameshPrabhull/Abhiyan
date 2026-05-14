import React from "react";

function AboutSection() {
  return (
    <section className="about_section">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="detail-box">
              <div className="heading_container"><h2>About Us</h2></div>
              <p>
                Abhiyan is an AI-powered chatbot developed to streamline access
                to government schemes, especially for rural users who may lack technical knowledge...
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="img-box"><img src="/images/about-img.jpg" alt="About Us" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
