import React from 'react'
import {useDispatch} from 'react-redux'
import {authService} from "../../Services/authService"; 
import {logout} from '../../redux/authSlice'
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@mui/icons-material';

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
    <button className='px-3 py-2 border rounded-lg  text-red-600 hover:shadow-xl cursor-pointer border-red-500' onClick={logoutHandler}>
       <LogoutOutlined />
          <span className="pl-2">Logout</span>
    </button>
    
  )
}

export default LogoutBtn
