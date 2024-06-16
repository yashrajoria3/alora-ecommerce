import React from "react";
import { Outlet } from "react-router-dom";

const NoNavLayout = (props) => {
  return (
    <div className="flex-grow">
      <Outlet />
    </div>
  );
};

export default NoNavLayout;
