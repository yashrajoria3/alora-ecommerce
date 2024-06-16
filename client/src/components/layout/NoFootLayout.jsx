import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const NoFootLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default NoFootLayout;
