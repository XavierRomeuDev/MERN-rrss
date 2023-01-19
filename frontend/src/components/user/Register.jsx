import React from "react";
import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";

export const Register = () => {
  const { form, changed } = useForm({});
  const [ saved, setSaved ] = useState("not_sended");

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = form;

    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if(data.status == "Success"){
      setSaved("Saved");
    } else{
      setSaved("Error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Register</h1>
      </header>

      <div className="content__posts">

        {saved =="Saved" ? <strong className="alert alert-success">User registration complete</strong> : ""}
        {saved =="Error" ? <strong className="alert alert-failure">User registration failed</strong> : ""}

        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" onChange={changed}></input>
          </div>

          <div className="form-group">
            <label htmlFor="surnname">Surname</label>
            <input type="text" name="surnname" onChange={changed}></input>
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" onChange={changed}></input>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed}></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed}></input>
          </div>

          <input type="submit" value="Register" className="btn btn-succes" />
        </form>
      </div>
    </>
  );
};
