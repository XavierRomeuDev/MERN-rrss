import React from "react";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import avatar from "../../../assets/img/user.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";

export const Sidebar = () => {
  const { auth, counters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");

  const savePublication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    let newPublication = form;
    newPublication.user = auth._id;

    const request = await fetch(Global.url + "publication/save", {
      method: "POST",
      body: JSON.stringify(newPublication),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    if (data.status == "Success") {
      setStored("Stored");
    } else {
      setStored("Error");
    }

    const fileInput = document.querySelector("#file");

    if (data.status == "Success" && fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file0", fileInput.files[0]);

      const imageRequest = await fetch(
        Global.url + "publication/upload/" + data.publicationStored._id,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: token,
          },
        }
      );

      const uploadData = await imageRequest.json();

      if (uploadData.status == "Success") {
        setStored("Stored");
      } else {
        setStored("Error");
      }
    }
    const myForm = document.querySelector("#publication-form");
    myForm.reset();
  };

  return (
    <>
      <aside className="layout__aside">
        <header className="aside__header">
          <h1 className="aside__title">Hey, {auth.name}</h1>
        </header>

        <div className="aside__container">
          <div className="aside__profile-info">
            <div className="profile-info__general-info">
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

              <div className="general-info__container-names">
                <NavLink
                  to={"/social/profile/" + auth._id}
                  className="container-names__name"
                >
                  {auth.name} {auth.surname}
                </NavLink>
                <p className="container-names__nickname">{auth.nick}</p>
              </div>
            </div>

            <div className="profile-info__stats">
              <div className="stats__following">
                <Link
                  to={"/social/following/" + auth._id}
                  className="following__link"
                >
                  <span className="following__title">Following</span>
                  <span className="following__number">
                    {counters.following}
                  </span>
                </Link>
              </div>
              <div className="stats__following">
                <Link
                  to={"/social/followed/" + auth._id}
                  className="following__link"
                >
                  <span className="following__title">Followers</span>
                  <span className="following__number">{counters.followed}</span>
                </Link>
              </div>

              <div className="stats__following">
                <NavLink
                  to={"/social/profile/" + auth._id}
                  className="following__link"
                >
                  <span className="following__title">Publications</span>
                  <span className="following__number">
                    {counters.publications}
                  </span>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="aside__container-form">
            <form
              id="publication-form"
              className="container-form__form-post"
              onSubmit={savePublication}
            >
              <div className="form-post__inputs">
                <label htmlFor="text" className="form-post__label">
                  ¿Que estas pesando hoy?
                </label>
                <textarea
                  name="text"
                  className="form-post__textarea"
                  onChange={changed}
                ></textarea>
              </div>

              <div className="form-post__inputs">
                <label htmlFor="file" className="form-post__label">
                  Sube tu foto
                </label>
                <input
                  type="file"
                  name="image"
                  id="file"
                  className="form-post__image"
                />
              </div>

              <input
                type="submit"
                value="Enviar"
                className="form-post__btn-submit"
              />
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};
