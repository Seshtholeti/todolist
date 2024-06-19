import React, { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";
const WrappedView = () => {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const account = accounts[0];
    if (account) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: account,
        })
        .then((response) => {
          setAccessToken(response.accessToken);
        })
        .catch((error) => {
          console.error("Error acquiring token silently:", error);
        });
    }
  }, [instance, accounts]);
  const handleLoginPopup = () => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        setAccessToken(response.accessToken);
      })
      .catch((error) => {
        console.error("Login Popup Error:", error);
      });
  };
  return (
    <div className="App">
      <AuthenticatedTemplate>
        {accessToken ? (
          <div>
            <Header />
            <Dashboard />
            <Footer />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="welcome-container">
          <h1>Welcome to the Wallboard</h1>
          <p>Please click on the button below to sign in:</p>
          <button className="sign-in-button" onClick={handleLoginPopup}>
            Sign in
          </button>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};
const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <WrappedView />
    </MsalProvider>
  );
};
export default App;


this is my app.js


import React, { useState, useEffect } from "react";
function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const headerStyle = {
    color: "white",
    backgroundColor: "#800080",
    padding: "10px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    fontSize: "40px",
    justifyContent: "space-between",
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB"); // en-GB locale for 24-hour format
  };
  return (
    <div style={headerStyle}>
      <div style={{ paddingLeft: "60px", paddingBottom: "5px" }}>
        Reservation, Guest and Restaurant
      </div>
      <div style={{ paddingRight: "60px", paddingBottom: "5px" }}>
        {formatDate(currentTime)}&nbsp;&nbsp;{formatTime(currentTime)}
      </div>
    </div>
  );
}
export default Header;


this is my header.js'

please include the signout button in header beside the timestamp
