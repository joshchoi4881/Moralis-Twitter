import React from "react";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { Icon } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import "./Sidebar.css";

const Sidebar = () => {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();

  return (
    <>
      <div className="siderContent">
        <div className="menu">
          <div className="details">
            <Icon svg="twitter" size={33} fill="#fff" />
          </div>
          <Link to="/" className="link">
            <div className="menuItems">
              <Icon svg="list" size={33} fill="#fff" />
              Home
            </div>
          </Link>
          <Link to="/profile" className="link">
            <div className="menuItems">
              <Icon svg="user" size={33} fill="#fff" />
              Profile
            </div>
          </Link>
          <Link to="/settings" className="link">
            <div className="menuItems">
              <Icon svg="cog" size={33} fill="#fff" />
              Settings
            </div>
          </Link>
        </div>
        <div className="details">
          <img
            src={user.attributes.pfp ? user.attributes.pfp : defaultImgs[0]}
            className="profilePic"
          />
          <div className="profile">
            <div className="who">{user.attributes.username.slice(0, 6)}</div>
            <div className="accWhen">{`${user.attributes.ethAddress.slice(
              0,
              4
            )}...${user.attributes.ethAddress.slice(38)}`}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
