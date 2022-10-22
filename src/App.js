import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Map, TileLayer } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

import nationalParks from './national-parks.json';
import belenes from './belenes-2021.json';

delete L.Icon.Default.prototype._getIconUrl;

// Importing images from locally stored assets to address a bug
// in CodeSandbox: https://github.com/codesandbox/codesandbox-client/issues/3845

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./images/marker-icon-2x.png'),
  iconUrl: require('./images/marker-icon.png'),
  shadowUrl: require('./images/marker-shadow.png')
});

// When importing into your own app outside of CodeSandbox, you can import directly
// from the leaflet package like below
//
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef();
  const [belenesData, setBelenesData] = useState(null);

  useEffect(() => {
     fetch("https://datosabiertos.malaga.eu/recursos/alcaldia/belenes2021/da_belenes2021-4326.geojson")
      .then((response) => response.json())
      .then((belenes) => {  
        console.log(belenes)
        setBelenesData(belenes.features);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    if ( !map ) return;

    const parksGeoJson = new L.GeoJSON(belenesData, {
      onEachFeature: (feature = {}, layer) => {
        const { properties = {} } = feature;
        const { belen } = properties;

        if ( !belen ) return;

        layer.bindPopup(`<p>${belen}</p>`);
      }
    });

    parksGeoJson.addTo(map);
  })

  if (isLoading) { // ⬅️ si está cargando, mostramos un texto que lo indique
    return (
      <div className="App">
        <h1>Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <Map ref={mapRef} center={[ 36.7268, -4.4361]} zoom={13}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
      </Map>
    </div>
  );
}

export default App;
