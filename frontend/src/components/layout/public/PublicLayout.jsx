import React from "react";
import { Header } from "../public/Header";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const PublicLayout = () => {
  const { auth } = useAuth();

  return (
    <>
      <Header />

      <section className="layout__content">
        {!auth._id ? <Outlet /> : <Navigate to="/social"/>}
        
      </section>
    </>
  );
};
