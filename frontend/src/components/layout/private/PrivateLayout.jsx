import React from "react";
import { Header } from "../private/Header";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();

  if(loading){
    return (
      <h1>Loading...</h1>
      )
  }else{
    return (
      <>
        <Header />
  
        <section className="layout__content">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </section>
  
        <Sidebar />
      </>
    );
  }
};
