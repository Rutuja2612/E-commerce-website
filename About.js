import React from "react";
import "./about.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";

import { Link } from "react-router-dom";
const About = () => {
 
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="#"
              alt=""
            />
            <Typography>Rutuja Godge</Typography>
            <Button color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a E-commerce Website. 
             
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <Link
              to="#"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </Link>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;