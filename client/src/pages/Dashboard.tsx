import { useEffect, useState } from "react";
import io from "socket.io-client";
import { LineChart } from "@mui/x-charts";
import { Stack } from "@mui/system";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FilterVintageOutlinedIcon from "@mui/icons-material/FilterVintageOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { FormControlLabel, Switch, Typography, Grid } from "@mui/material";
import { AppWidgetSummary, Header } from "../Components";

const s = io("http://localhost:4000/");

interface DataFromServer {
  labels: number[];
  valueTemperature: number[];
  valueHumidity: number[];
  valueLight: number[];
}

function Dashboard() {
  const [data, setData] = useState<DataFromServer>({
    labels: [0],
    valueHumidity: [0],
    valueLight: [0],
    valueTemperature: [0],
  });

  const [checkedLight, setCheckedLight] = useState<boolean>(true);
  const [checkedFan, setCheckedFan] = useState<boolean>(false);

  // console.log(checkedLight, checkedFan);

  useEffect(() => {
    s.on("dataUpdate", (newData: any) => {
      setData((prev) => {
        const checkData = {
          labels: [...prev.labels, newData.label],
          valueTemperature: [
            ...prev.valueTemperature,
            newData.valueTemperature,
          ],
          valueHumidity: [...prev.valueHumidity, newData.valueHumidity],
          valueLight: [...prev.valueLight, newData.valueLight],
        };
        const updatedData = checkData;
        // console.log(updatedData);

        if (checkData.labels.length > 12) {
          updatedData.labels.shift();
          updatedData.valueTemperature.shift();
          updatedData.valueHumidity.shift();
          updatedData.valueLight.shift();
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
    <>
      {/* Header */}
      <Header
        title="Dashboard"
        subtitle="Băng điều kiển theo dõi nhiệt độ, độ ẩm, ánh sáng"
      />
      {/* Data */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "25vh" }}
      >
        <Grid xs={4} height={"25vh"} item>
          <AppWidgetSummary
            color="error"
            icon={
              <ThermostatOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                fontSize={"large"}
                color={"error"}
              />
            }
            title={"Nhiệt độ (°C)"}
            total={data.valueTemperature[data.valueTemperature.length - 1]}
          />
        </Grid>
        <Grid xs={4} height={"25vh"} item>
          <AppWidgetSummary
            color="primary"
            icon={
              <WaterDropOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                fontSize={"large"}
                color={"primary"}
              />
            }
            title={"Độ ẩm (%)"}
            total={data.valueHumidity[data.valueHumidity.length - 1]}
          />
        </Grid>
        <Grid xs={4} height={"25vh"} item>
          <AppWidgetSummary
            color="warning"
            icon={
              <LightModeOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                fontSize={"large"}
                color={"warning"}
              />
            }
            title={"Ánh sáng (lx)"}
            total={data.valueLight[data.valueLight.length - 1]}
          />
        </Grid>
        <Grid item xs={8} maxHeight={"100%"} maxWidth={"100%"} height={"60vh"}>
          <LineChart
            sx={{ transition: "0.4s all linear" }}
            xAxis={[
              {
                scaleType: "point",
                data: data.labels,
                label: "Thời gian (s)",
              },
            ]}
            yAxis={[
              {
                id: "Nhiet do",
                scaleType: "linear",
                min: 0,
                max: 120,
                label: "Nhiệt độ (°C)",
              },
              {
                id: "Anh sang",
                scaleType: "linear",
                min: 0,
                max: 1200,
                label: "Ánh sáng (lx)",
              },
            ]}
            series={[
              {
                color: "#ff0000",
                yAxisKey: "Nhiet do",
                data: data.valueTemperature,
                // area: true,
                curve: "catmullRom",
                label: "Nhiệt độ",
              },
              {
                color: "blue",
                yAxisKey: "Nhiet do",
                data: data.valueHumidity,
                // area: true,
                curve: "catmullRom",
                label: "Độ ẩm",
              },
              {
                color: "yellow",
                yAxisKey: "Anh sang",
                data: data.valueLight,
                // area: true,
                curve: "catmullRom",
                label: "Ánh sáng",
              },
            ]}
            rightAxis="Anh sang"
            //   width={600}
            //   height={600}
          />
        </Grid>
        <Grid item xs={4}>
          <Stack
            // direction={"row"}
            spacing={10}
            justifyContent="center"
            alignItems={"center"}
            marginTop={15}
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
        </Grid>
      </Grid>

      {/* <Stack
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
              Nhiệt độ (°C)
              <Typography
                variant="h5"
                component="h5"
                color={"red"}
                marginLeft={3}
              >
                {data.valueTemperature[data.valueTemperature.length - 1]}
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
                  data: data.valueTemperature,
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
              Độ ẩm (%)
              <Typography
                variant="h5"
                component="h5"
                color={"blue"}
                marginLeft={3}
              >
                {data.valueHumidity[data.valueHumidity.length - 1]}
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
                  data: data.valueHumidity,
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
              Ánh sáng (lx)
              <Typography
                variant="h5"
                component="h5"
                color={"#ff6d00"}
                marginLeft={3}
              >
                {data.valueLight[data.valueLight.length - 1]}
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
                  label: "Độ rọi (lx)",
                },
              ]}
              series={[
                {
                  color: "yellow",
                  yAxisKey: "a",
                  data: data.valueLight,
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
        </Stack> */}
      {/* </div> */}
    </>
  );
}

export default Dashboard;
