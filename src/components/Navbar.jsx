import { Link } from 'react-router-dom'
import logo from '../assets/logo2.png'
import avatar from '../assets/basedProfile.png'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { unSetUser } from '../redux/slice/userSlice'
import { supabase } from '../lib/supabaseClient'

function Navbar() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null)

    const handleLogout = async () => {
        dispatch(unSetUser());
        await supabase.auth.signOut();
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const getProfilePhoto = async (profile_id) => {
        try {
            let filepath = String(profile_id + '/profile')
            const {data} = supabase.storage.from('profile_photos').getPublicUrl(filepath)
            if(data){
                console.log(data);
                setProfilePhoto(data.publicUrl)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(user){
            getProfilePhoto(user.id)
        }
    })
    

    return (
        <nav className={`navbar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to='/' className='homeLink'>
            <div className="navbar-brand">
                <img src={logo} className="logo" alt="" />
                <span>My Purple Space</span>
            </div>
        </Link>

        <div className={`mobile-menu-icon ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
        </div>

        <ul className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {user ? (
                <>
                    <li>
                        <Link to="/">
                            <i className="fas fa-home"></i> Home
                        </Link>
                    </li>
                    <li>
                        <Link to={'/friends/' + user.id}>
                            <i className="fas fa-user-friends"></i> Friends
                        </Link>
                    </li>
                    <li>
                        <Link to={'/profile/' + user.id} onClick={()=>{
                            setTimeout(()=>{
                                window.location.reload()
                            }, 100)
                        }} style={{alignItems: 'center', display: 'inline-flex'}}>
                            <img className='profileLinkImg'  src={profilePhoto ? (profilePhoto) : (avatar)} onError={()=>{
                                setProfilePhoto(null)
                                return avatar
                            }}/>Profile
                        </Link>
                    </li>
                    <li>
                        <Link onClick={handleLogout} to="/">
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </Link>
                    </li>
                </>
                ) : (
                <>
                    <li>
                        <Link to="/login">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </Link>
                    </li>
                    <li>
                        <Link to="/signup">
                            <i className="fas fa-user-plus"></i> Sign Up
                        </Link>
                    </li>
                </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar