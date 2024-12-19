import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// typescript data types
type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type PositionError = {
  code: number;
  message: string;
};

export default function LocationPanel() {
  useEffect(() => {
    const map = L.map("map").setView([51.505, -0.09], 13);

    const createCustomIcon = (color: string) =>
      L.divIcon({
        className: "custom-icon",
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid #fff;"></div>`,
        iconSize: [50, 50],
        iconAnchor: [10, 10],
      });

    // OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.setView([10.3219525, 123.9500089]);

    // Static markers [1] Marine Station, [2] USC Talamban
    L.marker([10.2863281, 124.0002601], {
      icon: createCustomIcon("blue"),
    }).addTo(map);
    L.marker([10.3539904, 123.9123256], {
      icon: createCustomIcon("blue"),
    }).addTo(map);

    const onLocationSuccess = (position: Position) => {
      const { latitude, longitude } = position.coords;

      L.marker([latitude, longitude], { icon: createCustomIcon("red") })
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();
    };

    const onLocationError = (error: PositionError) => {
      console.error(error);
    };

    // Gets the user current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError
      );
    }

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="d-flex flex-grow-1" style={{ width: "400px" }}>
      <div id="map" className="w-100 h-100" />
    </div>
  );
}
