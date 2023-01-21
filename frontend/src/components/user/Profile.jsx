import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { GetProfile } from "../../helpers/GetProfile";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";

export const Profile = () => {
  const [user, setUser] = useState({});
  const [counters, setCounters] = useState({});
  const [imFollowing, setImFollowing] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, []);

  useEffect(() => {
    getDataUser();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, [params]);

  const getDataUser = async () => {
    let dataUser = await GetProfile(params.userId, setUser);
    if (dataUser.following && dataUser.following._id) {
      setImFollowing(true);
    }
  };

  const getCounters = async () => {
    const request = await fetch(Global.url + "user/counter/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.following) {
      setCounters(data);
    }
  };

  const follow = async (userId) => {
    const request = await fetch(Global.url + "follow/follow", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status == "Success") {
      setImFollowing(true);
    }
  };

  const unfollow = async (userId) => {
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status == "Success") {
      setImFollowing(false);
    }
  };

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();

    if (data.status == "Success") {
      let newPublications = data.publications;
      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      }

      if (newProfile) {
        newPublications = data.publications;
        setMore(true);
        setPage(1);
      }

      setPublications(newPublications);

      if (
        !newProfile &&
        publications.length >= data.total - data.publications.length
      ) {
        setMore(false);
      }

      if (data.pages <= 1) {
        setMore(false);
      }
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Profile</h1>
      </header>

      <aside className="layout__aside">
        <div className="aside__container">
          <div className="aside__profile-info">
            <div className="profile-info__general-info">
              <div className="general-info__container-avatar">
                {user.image != "defaultAvatar.png" && (
                  <img
                    src={Global.url + "user/avatar/" + user.image}
                    className="container-avatar__img"
                    alt="Foto de perfil"
                  />
                )}
                {user.image == "defaultAvatar.png" && (
                  <img
                    src={avatar}
                    className="container-avatar__img"
                    alt="Foto de perfil"
                  />
                )}
              </div>

              <div className="general-info__container-names">
                <a href="#" className="container-names__name">
                  {user.name} {user.surname}
                </a>
                <p className="container-names__nickname">{user.nick}</p>
                {user._id != auth._id &&
                  (!imFollowing ? (
                    <button
                      onClick={() => follow(user._id)}
                      className="post__button post__button--green"
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      onClick={() => unfollow(user._id)}
                      className="post__button post__button"
                    >
                      Unfollow
                    </button>
                  ))}
              </div>
            </div>

            <div className="profile-info__stats">
              <div className="stats__following">
                <Link
                  to={"/social/following/" + params.userId}
                  className="following__link"
                >
                  <span className="following__title">Siguiendo</span>
                  <span className="following__number">
                    {counters.following >= 1 ? counters.following : 0}
                  </span>
                </Link>
              </div>
              <div className="stats__following">
                <Link
                  to={"/social/followed/" + params.userId}
                  className="following__link"
                >
                  <span className="following__title">Seguidores</span>
                  <span className="following__number">
                    {counters.followed >= 1 ? counters.followed : 0}
                  </span>
                </Link>
              </div>

              <div className="stats__following">
                <NavLink
                  to={"/social/profile/" + params.userId}
                  className="following__link"
                >
                  <span className="following__title">Publicaciones</span>
                  <span className="following__number">
                    {counters.publications >= 1 ? counters.publications : 0}
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
      />
    </>
  );
};
