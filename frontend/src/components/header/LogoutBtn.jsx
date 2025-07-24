import React from 'react'
import {useDispatch} from 'react-redux'
import {authService} from "../../Services/authService"; 
import {logout} from '../../redux/authSlice'
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = () => {
        authService
        .logout()
        .then(() => {
            dispatch(logout())
            navigate('/login', {replace : true})
        })
        .catch((error) => {
            console.error("Logout error: " , error);
        })
    }

  return (
    <button className='bg-blue-700 text-white rounded-md py-2 px-3' onClick={logoutHandler}>
        Logout
    </button>
  )
}

export default LogoutBtn
