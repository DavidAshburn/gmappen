import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 
    "mapPane",
    "latitude",
    "longitude"
  ]

  connect() {
    this.map;
    this.infoWindow;
    this.pos;

    this.longitudeTarget.innerText = "Connected";

    window.initMap = function()  {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
        mapTypeId: 'satellite'
      });
      this.infoWindow = new google.maps.InfoWindow();

      this.locationButton = document.createElement("button");

      this.locationButton.textContent = "Current Location";
      this.locationButton.classList.add("btn-green", "text-lg", "mt-2");
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.locationButton);
      this.locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              };

              this.infoWindow.setPosition(pos);
              this.infoWindow.setContent("Location found.");
              this.infoWindow.open(this.map);
              this.map.setCenter(pos);
              this.map.setOptions({zoom: 18});
            },
            () => {
              this.handleLocationError(true, this.infoWindow, this.map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          this.handleLocationError(false, this.infoWindow, this.map.getCenter());
        }
      });

    }

    window.initMap = initMap;
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
}