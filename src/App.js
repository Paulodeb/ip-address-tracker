import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
import arrow from "./images/icon-arrow.svg";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import MapComponent from "./components/MapComponent";


function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [error, setError] = useState('');
 
 
  
  useEffect(() => {

    axios.get( `https://geo.ipify.org/api/v2/country,city?apiKey=at_BWuJ8I150EzWU3yJRjzyNqESBnri5&ipAddress=192.212.174.101`)
    .then(response => {
      setAddress(response?.data);
        setMarkerPosition([response?.data?.location?.lat, response?.data?.location?.lng]);
        // console.log(response?.data);
       })
      .catch(error => {
        setError(error);
        console.log(error);
      }
      )
    }, []);
    
   
   

  const inputRef = useRef(null);

  const getEnteredIp = async (address) => {
    address = inputRef.current.value.trim();
   
    // check if input is a domain name

    const isDomainName = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/i.test(ipAddress);

    // const isDomainName = address.match(/^\d+\.\d+\.\d+\.\d+$/);
    // (/[a-z]+\.[a-z]+/i);

    //check if input is an IP address
    const isIpAddress = address.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$|^([a-f0-9:]+:+)+[a-f0-9]{1,4}$/i);

  
    if( isDomainName ){
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_BWuJ8I150EzWU3yJRjzyNqESBnri5&${
          isDomainName ? `domain=${ipAddress}` :
          ''
        }`
        )
        const data = await res.json();
        setAddress(data);
        
        if (data.location) {
          const { lat, lng } = data.location;
          setMarkerPosition([lat, lng]);
          setAddress(data);
        }  
      
} else if( isIpAddress){
      // if input is a domain name, get the IP address using a DNS lookup API
      const dnsResponse = await fetch(`https://api.ipify.org?format=json&domain=${ipAddress}`);
      address = await dnsResponse?.data?.ip;
      // make API call to get geolocation data
      const { data } = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_BWuJ8I150EzWU3yJRjzyNqESBnri5&ipAddress=${ipAddress}`);
      
        if (data.location) {
          const { lat, lng } = data.location;
          setMarkerPosition([lat, lng]);
          setAddress(data);
        }  
    } else if ( ipAddress !== isDomainName || isIpAddress){
      // if input is not a domain name or IP address, return error
      setError('Please enter a valid IP address or domain name');
      return;
    } 
  
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredIp(ipAddress);
    setIpAddress("");
    
    setTimeout(() => {
      setError('');
    }, 3000);
    
  };

  return (
    <>
      <div className="container">
        <div className="background">
        
        </div>

        <div className="ip-tracker">
          <h1>IP Address Tracker</h1>
          <form onSubmit={handleSubmit} autoComplete="off"
          >
            <div className="input">
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              ref={inputRef}
              placeholder="Search for any IP address or domain"
              required
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              />
            <button type="submit">
              <img src={arrow} alt="" />
            </button>
              </div>
            {error && <div>
            <p className="error">{error}</p>
            
            </div>}
          </form>
        </div>

        {address && (
          <>
            <div className="card">
              <div className="card-items">
                <div className="item1">
                  <h2>IP ADDRESS</h2>
                  <p>{address?.ip}</p>
                </div>
                <div className="item2">
                  <h2>LOCATION</h2>
                  <p>
                  {address?.location?.city}, {address?.location?.region} 
                  </p>
                </div>
                <div className="item3">
                  <h2>TIMEZONE</h2>
                  <p>UTC {address?.location?.timezone}</p>
                </div>
                <div className="item4">
                  <h2>ISP</h2>
                  <p>{address?.isp}</p>
                </div>
              </div>
            </div>
            <MapContainer
              className="map"
              center={markerPosition}
              zoom={13}
              scrollWheelZoom={true}
              >
              {/* <MapComponent ipData={address?.location}/> */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* <Marker icon={iconLocation} position={markerPosition}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker> */}
              <MapComponent location={markerPosition} />
            </MapContainer>
          </>
        )}
      </div>
    </>
  );
}

export default App;
