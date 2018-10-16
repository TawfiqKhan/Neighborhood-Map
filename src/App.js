import React, { Component } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allPlaces: [],
      allMarkers: [],
      places: [],
      markers: []
    };

    this.initMap = this.initMap.bind(this);
  }

  // This is the function filyters our location and associated marker as per the user query in search field.

  filterPlace = query => {
    let listofPlaces;
    let listofMarkers;

    this.state.markers.map(marker => marker.setVisible(true));
    if (query) {
      listofPlaces = this.state.places.filter(place =>
        place.venue.name.toLowerCase().includes(query.toLowerCase())
      );
      this.setState({
        places: listofPlaces
      });

      listofMarkers = this.state.markers.filter(marker =>
        listofPlaces.every(place => place.venue.name !== marker.title)
      );

      listofMarkers.forEach(marker => marker.setVisible(false));
    } else {
      this.setState({ places: this.state.allPlaces });
      this.setState({ markers: this.state.allMarkers });
    }
  };

  componentDidMount() {
    this.getVenues();
  }

  loadMap = () => {
    mapLoader(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDpBtae0doKgYZ4NXZucWZnNNGpdU1HV6M&v=3&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  // the function that gets data from foursquare using the apy and query food.

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "HPEPLXJ4YXGSNB2P2MJOY3WM2D0SJX1JRIMUWTPMTOCH34IX",
      client_secret: "QTXHBFDY3ULSLB511BVEGUO3UZ54XDXZIUE4XWEDVZYLQYSB",
      query: "food",
      ll: "23.8103,90.4125",
      v: "20181808",
      limit: 10
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState(
          {
            //response data is saved in two state, one for regular use and another for resetting purpose.
            allPlaces: response.data.response.groups[0].items,
            places: response.data.response.groups[0].items
          },
          this.loadMap()
        );
      })
      .catch(error => {
        alert("Sorry Data Can't be loaded. Please Try refresh the page.");
      });
  };

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 23.804343, lng: 90.41343 },
      zoom: 14
    });

    // creating infoWindow

    let infowindow = new window.google.maps.InfoWindow();

    // maps through the places obtained through foursquare api call

    // eslint-disable-next-line no-use-before-define
    this.state.places.map(place => {
      let venueName = `<h3>${place.venue.name}</h3>`;
      let venueAddress = `<p>Address: ${
        place.venue.location.formattedAddress[0]
      }</p>`;
      let dataSource = `<p class="dataSource">Data provided by Foursquare</p>`;

      //marker is created for each place.

      const markerPoint = {
        lat: place.venue.location.lat,
        lng: place.venue.location.lng
      };
      let marker = new window.google.maps.Marker({
        position: markerPoint,
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: place.venue.name
      });

      // markers is pushed in two different state. One to be used for regular purpose and another
      // for resetting the marker once there is no query

      this.state.markers.push(marker);
      this.state.allMarkers.push(marker);

      marker.addListener("click", function() {
        openingMarker(marker);
      });

      /*
      Opening the infowindow once a marker is clicked
      */

      // marker opening function that sets the content of the infowWindow using the foursquare data.

      function openingMarker(marker) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 600);

        let latLng = marker.getPosition();
        map.setCenter(latLng);

        if (venueName) {
          infowindow.setContent(venueName + venueAddress + dataSource);
          infowindow.open(map, marker);
        } else {
          infowindow.setContent("Sorry No Data Available");
        }

        //Thanks for the help with this from
        //https://stackoverflow.com/questions/10022873/closing-info-windows-in-google-maps-by-clicking-the-map

        window.google.maps.event.addListener(map, "click", function() {
          infowindow.close();
        });
      }
    });
  };

  // this is the function that is used by the location list on the sidebar and triggers marker click
  // once the individual place title on the sidebar is clicked

  listItemClick = place => {
    // eslint-disable-next-line no-use-before-define
    this.state.markers.map(marker => {
      if (marker.title === place.venue.name) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  render() {
    return (
      <main className="App">
        <Sidebar
          places={this.state.places}
          markers={this.state.markers}
          listItemClick={this.listItemClick}
          filterPlace={this.filterPlace}
        />
        <div id="map" />
      </main>
    );
  }
}

export default App;

// this is the function that loads tthat helps with the google map working with React.

function mapLoader(url) {
  let index = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    alert("Google Map API can not be loaded.");
  };
  index.parentNode.insertBefore(script, index);
}
