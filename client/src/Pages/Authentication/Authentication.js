import React, { useEffect, useState } from 'react';
import './Authentication.css';
import Login from '../../components/login/login';
import Signup from '../../components/signup/signup';
import { useNavigate } from 'react-router-dom';

function Authentication() {
    const [toggleInput, setToggleInput] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userData'));
        if (user) {
            navigate('/home');
        }
    }, [navigate]);


    function handleClick(event) {
        const val = event.target.childNodes[0].textContent === 'Log In';
        if ((val && toggleInput) || (!val && !toggleInput)) {
            return;
        }
        else {
            setToggleInput(!toggleInput);
        }
    }

    return (
        <div className='login-signup-page'>
            <div className={(toggleInput ? 'height-small' : 'height-large') + ' authentication'}>
                <div className='a-title'>
                    <h1>Just An Other Chat Application</h1>
                </div>
                <div className='a-body'>
                    <div className='a-headers'>
                        <ul>
                            <li onClick={handleClick} className={toggleInput ? 'highlight' : ''}>Log In</li>
                            <li onClick={handleClick} className={toggleInput ? '' : 'highlight'}>Sign Up</li>
                        </ul>
                    </div>
                    <div className='a-logInAndSignUp'>
                        {toggleInput ? <Login /> : <Signup />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Authentication;