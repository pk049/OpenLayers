import React, { useRef, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { FaMicrophone } from 'react-icons/fa';
import './map.css';
import "./options.css";

const libraries = ["places"];
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const MapComponent = () => {
  const mapStyles = {
    height: "80vh",
    width: "90%",
    marginTop: "3.1rem",
    margin: "0 auto",
    border: "0px solid black",
    borderRadius: "20px",
    outline: "none",
  };

  const defaultCenter = {
    lat: -34.397,
    lng: 150.644
  };

  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [zoom, setZoom] = useState(4);
  const [isListening, setIsListening] = useState(false);
  const searchBoxRef = useRef(null);

  const onLoad = ref => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setSelectedPlace(location);
      if (map) {
        map.panTo(location);
        if (zoom < 13) {
          setZoom(prevZoom => prevZoom + 3);
          setTimeout(() => {
            setZoom(prevZoom => prevZoom + 3);
          }, 500);
          setTimeout(() => {
            setZoom(prevZoom => prevZoom + 3);
          }, 1000);
        }
      }
    }
  };

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const moveToLocation = async (placeName) => {
    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch({ query: placeName }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        setSelectedPlace(location);
        map.panTo(location);
        if (zoom < 13) {
          setZoom(prevZoom => prevZoom + 3);
          setTimeout(() => {
            setZoom(prevZoom => prevZoom + 3);
          }, 500);
          setTimeout(() => {
            setZoom(prevZoom => prevZoom + 3);
          }, 1000);
        }
      }
    });
  };

  const handleVoiceCommand = async (transcript) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: transcript }),  // Adjusted key to 'sentence'
      });
      const data = await response.json();
      const { category_no, location } = data;  // Adjusted keys to match Flask response
      console.log(category_no);
      console.log(location);
  
      switch (category_no) {
        case '1':
          setZoom(prevZoom => prevZoom + 3);
          break;
        case '2':
          setZoom(prevZoom => Math.max(prevZoom - 2, 0)); // Ensure zoom doesn't go negative
          break;
        case '3':
          if (map) {
            map.panBy(-100, 0); // Move map slightly to the left
          }
          break;
        case '4':
          if (map) {
            map.panBy(100, 0); // Move map slightly to the right
          }
          break;
        case '5':
          if (location) {
            moveToLocation(location);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Recognized speech:", transcript);
    handleVoiceCommand(transcript);
  };

  recognition.onerror = event => {
    console.error("Error occurred in speech recognition:", event.error);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDyMQxTB0q8cM8d1lpkKAuamIZVG018aVQ" libraries={libraries}>
      <div className="options" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div className='option' onClick={handleListen}><FaMicrophone /></div>
      </div>
      <GoogleMap
        mapContainerClassName='outer'
        tabIndex="0"
        mapContainerStyle={mapStyles}
        zoom={zoom}
        center={selectedPlace || defaultCenter}
        onLoad={onMapLoad}
      >
        
        {selectedPlace && <Marker position={selectedPlace} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
