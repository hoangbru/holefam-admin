"use client";

import { Fragment, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Toaster />
      {children}
    </Fragment>
  );
};

export default AppProvider;
