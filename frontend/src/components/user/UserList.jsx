import React from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import ReactTimeAgo from "react-time-ago";

export const UserList = ({
  users,
  retrieveUsers,
  following,
  setFollowing,
  more,
  loading,
  page,
  setPage,
}) => {
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    retrieveUsers(next);
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
      setFollowing([...following, userId]);
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
      let filterFollowings = following.filter(
        (followingUserId) => userId !== followingUserId
      );

      setFollowing(filterFollowings);
    }
  };

  return (
    <>
      <div className="content__posts">
        {users.map((user) => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link to={"/social/profile/"+user._id} className="post__image-link">
                    {user.image != "defaultAvatar.png" && (
                      <img
                        src={Global.url + "user/avatar/" + user.image}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user.image == "defaultAvatar.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    <img
                      src={avatar}
                      className="post__user-image"
                      alt="Foto de perfil"
                    />
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link to={"/social/profile/"+user._id} className="user-info__name">
                      {user.name} {user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link to={"/social/profile/"+user._id} className="user-info__create-date">
                    <ReactTimeAgo date={user.createdAt} locale="en-US"/>
                    </Link>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              <div className="post__buttons">
                {!following.includes(user._id) && (
                  <button
                    onClick={() => follow(user._id)}
                    className="post__button post__button--green"
                  >
                    <i className="fa-sharp fa-solid fa-user-plus"></i>
                  </button>
                )}

                {following.includes(user._id) && (
                  <button
                    onClick={() => unfollow(user._id)}
                    className="post__button post__button"
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {loading ? "Loading" : ""}

      {more && (
        <div className="content__container-btn">
          <button onClick={nextPage} className="content__btn-more-post">
            View more people
          </button>
        </div>
      )}
    </>
  );
};
