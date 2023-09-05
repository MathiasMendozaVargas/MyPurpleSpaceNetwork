
import Navbar from "../components/Navbar";

import based_profileImg from '../assets/basedProfile.png'
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSelector } from "react-redux";

import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

// assets
import friendsIcon from '../assets/users-alt.svg'
import deleteFriendIcon from '../assets/delete-user.webp'
import addFriendIcon from '../assets/user-plus.svg'
import { current } from "@reduxjs/toolkit";


// Profile Page

const Profile = () => {

    const { profile_id } = useParams()
    const logged_user = useSelector(state => state.user.user)

    let isLoggedUser = false

    if(profile_id === logged_user.id){
        isLoggedUser = true
    }

    const navigate = useNavigate()

    const [ user_data, set_user_data] = useState(null)
    const [ user_posts, set_user_posts ] = useState(null)
    const [ isFriend, set_isFriend ] = useState(false)
    const [ current_friendsList, set_current_friendsList] = useState(null)

    ////// Get User Metadata //////
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

    ////// Check Relation //////
    const checkRelation = async (loggedUserId, current_user_id) => {
        const { data, error } = await supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === loggedUserId){
                    let allLoggedUserFriends = data[i].friends

                    // Check whether the currently authenticated User has a friendship with this particular user or not
                    for(var x=0; x<allLoggedUserFriends.length; x++){
                        if(allLoggedUserFriends[x] === current_user_id){
                            //Current User and friend are friends
                            set_isFriend(true)
                        }
                    }
                }
                else{
                    console.log('Nothing found...');
                }
            }
        }
    }

    ////// Add Friend //////
    const addFriend = async (loggedUserId, current_user_id) => {
        try {
            // Get the logged-in user's data
            const { data: usersData, error } = await supabase
                .from('users_data')
                .select()
                .eq('user_id', loggedUserId);
    
            if (error) {
                console.error(error);
                return;
            }
    
            if (usersData.length === 0) {
                console.log('Logged-in user not found.');
                return;
            }
    
            const loggedUser = usersData[0];
            const currentFriends = loggedUser.friends || [];
    
            if (currentFriends.includes(current_user_id)) {
                console.log('User is already a friend!');
                return;
            }
    
            const updatedFriends = [...currentFriends, current_user_id];
    
            // Update the friend list in the database
            const { error: updateError } = await supabase
                .from('users_data')
                .update({ friends: updatedFriends })
                .eq('user_id', loggedUserId);
    
            if (updateError) {
                console.error(updateError);
                return;
            }
    
            // Reload the page to reflect the changes
            window.location.reload();
            console.log('Friend added successfully.');
        } catch (e) {
            console.error(e);
        }
    };

    // Get all Current User's friends
    const getAllFriends = async (current_user_id) => {
        try {
            const {data, error} = await supabase.from('users_data').select()

            // check for db errors
            if(error){
                console.log(error);
            }

            if(data){
                // set Current Friends List state
                set_current_friendsList(data)
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    ////// Get all User's Posts //////
    const getAllPostofUser = async (current_user_id) => {
        const { data, error } = await supabase.from('posts').select().eq('user_id', current_user_id).order('created_at', { ascending: false })
    
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

        // Get all Posts
        getAllPostofUser(profile_id)

        // Get User Metadata
        getUserMetaData(profile_id);

        // Check relation between current profile with authenticated User
        checkRelation(logged_user.id, profile_id)

    }, [])


    if(!user_data) {
        return <h1>Loading...</h1>
    }

    return (
        <>
        <Navbar />
        <div className="profile">
            <div className="profile-header">
                <img src={based_profileImg} alt="" />
            </div>
            <div className="profile-content">
                <div className="profile-content-info">
                    <span className="profileInfoSpan">
                        <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                        { isLoggedUser ? (
                            <Link to={'/editProfile/' + profile_id}><a><i className="fa-solid fa-pen"></i></a></Link>   
                        ) : isFriend ? (
                            <span className="isFriend"><img className="actionIsFriendIcon" src={friendsIcon}></img> Friends</span>
                        ): (
                            <button className="actionFriendIcon" onClick={(e) => {
                                e.preventDefault();
                                addFriend(logged_user.id, profile_id);
                            }}><img src={addFriendIcon}></img></button>
                        )}
                    </span>
                    
                    <h4>Username: {user_data.username}</h4>
                    <h4>Age: {user_data.age}</h4>
                    <h4>Gender: {(user_data.gender).toUpperCase()}</h4>
                    <h2>Contact Info</h2>
                    <h4>Email: exampleemail14@gmail.com</h4>
                    
                </div>
                <div className="profile-content-posts">
                    { user_posts ? (
                        user_posts.map((post) => {
                            return <PostCard key={post.id} postData={post}/>
                        })
                    ) : (
                        <h2 style={{textAlign: 'center', marginTop: '50px'}}>{user_data.first_name + ' ' + user_data.last_name + ' '} hasn't purple anything!</h2>
                    ) }
                    
                </div>
            </div>
        </div>
        <div className="floatingBtn">
                <button onClick={() => {
                    navigate('/createNewPost')
                }}><i className="fa-solid fa-pen-to-square"></i></button>
            </div>
        </>
    )
}


export default Profile;