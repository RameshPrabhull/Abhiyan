import React from "react";
import Navbar from "../components/Navbar";
import SliderIndex from "../components/SliderIndex";
import ServiceSection from "../components/SeviceSection";
import AboutSection from "../components/AboutSection";
import ClientSection from "../components/ClientSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import "../css/style.css";
import "../css/bootstrap.css";
import "../css/responsive.css";
import "../css/font-awesome.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Home() {
  return (
    <div className="App" style={{backgroundColor:"wheat"}}>
      <Navbar />
      <SliderIndex />
      <ServiceSection />
      <AboutSection />
      <ClientSection />
      <br/><br/>
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Home;
