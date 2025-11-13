interface ServiceNeeds {
  needsFlight: boolean;
  needsHotel: boolean;
  needsCar: boolean;
  needsActivities: boolean;
}

export const useServiceNeeds = (selectedServices: string[]): ServiceNeeds => {
  return {
    needsFlight: selectedServices.includes("flights"),
    needsHotel: selectedServices.includes("hotel"),
    needsCar: selectedServices.includes("car"),
    needsActivities: selectedServices.includes("activities"),
  };
};
