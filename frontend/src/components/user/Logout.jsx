import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'

export const Logout = () => {

    const {setAuth, setCounters} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      localStorage.clear();
      setAuth({});
      navigate("/login");
    }, [])
    
  return (
    <div>Logout...</div>
  )
}
