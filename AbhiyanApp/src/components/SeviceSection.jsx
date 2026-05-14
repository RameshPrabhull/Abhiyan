import React from "react";

function ServiceSection() {
  const services = [
    {
      img: "/images/s1.png",
      title: "Scheme Information Retrieval",
      description: "Provide detailed information about specific government schemes..."
    },
    {
      img: "/images/s2.png",
      title: "Personalized Scheme Recommendations",
      description: "Suggest relevant government schemes tailored to the user's demographic details..."
    },
    {
      img: "/images/s3.png",
      title: "Interactive Q&A",
      description: "Answer user queries related to government schemes in a conversational format..."
    },
    {
      img: "/images/s4.png",
      title: "Application Guidance",
      description: "Offer step-by-step assistance for applying to government schemes..."
    }
  ];

  return (
    <section className="service_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Services</h2>
          <p>Abhiyan offers the following services:</p>
        </div>
        <div className="row">
          {services.map((service, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="box">
                <div className="img-box"><img src={service.img} alt={service.title} /></div>
                <div className="detail-box">
                  <h5>{service.title}</h5>
                  <p>{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;
