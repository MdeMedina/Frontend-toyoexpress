import React, {Fragment} from "react";
import Navg from "../sub-components/nav";
import Sidebar from "../sub-components/sidebar";
import { Outlet } from "react-router-dom";
function Appx({socket}) {
  //The created store

  document.querySelector("body")?.classList.add("ltr", "main-body", "app", "sidebar-mini");
  document.querySelector("body")?.classList.remove("error-page1", "bg-primary");

  return (
    <Fragment>
            <div className="page">
              <div className="open deluxe">
                <Navg socket={socket} />
                <Sidebar />
              </div>

              <div className="main-content app-content">

                <div className="side-app">
                  <div
                    className="main-container container-fluid"
                  >
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
    </Fragment>
  );
}
export default Appx
