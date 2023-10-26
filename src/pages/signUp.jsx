import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

// media
import GoogleIcon from '../assets/GoogleIconpng.png'
import FacebookIcon from '../assets/FacebookIcon.png'
import AppleIcon from '../assets/AppleIcon.png'
import logo from '../assets/logo2.png'

// importing Navbar
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';

// 3D Earth Model
import { EarthCanvas } from '../components/Canvas/Earth'


// SignUp Page Template
const SignUp = () => {
    // Refs for inputs values
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()


    const createNewUser = async () => {
        if(emailRef.current.value !== null){
            let isEmail = false
            for(let i=0; i< emailRef.current.value.length; i++){
                if(emailRef.current.value[i] === "@"){
                    isEmail = true
                }
            }
            if(!isEmail){
                toast.warning('Please enter a valid email address!', {
                    position: toast.POSITION.BOTTOM_LEFT
                })    
            }
            else if(passwordRef.current.value !== passwordConfirmRef.current.value){
                toast.warning('Passwords do not match!', {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            }
    
            else if(passwordRef.current.value < 6){
                toast.warning('Password must be at least 6 characters long!', {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            }
    
            else{
                const { data: {user}, error } = await supabase.auth.signUp({
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                })
    
                if(error) {
                    console.log(error);
                }
    
                if(user){
                    navigate('/login/newAccount')
                }
            }
        }
        
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navbar/>
            <div className='loginPage'>
                <div className='loginPage-header'>
                    <div className='loginPage-login'>
                        <form>
                            <h1><img src={logo} alt="" />Sign Up</h1>
                            <p>Please provide your email and setup your password to start.</p>
                            <input ref={emailRef} type='email' placeholder='Email' />
                            <input ref={passwordRef} type={(
                                showPassword ? 'text' : 'password')} placeholder='Create Password'/>
                            <input ref={passwordConfirmRef} type={(
                                showPassword ? 'text' : 'password')} placeholder='Confirm Password'
                                style={{marginBottom: '8px'}}/>
                            <div className="showPasswordDiv">
                                <input type='checkbox' onClick={() => {
                                    if(showPassword){
                                        setShowPassword(false);
                                        console.log(showPassword);
                                    }
                                    else{
                                        setShowPassword(true);
                                        console.log(showPassword);
                                    }
                                }}/>
                                <p>Show Password</p>
                            </div>
                            <button type='submit' onClick={(e) => {
                                e.preventDefault()
                                createNewUser()
                            }}>Sign Up With Email</button>
                            <div className="dontAccount">
                                Already have an account?
                                <Link className='dontAccountLink' to='/signUp'>Sign Up</Link>
                            </div>
                        </form>
                        {/* <div className='signUp-division'>
                            <span></span>
                            <p>or</p>
                            <span></span>
                        </div>
                        <div className="signUpProviders">
                            <button className='facebook'><img src={FacebookIcon}/><p>Sign up with Facebook</p></button>
                            <button className='google'><img src={GoogleIcon}/><p>Sign up with Google</p></button>
                            <button className='apple'><img src={AppleIcon}/><p>Sign up with Apple</p></button>
                        </div> */}
                    </div>
                </div>
                <div className='earth-animation'>
                    <EarthCanvas />
                </div>
            </div>
        </>
    )
}

export default SignUp;