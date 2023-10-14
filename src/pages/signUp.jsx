import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

    // Framer Motion
    const control = useAnimation()
    const [formRef, inView] = useInView()


    const createNewUser = async () => {
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return alert('Passwords do not match!')
        }

        if(passwordRef.current.value < 6){
            return alert('Password must be at least 6 characters long!')
        }

        const { data: {user}, error } = await supabase.auth.signUp({
            email: emailRef.current.value,
            password: passwordRef.current.value
        })

        if(error) {
            console.log(error);
        }

        if(user){
            navigate('/login')
        }
    }

    useEffect(() => {
        const getUsers = async () => {
            const { data, error } = await supabase
            .from('users')
            .select()

            if(error){
                console.log(error);
            }
            
            console.log(data);
        }
        
        getUsers();
        
    }, []
)

    return (
        <>
            <Navbar/>
            <div className='loginPage'>
                <div className='loginPage-header'>
                    <h1 style={{marginTop:'0px'}}>Create a new Purple Account</h1>
                    <h3>Please provide your information to create an account</h3>
                    <div className='loginPage-login'>
                        <form>
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
                                }}>Sign Up</button>
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

export default SignUp;