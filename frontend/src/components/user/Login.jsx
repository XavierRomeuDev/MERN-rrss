import React from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import { useState } from "react";


export const Login = () => {
  const { form, changed } = useForm({});
  const [ saved, setSaved ] = useState("not_sended");

  const loginUser = async(e) => {
    e.preventDefault();

    const userToLogin = form;

    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if(data.status == "Success"){
      setSaved("Success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else{
      setSaved("Error");
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>

      <div className="content__posts">
      {saved == "Success" ? <strong className="alert alert-success">Login successful</strong> : ""}
        {saved =="Error" ? <strong className="alert alert-failure">"Login failed"</strong> : ""}
        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed}/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed}/>
          </div>

          <input type="submit" value="Login" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
