import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./Components";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider, Container } from "@mui/material";
import { QueryClientProvider } from "react-query";

import { ColorModeContext, useMode } from "./common/theme";
import { queryClient } from "./queries";
import { routes } from "./routes";

const App = () => {
  const [theme, colorMode] = useMode();
  // const [isSidebar, setIsSidebar] = useState<boolean>(true);s
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <div className="app">
                <Navbar />
                <main className="content">
                  {/* <Topbar /> */}
                  <Container maxWidth="lg">
                    <Routes>
                      {routes.map((value, index) => (
                        <Route
                          key={index}
                          path={value.path}
                          element={value.component}
                        />
                      ))}
                    </Routes>
                  </Container>
                </main>
              </div>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
