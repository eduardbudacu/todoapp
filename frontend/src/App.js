import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import SignIn from './pages/SignIn';
import Tasks from './pages/Tasks';
import SignUp from "./pages/SignUp";
const defaultTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
    <Container component="main" >
    <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </Container>
    </ThemeProvider>
  );
}

export default App;
