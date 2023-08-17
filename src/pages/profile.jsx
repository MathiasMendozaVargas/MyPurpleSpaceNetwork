
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

        console.log("Heloooooooo");

        // Get friend list of current logged in user
        const { data, error } = await supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            for(var i=0; i<data.length; i++){
                // double layer of security from authentication
                if(data[i].user_id === loggedUserId){
                    // Check if the current user is not already a friend
                    var checkIfAlreadyFriends = false
                    for(var i=0; data[i].friends.length; i++){
                        if(current_user_id === data[i].user_id){
                            checkIfAlreadyFriends = true
                        }
                    }
                    if(checkIfAlreadyFriends){
                        // Get frends list and push new friend
                        let new_friends_list = data[i].friends
                        new_friends_list.push(current_user_id)

                        // Update friends list on the database
                        const { error } = await supabase
                            .from('users_data')
                            .update({ friends: new_friends_list })
                            .eq({ user_id: loggedUserId })
                        
                        if(error){
                            console.log(error);
                        }
                        else{
                            // Reload page so we get the new data and our new friend added up 
                            window.location.reload();
                        }
                    }
                }
            }
        }
    }

    // Delete a friend
    const deleteFriend = async (loggedUserId, current_user_id) => {
        // Get friend list of current logged in user
        const { data, error } = supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            for(let i=0; i<data.length; i++){
                // Double layer of security to make sure that only the owner can remove other users as their friends
                if(data[i].user_id === loggedUserId){
                    // Remove friend from array
                    let updatedList = []
                    for(let j=0;j<data[i].frinds.length; j++){
                        if(!((data[i].friend[j] == current_user_id))){
                            updatedList.push(data[i].friend[j])
                        }
                    }
                    // Send request to update DB with new list
                    try{
                        // updating user's friends list on database
                        const { error } = await supabase.from('users_data').update({
                            friends: updatedList
                        })
                        .eq('user_id', current_user_id)
                        
                        // check for errors
                        if(error){
                            console.log(error);
                        }
                        // catch errors
                    } catch(e){
                        console.log(e);
                    }
                }
            }
        }
    }

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
                        <span className="profileInfoSpan">
                            <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                            { isLoggedUser ? (
                                <Link to={'/editProfile/' + profile_id}><a><i class="fa-solid fa-pen"></i></a></Link>   
                            ) : isFriend ? (
                                <span className="isFriend"><img className="actionFriendIcon" src={friendsIcon}></img> Friends</span>
                            ): (
                                <button onClick={() => { addFriend(logged_user.id, profile_id); } }><img className="actionFriendIcon" src={addFriendIcon}></img></button>
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
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </>
        )
    }
}


export default Profile;