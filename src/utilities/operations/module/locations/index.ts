import localLocations from "locations_local";

export const getLocalLocations = () => {
  return localLocations;
};

export const getLocation = (location: keyof typeof localLocations) => {
  return localLocations[location];
};
