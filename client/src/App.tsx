import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LineChart } from "@mui/x-charts";
import { Box, Stack } from "@mui/system";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FilterVintageOutlinedIcon from "@mui/icons-material/FilterVintageOutlined";
import { FormControlLabel, Switch, Typography } from "@mui/material";

const s = io("http://localhost:4000/");

interface DataFromServer {
  labels: number[];
  values: number[];
}

function App() {
  const [data, setData] = useState<DataFromServer>({ labels: [], values: [] });

  useEffect(() => {
    s.on("dataUpdate", (newData: any) => {
      setData((prev) => {
        const checkData = {
          labels: [...prev.labels, newData.label],
          values: [...prev.values, newData.value],
        };
        const updatedData = checkData;
        // console.log(updatedData);

        if (checkData.labels.length > 6) {
          updatedData.labels.shift();
          updatedData.values.shift();
        }
        // console.log(updatedData);

        return updatedData;
      });
    });
    return () => {
      // Cleanup on component unmount
      s.off("dataUpdate");
    };
  }, []);

  // console.log(data);

  return (
    <>
      <Stack direction={"row"} spacing={2} marginTop={10}>
        <Box justifyContent={"center"}>
          <Typography variant="h5" component="h5">
            <ThermostatOutlinedIcon
              sx={{ verticalAlign: "middle" }}
              color={"error"}
            />
            Nhiệt độ
          </Typography>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian",
              },
            ]}
            yAxis={[
              {
                id: "a",
                scaleType: "linear",
                min: 0,
                max: 120,
                label: "Nhiệt độ",
              },
            ]}
            series={[
              {
                color: "#ff0000",
                yAxisKey: "a",
                data: data.values,
                // area: true,
                curve: "catmullRom",
              },
            ]}
            width={400}
            height={300}
          />
        </Box>
        <Box justifyContent={"center"}>
          <Typography variant="h5" component="h5">
            <WaterDropOutlinedIcon
              sx={{ verticalAlign: "middle" }}
              color={"primary"}
            />
            Độ ẩm
          </Typography>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian",
              },
            ]}
            yAxis={[
              {
                id: "a",
                scaleType: "linear",
                min: 0,
                max: 120,
                label: "Nhiệt độ",
              },
            ]}
            series={[
              {
                color: "blue",
                yAxisKey: "a",
                data: data.values,
                // area: true,
                curve: "catmullRom",
              },
            ]}
            width={400}
            height={300}
          />
        </Box>
        <Box justifyContent={"center"}>
          <Typography variant="h5" component="h5">
            <LightModeOutlinedIcon
              sx={{ verticalAlign: "middle" }}
              color="warning"
            />
            Ánh sáng
          </Typography>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian",
              },
            ]}
            yAxis={[
              {
                id: "a",
                scaleType: "linear",
                min: 0,
                max: 120,
                label: "Nhiệt độ",
              },
            ]}
            series={[
              {
                color: "yellow",
                yAxisKey: "a",
                data: data.values,
                // area: true,
                curve: "catmullRom",
              },
            ]}
            width={400}
            height={300}
          />
        </Box>
      </Stack>

      <Stack
        direction={"row"}
        spacing={2}
        justifyContent={"center"}
        marginTop={10}
      >
        <FormControlLabel
          control={<Switch defaultChecked color="success" />}
          label={
            <Typography variant="h5" component="h5">
              <LightbulbOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                color="success"
              />
              Đèn
            </Typography>
          }
        />
        <FormControlLabel
          control={<Switch color="warning" />}
          label={
            <Typography variant="h5" component="h5">
              <FilterVintageOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                color="warning"
              />
              Quạt
            </Typography>
          }
        />
      </Stack>
    </>
  );
}

export default App;
