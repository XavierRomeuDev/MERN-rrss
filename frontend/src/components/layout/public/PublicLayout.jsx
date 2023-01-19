import React from "react";
import { Header } from "../public/Header";
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <>
      <Header />

      <section className="layout__content">
        <Outlet />
      </section>
    </>
  );
};
