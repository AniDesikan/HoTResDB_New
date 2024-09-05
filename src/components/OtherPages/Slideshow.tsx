// import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import IntroText from "./IntroText";

const Slideshow: React.FC = () => {
  const slides = [
    // { src: "./image015.png", citation: "", link: "" },
    // { src: "./image014.png", citation: "", link: "" },
    // {
    //   src: "./image013.jpg",
    //   citation: "Ebolavirus Ecology. Credit: CDC | ",
    //   link: "http://www.cdc.gov/vhf/ebola/resources/virus-ecology.html",
    // },
    {
      src: "./ebola-virus-particles_14858655274_o.jpg",
      citation:
        "Electron micrograph image of Ebola virus particles. Credit: NIAID | ",
      link: "https://www.flickr.com/photos/niaid/14858655274",
    },
    {
      src: "./ebola-virus-particles_14739204679_o.jpg",
      citation:
        "Electron micrograph image of filamentous Ebola virus particles. Credit: NIAID | ",
      link: "https://www.flickr.com/photos/niaid/14739204679",
    },
    {
      src: "./ebola-virus-particles_14674502048_o.jpg",
      citation:
        "Electron micrograph image of filamentous Ebola virus particles. Credit: NIAID | ",
      link: "https://www.flickr.com/photos/niaid/14674502048",
    },
    {
      src: "./ebola-virus_14712446017_o.jpg",
      citation: "Electron micrograph image of Ebola virus. Credit: NIAID | ",
      link: "https://www.flickr.com/photos/niaid/14712446017",
    },
    {
      src: "./ebola-virus_14712255469_o.jpg",
      citation: "Electron micrograph image of Ebola virus. Credit: NIAID | ",
      link: "https://www.flickr.com/photos/niaid/14712255469",
    },
    // add more slides here
  ];
  return (
    <div id="fullintro">
      <div id="CarouselContainer">
        <Carousel>
          {slides.map((slide, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={slide.src}
                alt={slide.citation}
              />
              <Carousel.Caption>
                <h3>{slide.citation}</h3>
                <p>{slide.link}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <IntroText />
    </div>
  );
};

export default Slideshow;
