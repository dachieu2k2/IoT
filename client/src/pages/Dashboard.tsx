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
            gradientColor="linear-gradient(to top, #ff0844 0%, #ffb199 100%)"
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
            gradientColor="linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
            color="secondary"
            icon={
              <WaterDropOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                fontSize={"large"}
                color={"secondary"}
              />
            }
            title={"Độ ẩm (%)"}
            total={data.valueHumidity[data.valueHumidity.length - 1]}
          />
        </Grid>
        <Grid xs={4} height={"25vh"} item>
          <AppWidgetSummary
            gradientColor="linear-gradient(-225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)"
            color="warning"
            icon={
              <LightModeOutlinedIcon
                sx={{ verticalAlign: "middle" }}
                fontSize={"large"}
                color={"inherit"}
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
                // scaleType: "point",
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
                color: "#ff0844",
                yAxisKey: "Nhiet do",
                data: data.valueTemperature,
                // area: true,
                curve: "catmullRom",
                label: "Nhiệt độ",
              },
              {
                color: "#a1c4fd",
                yAxisKey: "Nhiet do",
                data: data.valueHumidity,
                // area: true,
                curve: "catmullRom",
                label: "Độ ẩm",
              },
              {
                color: "#FFE29F",
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
                </Typography>
              }
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
