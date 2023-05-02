
import Navbar from "../components/Navbar";

import based_profileImg from '../assets/basedProfile.png'
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSelector } from "react-redux";

import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";



// Profile Page

const Profile = () => {

    const user = useSelector(state => state.user.user)

    const navigate = useNavigate()

    const [ user_data, set_user_data] = useState(null)
    const [ user_posts, set_user_posts ] = useState(null)

    const getUserMetaData = async (current_user_id) => {
        const { data, error } = await supabase.from('users_data').select()
    
        if(error){
            console.log(error);
        }
    
        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === current_user_id){
                    set_user_data(data[i])
                }
                else{
                    console.log('Nothing found...');
                }
            }
        }
    }
    
    
    const getAllPostofUser = async (current_user_id) => {
        const { data, error } = await supabase.from('posts').select().order('created_at', { ascending: false })
    
        if (error){
            console.log(error);
        }
    
        if(data){
            const postsOfUser = []
    
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === current_user_id){
                    postsOfUser.push(data[i])
                }
            }


    
            if(postsOfUser.length <= 0){
                set_user_posts(null)
            }
    
            else{
                set_user_posts(postsOfUser)
            }
        }
    }


    useEffect(() => {
        // Get User Metadata
        getUserMetaData(user.id);

        // Get all Posts
        getAllPostofUser(user.id)
        
    }, [])


    if(!user_data) {
        return null
    }

    if(!user_posts){
        return (
            <>
                <Navbar />
                <div className="profile">
                    <div className="profile-header">
                        <img src={based_profileImg} alt="" />
                    </div>
                    <div className="profile-content">
                        <div className="profile-content-info">
                            <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                            <h4>Username: {user_data.username}</h4>
                            <h4>Age: {user_data.age}</h4>
                            <h4>Gender: {(user_data.gender).toUpperCase()}</h4>
                            <h2>Contact Info</h2>
                            <h4>Email: {user.email}</h4>
                        </div>
                        <div className="profile-content-posts">
                            <h2 style={{textAlign: 'center', marginTop: '50px'}}>{user_data.first_name + ' ' + user_data.last_name + ' '} hasn't purple anything!</h2>
                        </div>
                    </div>
                </div>
                <div className="floatingBtn">
                    <button onClick={() => {
                        navigate('/createNewPost')
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </>
        )
    }

    if(user_posts){
        return (
            <>
            <Navbar />
            <div className="profile">
                <div className="profile-header">
                    <img src={based_profileImg} alt="" />
                </div>
                <div className="profile-content">
                    <div className="profile-content-info">
                        <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                        <h4>Username: {user_data.username}</h4>
                        <h4>Age: {user_data.age}</h4>
                        <h4>Gender: {(user_data.gender).toUpperCase()}</h4>
                        <h2>Contact Info</h2>
                        <h4>Email: {user.email}</h4>
                    </div>
                    <div className="profile-content-posts">
                        {user_posts.map((post) => {
                            return <PostCard key={post.id} postData={post}/>
                        })}
                    </div>
                </div>
            </div>
            <div className="floatingBtn">
                    <button onClick={() => {
                        navigate('/createNewPost')
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </>
        )
    }
}

export default Profile;