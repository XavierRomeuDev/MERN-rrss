import React from "react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import { SerializeForm } from "../../helpers/SerializeForm";

export const Settings = () => {
  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_sended");

  const updateUser = async (e) => {
    e.preventDefault();

    let newUserData = SerializeForm(e.target);
    const authToken = localStorage.getItem("token");

    delete newUserData.file0;

    let request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newUserData),
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });

    const data = await request.json();

    if (data.status == "Success" && data.user) {
      delete data.user.password;
      setAuth(data.user);
      setSaved("Saved");
    } else {
      setSaved("Error");
    }
    
    const fileInput = document.querySelector("#file");

    if(data.status =="Success" && fileInput.files[0]){
        const formData = new FormData();
        formData.append('file0', fileInput.files[0]);

        const uploadRequest = await fetch(Global.url+"user/upload", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": authToken
            }
        });

        const uploadData = await uploadRequest.json();

        if(uploadData.status == "Success" && uploadData.user){
            delete uploadData.user.password;
            setAuth(uploadData.user);
            setSaved("Saved");
        }else{
            setSaved("Error");
        }
        console.log(uploadData);
    }

  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Settings</h1>
      </header>

      <div className="content__posts">
        {saved == "Saved" ? (
          <strong className="alert alert-success">User update complete</strong>
        ) : (
          ""
        )}
        {saved == "Error" ? (
          <strong className="alert alert-failure">User update failed</strong>
        ) : (
          ""
        )}

        <form className="settings-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={auth.name}></input>
          </div>

          <div className="form-group">
            <label htmlFor="surnname">Surname</label>
            <input
              type="text"
              name="surname"
              defaultValue={auth.surname}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" defaultValue={auth.nick}></input>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <input type="text" name="bio" defaultValue={auth.bio}></input>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={auth.email}></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password"></input>
          </div>

          <div className="form-group">
            <label htmlFor="file0">Avatar</label>
            <div className="general-info__container-avatar">
              {auth.image != "defaultAvatar.png" && (
                <img
                  src={Global.url + "user/avatar/" + auth.image}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {auth.image == "defaultAvatar.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>
            <br />
            <input type="file" name="file0" id="file" />
          </div>

          <br />

          <input type="submit" value="Register" className="btn btn-succes" />
        </form>
        <br/>
      </div>
    </>
  );
};
