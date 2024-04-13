import { useEffect, useLayoutEffect, useState } from "react";
import io from "socket.io-client";
import { LineChart } from "@mui/x-charts";
import { Stack } from "@mui/system";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FilterVintageOutlinedIcon from "@mui/icons-material/FilterVintageOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import {
  FormControlLabel,
  Switch,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AppWidgetSummary, Header } from "../Components";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useDashboardStore } from "../stores/DashboardStore";

const VALUE_MAX_TEMPERATURE = 80;
const VALUE_MAX_HUMIDITY = 80;
const VALUE_MAX_LIGHT = 80;

const s = io("http://localhost:4000/");

function Dashboard() {
  // const [data, setData] = useState<DataFromServer>({

  // });

  const data = useDashboardStore((state) => state.data);
  const updateData = useDashboardStore((state) => state.updateData);

  const checkedLight = useDashboardStore((state) => state.checkedLight);
  const setCheckedLight = useDashboardStore((state) => state.setCheckedLight);

  const checkedFan = useDashboardStore((state) => state.checkedFan);
  const setCheckedFan = useDashboardStore((state) => state.setCheckedFan);

  // const [checkedLight, setCheckedLight] = useState<boolean>(false);
  // const [checkedFan, setCheckedFan] = useState<boolean>(false);

  const [loadingLight, setLoadingLight] = useState<boolean>(false);
  const [loadingFan, setLoadingFan] = useState<boolean>(false);

  // console.log(checkedLight, checkedFan);

  useEffect(() => {
    s.on("dataUpdate", (newData: any) => {
      // console.log(newData, data);

      updateData(newData);
    });
    return () => {
      // Cleanup on component unmount
      s.off("dataUpdate");
    };
  }, []);

  useEffect(() => {
    s.on("device/led/message", (newData: any) => {
      // updateData(newData);
      setCheckedLight(newData.status === "true");
      setLoadingLight(false);
      enqueueSnackbar(
        `Thông báo: Đèn đã được ${newData.status === "true" ? "Bật" : "Tắt"}`,
        {
          variant: newData.status === "true" ? "success" : "warning",
          preventDuplicate: true,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );
    });
    return () => {
      // Cleanup on component unmount
      s.off("device/led/message");
      closeSnackbar();
    };
  }, []);

  useEffect(() => {
    s.on("device/fan/message", (newData: any) => {
      setCheckedFan(newData.status === "true");
      setLoadingFan(false);
      enqueueSnackbar(
        `Thông báo: Quạt đã được ${newData.status === "true" ? "Bật" : "Tắt"}`,
        {
          variant: newData.status === "true" ? "success" : "warning",
          preventDuplicate: true,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );

      // updateData(newData);
    });
    return () => {
      // Cleanup on component unmount
      s.off("device/fan/message");
      closeSnackbar();
    };
  }, []);

  useEffect(() => {
    if (
      data.valueTemperature[data.valueTemperature.length - 1] >
      VALUE_MAX_TEMPERATURE
    ) {
      enqueueSnackbar("Cảnh báo: Nhiệt độ quá cao", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    if (
      data.valueHumidity[data.valueHumidity.length - 1] > VALUE_MAX_HUMIDITY
    ) {
      enqueueSnackbar("Cảnh báo: Độ ẩm quá cao", {
        variant: "info",
        preventDuplicate: true,
      });
    }
    if (
      data.valueTemperature[data.valueTemperature.length - 1] > VALUE_MAX_LIGHT
    ) {
      enqueueSnackbar("Cảnh báo: Ánh sáng quá cao", {
        variant: "warning",
        preventDuplicate: true,
      });
    }
    return () => closeSnackbar();
  }, [data.valueTemperature[data.valueTemperature.length - 1]]);

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
            gradientColor={`linear-gradient(to top,#ff0844 0%, ${
              data.valueTemperature[data.valueTemperature.length - 1] >
              VALUE_MAX_TEMPERATURE
                ? "#ff0000"
                : "#ffb199"
            } 100%)`}
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
            gradientColor={`linear-gradient(120deg, ${
              data.valueHumidity[data.valueHumidity.length - 1] >
              VALUE_MAX_HUMIDITY
                ? "#0061ff"
                : "#a1c4fd"
            } 0%, #c2e9fb 100%)`}
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
            gradientColor={`linear-gradient(-225deg, ${
              data.valueHumidity[data.valueHumidity.length - 1] >
              VALUE_MAX_LIGHT
                ? "#fff"
                : "#FFE29F"
            } 0%, #FFA99F 48%, #FF719A 100%)`}
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
            marginTop={10}
          >
            <FormControlLabel
              sx={{ fontSize: "2rem" }}
              control={
                loadingLight ? (
                  <CircularProgress color="success" />
                ) : (
                  <Switch
                    size="medium"
                    checked={checkedLight}
                    value={checkedLight}
                    color="success"
                    onChange={() => {
                      setLoadingLight(true);
                      s.emit("toggleLight", !checkedLight);
                      // setCheckedLight(event.target.checked);
                    }}
                  />
                )
              }
              label={
                <Typography variant="h5" component="h5" fontSize={"inherit"}>
                  {checkedLight ? (
                    <LightbulbIcon
                      sx={{ verticalAlign: "middle" }}
                      color="success"
                      fontSize="inherit"
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
                      fontSize="inherit"
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
              sx={{ fontSize: "2rem" }}
              control={
                loadingFan ? (
                  <CircularProgress color="warning" />
                ) : (
                  <Switch
                    size="medium"
                    value={checkedFan}
                    checked={checkedFan}
                    color="warning"
                    onChange={() => {
                      setLoadingFan(true);
                      s.emit("toggleFan", !checkedFan);

                      // setCheckedFan(event.target.checked);
                    }}
                  />
                )
              }
              label={
                <Typography variant="h5" component="h5" fontSize={"inherit"}>
                  <FilterVintageOutlinedIcon
                    sx={{ verticalAlign: "middle" }}
                    color="warning"
                    fontSize="inherit"
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
