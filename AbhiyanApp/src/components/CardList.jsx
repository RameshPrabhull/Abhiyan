import { useState } from "react";
const Card = ({ title, schemeLink, link }) => {
    return (
      <div className="col">
        <div className="card border-red mb-3 h-100" style={{ maxWidth: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{title ? title : "Loading.."}</h5>
            <p><a href={schemeLink} target="_blank" className="card-text">View PDF file</a></p>
            <a href={link}>Chat to Know More</a>
          </div>
        </div>
      </div>
    );
  };
  
  const CardList = ({schemes}) => {
    //console.log(schemes["scheme1"]["scheme_name"])
    const cardData = [
       {
        title: schemes["scheme1"]["scheme_name"],
        schemeLink:schemes["scheme1"]["scheme_link"],
        link: "../pages/Chatbot.js",
      },
      {
        title: schemes["scheme2"]["scheme_name"],
        schemeLink:schemes["scheme2"]["scheme_link"],
        link: "../pages/Chatbot.js",
      },
      {
        title: schemes["scheme3"]["scheme_name"],
        schemeLink:schemes["scheme3"]["scheme_link"],
        link: "../pages/Chatbot.js",
      },
      {
        title: schemes["scheme4"]["scheme_name"],
        schemeLink:schemes["scheme4"]["scheme_link"],
        link: "../pages/Chatbot.js",
      },
      {
        title: schemes["scheme5"]["scheme_name"],
        schemeLink:schemes["scheme5"]["scheme_link"],
        link: "../pages/Chatbot.js",
      },
    ];

  
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4" style={{backgroundColor:"wheat"}}>
        {cardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    );
  };
export default CardList;