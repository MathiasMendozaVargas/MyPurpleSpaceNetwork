import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setUser } from '../redux/slice/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

            if(user_meta_data){
                navigate('/home')
            }
            else{
                navigate('/configNewUser')
            }
            
        }
        else{
            toast.error('Something Wrong Happened', {
                position: "top-right",
            })
        }
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navbar />
            <div className='loginPage'>
                <div className='loginPage-header'>
                    <h1>Login to your Account</h1>
                    <h3>Please login with your credentials</h3>
                    <div className='loginPage-login'>
                        <form>
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