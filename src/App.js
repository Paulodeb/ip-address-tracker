import React, { useEffect, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
import background from "./images/pattern-bg-desktop.png";
import background2 from "./images/pattern-bg-mobile.png";
import arrow from "./images/icon-arrow.svg";
import "leaflet/dist/leaflet.css";
import MarkerPosition from "./components/Makerposition";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState(" ");

  const API_KEY = process.env.REACT_APP_API_KEY;

  const checkIp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getIp = async () => {
        const response = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_DKdEoPwaPYxxkGFr9yvlKcRjV5uDM&ipAddress=192.212.174.101`
        );
        const data = await response.json();
        setAddress(data);
      };
      getIp();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getEnteredIp = async () => {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_DKdEoPwaPYxxkGFr9yvlKcRjV5uDM&ipAddress=${
        checkIp.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await response.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredIp();
    setIpAddress("");
  };

  return (
    <>
      <div className="container">
        <div className="background">
          <img src={background} className='back1' alt="pattern" />
          <img className="back2" src={background2} alt="pattern" />
        </div>

        <div className="ip-tracker">
          <h1>IP Address Tracker</h1>
          <form onSubmit={handleSubmit} autoComplete="off" className="input">
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any IP address or domain"
              required
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button type="submit">
              <img src={arrow} alt="" />
            </button>
          </form>
        </div>

        {address && (
          <>
            <div className="card">
              <div className="card-items">
                <div className="item1">
                  <h2>IP ADDRESS</h2>
                  <p>{address.ip}</p>
                </div>
                <div className="item1">
                  <h2>LOCATION</h2>
                  <p>
                  {address.location.city}, {address.location.region} 
                  </p>
                </div>
                <div className="item1">
                  <h2>TIMEZONE</h2>
                  <p>UTC - {address.location.timezone}</p>
                </div>
                <div className="item2">
                  <h2>ISP</h2>
                  <p>{address.isp}</p>
                </div>
              </div>
            </div>
            <MapContainer
              className="map"
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition address={address} />
            </MapContainer>
          </>
        )}
      </div>
    </>
  );
}

export default App;
