import { create } from "zustand";

interface IDataStore {
  labels: number[];
  valueTemperature: number[];
  valueHumidity: number[];
  valueLight: number[];
  valueDust: number[];
}

interface IDataFromServer {
  label: number;
  valueTemperature: number;
  valueHumidity: number;
  valueLight: number;
  valueDust: number;
}

interface DashboardState {
  data: IDataStore;
  checkedLight: boolean;
  checkedLight2: boolean;
  checkedFan: boolean;
  setCheckedLight: (a: boolean) => void;
  setCheckedLight2: (a: boolean) => void;
  setCheckedFan: (a: boolean) => void;
  updateData: (data: IDataFromServer) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  checkedLight: false,
  checkedLight2: false,
  checkedFan: false,
  data: {
    labels: [0, 0, 0, 0, 0, 0],
    valueHumidity: [0, 0, 0, 0, 0, 0],
    valueLight: [0, 0, 0, 0, 0, 0],
    valueTemperature: [0, 0, 0, 0, 0, 0],
    valueDust: [0, 0, 0, 0, 0, 0],
  },
  updateData: (data) => {
    set((prev) => {
      const checkData = {
        labels: [...prev.data.labels, data.label],
        valueTemperature: [
          ...prev.data.valueTemperature,
          data.valueTemperature,
        ],
        valueHumidity: [...prev.data.valueHumidity, data.valueHumidity],
        valueLight: [...prev.data.valueLight, data.valueLight],
        valueDust: [...prev.data.valueDust, data.valueDust],
      };
      const updatedData = checkData;
      // console.log(updatedData);

      if (checkData.labels.length > 12) {
        updatedData.labels.shift();
        updatedData.valueTemperature.shift();
        updatedData.valueHumidity.shift();
        updatedData.valueLight.shift();
        updatedData.valueDust.shift();
      }
      // console.log(updatedData);

      return { ...prev, data: updatedData };
    });
  },
  setCheckedFan(a) {
    set({ checkedFan: a });
  },
  setCheckedLight(a) {
    set({ checkedLight: a });
  },
  setCheckedLight2(a) {
    set({ checkedLight2: a });
  },
}));
