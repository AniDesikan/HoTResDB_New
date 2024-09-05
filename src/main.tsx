import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS here
// import FullSidebar from "./components/FullSidebar"; // Import fullSidebar component here
import NavigationBar from "./components/Misc/Navbar"; // Import NavigationBar component here
import Home from "./components/OtherPages/Slideshow"; // Import Home component here
import Login from "./components/OtherPages/Login";
// import PillsExample from "./components/TabTemplate";
// import ExecuteSearch from "./components/ExecuteSearch";
import Queries from "./components/Queries/Queries";
import Register from "./components/OtherPages/Register";
import Admin from "./components/Admin/Admin";
import DataStats from "./components/OtherPages/DataStats";
import Help from "./components/OtherPages/Help";
import Contributors from "./components/OtherPages/Contributors";
import NanostringQueries from "./components/Nanostring/NanostringQueries";
// import AddGenes from "./components/AddGenes";
// import AddDatasets from "./components/AddDatasets";
// import SearchResults from "./components/SearchResults";
// import ExpressionData from "./components/ExpressionData";
// import AddDatasets from "./components/AddDatasets";
// In the future, the Queries tab will contain all of these tabs, and switch between them as the tabs dictate.
// For now, for consistency, we're going to keep them separate.
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <NavigationBar />
        <Home />
      </div>
    ),
  },
  {
    path: "/Queries",
    element: (
      <div>
        <NavigationBar />
        <Queries />
        {/* <FullSidebar /> */}
      </div>
    ),
  },
  {
    path: "/Nanostring",
    element: (
      <div>
        <NavigationBar />
        <NanostringQueries />
        {/* <FullSidebar /> */}
      </div>
    ),
  },
  {
    path: "/Login",
    element: (
      <div>
        <NavigationBar />
        <Login />
      </div>
    ),
  },
  {
    path: "/Register",
    element: (
      <div>
        <NavigationBar />
        <Register />
      </div>
    ),
  },
  {
    path: "/admin",
    element: (
      <div>
        <NavigationBar />
        <Admin />
      </div>
    ),
  },
  {
    path: "/DataStats",
    element: (
      <div>
        <NavigationBar />
        <DataStats />
      </div>
    ),
  },
  {
    path: "/Help",
    element: (
      <div>
        <NavigationBar />
        <Help />
      </div>
    ),
  },
  {
    path: "/Contributors",
    element: (
      <div>
        <NavigationBar />
        <Contributors />
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
