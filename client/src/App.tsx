import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LineChart } from "@mui/x-charts";
import { Box, Stack } from "@mui/system";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FilterVintageOutlinedIcon from "@mui/icons-material/FilterVintageOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { FormControlLabel, Switch, Typography } from "@mui/material";

const s = io("http://localhost:4000/");

interface DataFromServer {
  labels: number[];
  values: number[];
}
interface StateData {
  temperature: DataFromServer;
  humidity: DataFromServer;
  light: DataFromServer;
}

function App() {
  const [data, setData] = useState<DataFromServer>({ labels: [], values: [] });

  const [checkedLight, setCheckedLight] = useState<boolean>(true);
  const [checkedFan, setCheckedFan] = useState<boolean>(false);

  // console.log(checkedLight, checkedFan);

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
  // console.log(data.values.reduce((p, c) => p + c, 0) / data.values.length);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: `${
          data.values.reduce((p, c) => p + c, 0) / data.values.length < 50
            ? "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
            : "linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
        }`,
        transition: ` all 1s ease-in-out`,
      }}
    >
      <Stack
        direction={"row"}
        spacing={2}
        marginTop={10}
        justifyContent={"center"}
      >
        <Box justifyContent={"center"}>
          <Typography variant="h5" component="h5">
            <ThermostatOutlinedIcon
              sx={{ verticalAlign: "middle" }}
              color={"error"}
            />
            Nhiệt độ
            <Typography
              variant="h5"
              component="h5"
              color={"red"}
              marginLeft={3}
            >
              {data.values[data.values.length - 1]}
            </Typography>
          </Typography>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian (s)",
              },
            ]}
            yAxis={[
              {
                id: "a",
                scaleType: "linear",
                min: 0,
                max: 120,
                label: "Nhiệt độ (°C)",
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
            <Typography
              variant="h5"
              component="h5"
              color={"blue"}
              marginLeft={3}
            >
              {data.values[data.values.length - 1]}
            </Typography>
          </Typography>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian (s)",
              },
            ]}
            yAxis={[
              {
                id: "a",
                scaleType: "linear",
                min: 0,
                max: 100,
                label: "Phần trăm (%)",
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
            <Typography
              variant="h5"
              component="h5"
              color={"#ff6d00"}
              marginLeft={3}
            >
              {data.values[data.values.length - 1]}
            </Typography>
          </Typography>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian (s)",
              },
            ]}
            yAxis={[
              {
                id: "a",
                scaleType: "linear",
                min: 0,
                max: 120,
                label: "Nhiệt độ (°C)",
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
          control={
            <Switch
              defaultChecked
              color="success"
              onChange={(event) => {
                setCheckedLight(event.target.checked);
              }}
            />
          }
          label={
            <Typography variant="h5" component="h5">
              {checkedLight ? (
                <LightbulbIcon
                  sx={{ verticalAlign: "middle" }}
                  color="success"
                  fontSize="large"
                  style={{
                    transition: ` all 1s ease-in-out`,
                    animation: `${
                      checkedLight && "neon"
                    } 1.5s ease-in-out infinite alternate`,
                  }}
                />
              ) : (
                <LightbulbOutlinedIcon
                  sx={{ verticalAlign: "middle" }}
                  color="success"
                  fontSize="large"
                  style={{
                    transition: ` all 1s ease-in-out`,
                  }}
                />
              )}
              Đèn
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Switch
              color="warning"
              onChange={(event) => {
                setCheckedFan(event.target.checked);
              }}
            />
          }
          label={
            <Typography variant="h5" component="h5">
              <FilterVintageOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                color="warning"
                fontSize="large"
                style={{
                  animation: `${checkedFan && "spin"} 1s linear infinite`,
                }}
              />
              Quạt
              <style>{`
            @keyframes spin {
                 0% { transform: rotate(360deg); }
                 100% { transform: rotate(0deg); }
            }

            @keyframes neon {
              from {
                filter: drop-shadow( 0 0 5px #fff) drop-shadow( 0 0 15px green) drop-shadow( 0 0 20px green);
              }
            
              to {
                
                filter: drop-shadow( 0 0 20px #fff) drop-shadow( 0 0 25px green) drop-shadow( 0 0 40px green);
              }
            }
              `}</style>
            </Typography>
          }
        />
      </Stack>
    </div>
  );
}

export default App;
