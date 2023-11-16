import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setUser } from '../redux/slice/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import logo from '../assets/logo2.png'

// media
// import GoogleIcon from '../assets/GoogleIconpng.png'
// import FacebookIcon from '../assets/FacebookIcon.png'
// import AppleIcon from '../assets/AppleIcon.png'

// 3D Earth Model
import { EarthCanvas } from '../components/Canvas/Earth'

// importing Navbar
import Navbar from '../components/Navbar'


// Login Page Template
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [session, setSession] = useState(null)
    const emailRef = useRef()
    const passwordRef = useRef()

    // Getting message IF ANY
    const { newAccount } = useParams()

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
        if(emailRef.current.value != null && passwordRef.current.value){
            let email = emailRef.current.value
            // Checking if input is an email
            let isEmail = false
            for(let i=0; i<emailRef.current.value.length; i++){
                if(emailRef.current.value[i] === '@'){
                    isEmail = true
                }
            }

            if(!isEmail){
                let username = emailRef.current.value
                // look for user's email on DB using the username provided
                const { data, error } = await supabase.from('users_data').select('email').eq('username', username)
                if(data.length>0){
                    email = data[0].email
                }
                // if User is not entering valid email address
                else{
                    return toast.error('Enter a valid email', {
                        position: toast.POSITION.BOTTOM_LEFT
                    })
                    
                }
            }

            const {data: {user}, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: passwordRef.current.value
            })
    
            if(error) {
                toast.error(error.message, {
                     position: toast.POSITION.BOTTOM_LEFT
                })
            }
    
            if(user){
                console.log(user);
                dispatch(setUser(user))
                const user_meta_data = await getUserMetaData(user.id)
                // checking if user already setup account
                if(user_meta_data){
                    console.log(user_meta_data);
                    toast.success(`Welcome back, ${user_meta_data.first_name}!`,{
                        position: toast.POSITION.BOTTOM_LEFT
                    })
                    setTimeout(()=>{
                        navigate('/')
                    }, 2000)
                }
                else{
                    navigate('/configNewUser')
                }   
            }
        }else{
            toast.warning('Please fill all the fields!', {
                position: toast.POSITION.BOTTOM_LEFT
            })
        }
    }

    // const loginOauth = async (provider) => {
    //     try {
    //         const { data, error } = await supabase.auth.signInWithOAuth({
    //             provider: provider,
    //             options: {
    //             redirectTo: "http://localhost:3000/",
    //             },
    //         });
    
    //         if (error) {
    //             throw Error(error.message);
    //         } else {
    //             return data
    //         }
            
    //     } catch (error) {
    //         console.log(error);
    //     }
    //   };

    return (
        <>
            <ToastContainer></ToastContainer>
            <Navbar />
            <div className='loginPage'>
                <div className='loginPage-header'>
                    <div className='loginPage-login'>
                        <form>
                            <h1><img src={logo} alt="" />Login to Purple</h1>
                            {newAccount ? (
                                <p>✅ Your account has been created, now please log in with your email and password.</p>
                            ) : (
                                <p>Use either email or username to Sign in.</p>
                            )}
                            <input ref={emailRef} type='text' placeholder={newAccount ? 'Email' : 'Email or Username'} required/>
                            <input ref={passwordRef} type={(
                                showPassword ? 'text' : 'password')} placeholder='Password' required
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
                        {/* <div className='signUp-division'>
                            <span></span>
                            <p>or</p>
                            <span></span>
                        </div> */}
                        {/* Coming very Soon... */}
                        {/* <div className="signUpProviders">
                            <button
                                onClick={async()=>{
                                    await loginOauth('facebook')
                                }}
                                className='facebook'
                            ><img src={FacebookIcon}/><p>Login with Facebook</p></button>
                            <button
                                onClick={async()=>{
                                    await loginOauth('google')
                                }}
                                className='google'
                            ><img src={GoogleIcon}/><p>Login with Google</p></button>
                            <button className='apple'><img src={AppleIcon}/><p>Login with Apple</p></button>
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

export default Login;