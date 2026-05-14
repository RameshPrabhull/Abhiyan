import React from "react";
import "../css/bootstrap.css";
import "../css/style.css";

const ContactSection = () => {
  return (
    <section className="contact_section layout_padding-bottom">
      <div className="container-fluid">
        <div className="col-lg-4 col-md-5 offset-md-1">
          <div className="heading_container">
            <h2>Contact Us</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-5 offset-md-1">
            <div className="form_container">
              <form>
                <div>
                  <input type="text" placeholder="Your Name" />
                </div>
                <div>
                  <input type="text" placeholder="Phone Number" />
                </div>
                <div>
                  <input type="email" placeholder="Email" />
                </div>
                <div>
                  <input
                    type="text"
                    className="message-box"
                    placeholder="Message"
                  />
                </div>
                <div className="btn_box">
                  <button type="submit">SEND</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="img-box">
              <img src="/images/contact.jpg" alt="Contact Us" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
