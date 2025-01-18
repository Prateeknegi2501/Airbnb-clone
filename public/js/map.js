
mapboxgl.accessToken=mapToken;
const map = new mapboxgl.Map({
    container: 'map', // HTML element ID
    style: 'mapbox://styles/mapbox/streets-v12', // Correct style
    center: coordinates, // Map center [lng, lat]
    zoom: 9,
  });
  
  console.log(coordinates)
  const marker = new mapboxgl.Marker({color:"Red"})
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 2})
    .setHTML(`<h1>${listing.location}</h1><p>Exact location provided after booking`))
  .addTo(map);