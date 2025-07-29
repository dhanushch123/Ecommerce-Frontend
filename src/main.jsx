import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AppProvider } from "./Context/Context.jsx";
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
// import { BrowserRouter as Router } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Router> */}
      <AppProvider>
        <App/>
      </AppProvider>
    {/* </Router> */}
  </React.StrictMode>
);
