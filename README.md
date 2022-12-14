# README

I'm using a Stimulus controller for the Google Maps stuff and it does work on first page load, though geolocation doesn't always on iPhone for some reason. That might have to do with user preferences but it's a problem for later. 

For now, when I refresh the page the controller reconnects but the map dissappears. I'm doing something wrong but I can't figure out what.
I've stripped everything down to the two relevant files and a stock Tailwind Rails 7 project.

The turbo:load event listener was just to confirm that the page was being reloaded, I've tried disabling turbolinks on this view and that doesn't help. 

## Map.html

```
<div data-controller="map">
  <div class="w-full text-right pr-12 font-righteous text-4xl leading-[4.6rem] text-zinc-800">Google Map</div>

  <div class="flex w-full justify-center border border-black">
    <div id="map" class="w-[80vw] h-[80vh]"></div>
  </div>

  <script
    src="https://maps.googleapis.com/maps/api/js?key=***************&callback=initMap" defer>
  </script>

  <script>
    document.addEventListener('turbo:load', function () {
      console.log('turbo load') 
    })
  </script>
</div>
```

## map_controller.js

```
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ 
    "mapPane"
  ]

  connect() {
    this.map;
    this.infoWindow;
    this.pos;

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
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    this.infoWindow.open(map);
  }
}
```