import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setUser } from '../redux/slice/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

// media
import GoogleIcon from '../assets/GoogleIconpng.png'
import FacebookIcon from '../assets/FacebookIcon.png'
import AppleIcon from '../assets/AppleIcon.png'

// 3D Earth Model
import { EarthCanvas } from '../components/Canvas/Earth'

// importing Navbar
import Navbar from '../components/Navbar'


// Login Page Template
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef()
    const passwordRef = useRef()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Framer Motion
    const control = useAnimation()
    const [formRef, inView] = useInView()

    // Supabase session
    const session = useSession()
    const supabase = useSupabaseClient()

    async function getUserMetaData(current_user_id) {
        const { data, error } = await supabase.from('users_data').select()
    
        if(error){
            console.log(error);
        }
    
        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === current_user_id){
                    return data[i]
                }
                else{
                    console.log('Nothing found...');
                }
            }
        }
    }
    

    const loginWithPassword = async() => {
        const {data: {user}, error } = await supabase.auth.signInWithPassword({
            email: emailRef.current.value,
            password: passwordRef.current.value
        })

        if(error) {
            toast.error(error.message)
            console.log(error);
            return
        }

        if(user){
            dispatch(setUser(user))
            const user_meta_data = await getUserMetaData(user.id)
            // checking if user already setup account
            if(user_meta_data){
                navigate('/')
            }
            else{
                navigate('/configNewUser')
            }
            
        }
    }

    const loginWithExternalProvider = async(provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            }
        })
        if(error){
            console.log(error);
        }
        if(!error){
            console.log("heyyy");
        }
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navbar />
            <div className='loginPage'>
                <div className='loginPage-header'>
                    <div className='loginPage-login'>
                        <form>
                            <h1>Login to Purple</h1>
                            <p>Use either email or any of the other providers.</p>
                            <input ref={emailRef} type='text' placeholder='Username' />
                            <input ref={passwordRef} type={(
                                showPassword ? 'text' : 'password')} placeholder='Password'
                                style={{ marginBottom: '3px' }} />
                            <div className="showPasswordDiv">
                                <div className="showPasswordBox">
                                    <input type='checkbox' onClick={() => {
                                        if (showPassword) {
                                            setShowPassword(false);
                                            console.log(showPassword);
                                        }
                                        else {
                                            setShowPassword(true);
                                            console.log(showPassword);
                                        }
                                    } } />
                                    <p>Show Password</p>
                                </div>
                                <Link className='forgotLink' to='/signUp'>Forgot Password?</Link>
                            </div>
                            <button onClick={(e) => {
                                e.preventDefault();
                                loginWithPassword();
                            } }>Log In</button>
                            <div className="dontAccount">
                                Don't have an account?
                                <Link className='dontAccountLink' to='/signUp'>Sign Up</Link>
                            </div>
                        </form>
                        <div className='signUp-division'>
                            <span></span>
                            <p>or</p>
                            <span></span>
                        </div>
                        <div className="signUpProviders">
                            <button
                                onClick={async()=>{
                                    await loginWithExternalProvider('facebook')
                                }}
                                className='facebook'
                            ><img src={FacebookIcon}/><p>Login with Facebook</p></button>
                            <button
                                onClick={async()=>{
                                    await loginWithExternalProvider('google')
                                }}
                                className='google'
                            ><img src={GoogleIcon}/><p>Login with Google</p></button>
                            <button className='apple'><img src={AppleIcon}/><p>Login with Apple</p></button>
                        </div>
                    </div>
                </div>
                <div className='earth-animation'>
                    <EarthCanvas />
                </div>
                
            </div>
        </>
    )
}

export default Login;