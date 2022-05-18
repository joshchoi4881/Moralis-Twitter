import React from "react";
import { Routes, Route } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { ConnectButton, Icon } from "web3uikit";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import "./styles/App.css";

const App = () => {
  const { isAuthenticated, Moralis } = useMoralis();

  return (
    <>
      {isAuthenticated ? (
        <div className="page">
          <div className="sideBar">
            <Sidebar />
            <div
              className="logout"
              onClick={() => {
                Moralis.User.logOut().then(() => {
                  window.location.reload();
                });
              }}
            >
              Logout
            </div>
          </div>
          <div className="mainWindow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
          <div className="rightBar">
            <Rightbar />
          </div>
        </div>
      ) : (
        <>
          <div className="loginPage">
            <Icon svg="twitter" size={40} fill="#fff" />
            <ConnectButton />
          </div>
        </>
      )}
    </>
  );
};

export default App;
