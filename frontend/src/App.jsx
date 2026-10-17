import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Body from "./components/Body.jsx";
import Feed from "./components/Feed.jsx";
import Requests from "./components/Requests.jsx";
import Connections from "./components/Connections.jsx";
import Profile from "./components/Profile.jsx";
import Toast from "./components/Toast.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Body />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;