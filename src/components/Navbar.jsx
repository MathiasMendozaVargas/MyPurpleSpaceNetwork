import { Link } from 'react-router-dom'
import logo from '../assets/logo2.png'
import { useDispatch, useSelector } from 'react-redux'

import { unSetUser } from '../redux/slice/userSlice'
import { supabase } from '../lib/supabaseClient'

function Navbar() {

    const user = useSelector(state => state.user.user)

    const dispatch = useDispatch()

    const handleLogout = async () => {
        dispatch(unSetUser())
        await supabase.auth.signOut()
    }

    if(user){
        return (
            <nav className="navbar">
                <div className="navbar-brand">
                    <img src={logo} className='logo' alt=""/>
                    <span>My Purple Space</span>
                </div>
                <ul className="navbar-nav">
                    <li><Link to="/home"><i class="fa-solid fa-house"></i> Home</Link></li>
                    <li><Link to="/friends"><i class="fa-solid fa-user-group"></i> Friends</Link></li>
                    <li><Link to={'/profile/' + user.id}><i class="fa-solid fa-user"></i> Profile</Link></li>
                    <li><Link onClick={handleLogout} to="/"><i class="fa-solid fa-right-from-bracket"></i> Logout</Link></li>
                    
                </ul>
            </nav>
        )
    }
    else{
        return (
            <nav className="navbar">
                <div className="navbar-brand">
                    <img src={logo} className='logo' alt=""/>
                    <span>My Purple Space</span>
                </div>
                <ul className="navbar-nav">
                    <li><Link to="/"><i class="fa-solid fa-globe"></i> About</Link></li>
                    <li><Link to="/login"><i class="fa-solid fa-right-to-bracket"></i> Login</Link></li>
                    <li><Link to="/signup"><i class="fa-sharp fa-solid fa-user-plus"></i> Sign Up</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Navbar