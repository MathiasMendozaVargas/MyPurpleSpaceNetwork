import { Link } from 'react-router-dom'
import logo from '../assets/logo2.png'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { unSetUser } from '../redux/slice/userSlice'
import { supabase } from '../lib/supabaseClient'

function Navbar() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        dispatch(unSetUser());
        await supabase.auth.signOut();
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`navbar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-brand">
            <img src={logo} className="logo" alt="" />
            <span>My Purple Space</span>
        </div>

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
                        <Link to={'/profile/' + user.id}>
                            <i className="fas fa-user"></i> Profile
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
                        <Link to="/">
                            <i className="fas fa-info-circle"></i> About
                        </Link>
                    </li>
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