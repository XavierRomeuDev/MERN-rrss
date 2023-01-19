import React from "react";
import { Header } from "../private/Header";
import { Outlet } from 'react-router-dom';
import { Sidebar } from "./Sidebar";

export const PrivateLayout = () => {
  return (
    <>
      <Header />

      <section className="layout__content">
        <Outlet />
      </section>

      <Sidebar/>
    </>
  );
};
