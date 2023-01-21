import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";
import { GetProfile } from "../../helpers/GetProfile";


export const Followers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  const params = useParams();
  const userId = params.userId;

  useEffect(() => {
    retrieveUsers(1);
    GetProfile(userId, setProfile);
  }, []);

  const retrieveUsers = async (nextPage = 1) => {
    setLoading(true);
    const request = await fetch(
      Global.url + "follow/following/" + userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();

    let cleanUsers = [];

    data.follows.forEach(follow => {
      cleanUsers = [...cleanUsers, follow.followed];
    });

    data.users = cleanUsers;

    if (data.status == "Success" && data.users) {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);

      if (users.length >= data.total - data.users.length) {
        setMore(false);
      }
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Followers of: {profile.name}</h1>
      </header>

      <UserList
        users={users}
        retrieveUsers={retrieveUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />
    </>
  );
};
