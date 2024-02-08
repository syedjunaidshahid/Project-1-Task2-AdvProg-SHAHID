require([
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/Graphic',
  'esri/widgets/Popup'
], function(Map, MapView, FeatureLayer, Graphic, Popup) {

  var map = new Map({
    basemap: 'streets'
  });

  var view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-90.1994, 38.627],
    zoom: 12
  });

  var neighborhoodsLayer = new FeatureLayer({
    portalItem: {
      id: 'a5ed4c7b8815449eb762e27890dd0b4a'
    },
    opacity: 0.3,
    title: 'St Louis Neighborhoods'
  });

  map.add(neighborhoodsLayer);

  var crimePointsLayer = new FeatureLayer({
    portalItem: {
      id: '128a8e3adc27445c9fa4a16497c6afe7'
    },
    title: 'Crime Points',
    popupTemplate: {
      title: '<b>{crimeType}</b>',
      content: 'Date: {date}<br>{details}'
    }
  });

  map.add(crimePointsLayer);

  var crimeIncidents = [];

  var isReportingCrime = false; // Flag to control crime reporting mode

  function addCrimeIncident(lat, lon, date, crimeType, details) {
    var point = {
      type: 'point',
      longitude: lon,
      latitude: lat
    };

    var pointGraphic = new Graphic({
      geometry: point,
      symbol: {
        type: 'simple-marker',
        color: '#ff0000',
        size: 8
      },
      attributes: {
        crimeType: crimeType,
        date: date,
        details: details
      },
      popupTemplate: {
        title: '<b>{crimeType}</b>',
        content: 'Date: {date}<br>{details}'
      }
    });

    view.graphics.add(pointGraphic);
    crimeIncidents.push({ lat, lon, date, crimeType, details });
  }

  document.getElementById('addCrimeButton').addEventListener('click', function () {
    alert('Click on the map to report a crime incident.');
    isReportingCrime = true; // Enable reporting mode
  });

  view.on('click', function (event) {
    if (isReportingCrime) {
      var date = prompt('Enter date (YYYY-MM-DD):');
      var crimeType = prompt('Enter crime type:');
      var details = prompt('Enter additional details:');

      if (date && crimeType && details) {
        addCrimeIncident(event.mapPoint.latitude, event.mapPoint.longitude, date, crimeType, details);
        isReportingCrime = false; // Reset the flag after reporting a crime
      } else {
        alert('Invalid input. Crime incident not reported.');
      }
    }
  });
});
