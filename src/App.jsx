import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from './lib/supabaseClient'

// importing pages components
import Home from './pages/home'
import Login from './pages/login'
import SignUp from './pages/signUp'
import About from './pages/about'
import ConfigNewUser from './pages/configNewUser';
import CreatePost from './pages/createPost';
import Friends from './pages/friends';
import Profile from './pages/profile'
import EditProfile from './pages/editProfile';
import PostView from './pages/postView';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const user = useSelector(state => state.user.user)
  const [accountWasSetup, setAccountWasSetup] = useState(false)
  
  // Private Routing
  const PrivateRoute = ({ user }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    
    return <Outlet />
    
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path='/createNewPost' element={<CreatePost/>} />
          <Route path='/friends/:profile_id' element={<Friends/>} />
          <Route path='/profile/:profile_id' element={<Profile/>} />
          <Route path='/editProfile/:profile_id' element={<EditProfile/>} />
          <Route path='/posts/:post_id' element={<PostView/>}></Route>
        </Route>
        
        <Route path='/configNewUser' element={<ConfigNewUser/>} />
        <Route path="/login/:newAccount?" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;