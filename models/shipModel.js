export const mapShipData = (raw) => {
return {
    name: raw.name || null,
    mmsi: raw.MMSI || null,
    imo: raw.IMO || null,
    port: raw.port || null,
    lat: raw.lat || 0,
    lon: raw.lon || 0,
    speed: raw.speed || 0,
    calcSpeed: raw.calcspeed || 0,
    date: raw.date || null,
    heading: raw.heading || null,
    distance: raw.distance || 0,
    rpm: {
      ME1: raw.RPM_ME1 || null,
      ME2: raw.RPM_ME2 || null,
      ME3: raw.RPM_ME3 || null,
      GB1: raw.RPM_GB1 || null,
      GB2: raw.RPM_GB2 || null,
      GB3: raw.RPM_GB3 || null,
    },
    ae: {
      AE1: raw.AE1 || null,
      AE2: raw.AE2 || null,
      AE3: raw.AE3 || null,
    },
    fuelConsumption: {
      main: raw.fuel_cons || null,
      secondary: raw.fuel_cons2 || null,
    },
    speedClass: raw.speed_class_t || null,
    vesselId: raw.vessel_id || null,
    ior: raw.ior || 0,
    ips: raw.ips || 0,
    boxSensor: raw.boxsensor || null,
  };
};
