
import Navbar from "../components/Navbar";

import based_profileImg from '../assets/basedProfile.png'
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSelector } from "react-redux";

import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

// Modals
import CreatePostModal from "../modals/CreatePostModal";
import EditProfilePhoto from "../modals/EditProfilePhoto";

// Components
import SavedPostsView from "../components/SavedPostsView";

// assets
import friendsIcon from '../assets/users-alt.svg'
import deleteFriendIcon from '../assets/delete-user.webp'
import addFriendIcon from '../assets/user-plus.svg'
import { current } from "@reduxjs/toolkit";


// Profile Pages

const Profile = () => {

    const { profile_id } = useParams()
    const logged_user = useSelector(state => state.user.user)

    let isLoggedUser = false

    if(profile_id === logged_user.id){
        isLoggedUser = true
    }

    const navigate = useNavigate()

    const [ user_data, set_user_data] = useState(null)
    const [profile_photo, setProfilePhoto] = useState(null)
    const [ user_posts, set_user_posts ] = useState(null)
    const [saved_posts, setSavedPosts] = useState(null)
    const [numberFriends, setNumberFriends] = useState(null)
    const [ isFriend, set_isFriend ] = useState(false)
    const [showCreatePostModal, setShowCreatePostModal] = useState(false)
    const [showPosts, setShowPosts] = useState(true)
    const [showSaved, setShowSaved] = useState(false)
    const [activeLeft, setActiveLeft] = useState(true)
    const [showEditProfilePhoto, setShowEditProfilePhoto] = useState(false)

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

    // Get Number of Friends of the Current User
    const getNumberFriends = async (current_user_id) => {
        try {
            let n_friends = 0
            const {data, e} = await supabase.from('users_data').select('friends').eq('user_id', current_user_id)
            if(data){
                n_friends = data[0].friends.length
                setNumberFriends(n_friends)
            }
            if(e){
                console.log(e);
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

    // Get all the Saved Posts from the User's metadata and then get the postdata by the post_id
    const getAllSavedPosts = async (user_id) => {
        try {
            const {data:metadata, error} = await supabase.from('users_data').select().eq("user_id", user_id)
            if(error){
                console.log(error);
            }
            if(metadata){
                let id_list = metadata[0].savedPosts
                let saved_list = []
                for(let i=0; i<id_list.length; i++){
                    try {
                        let {data, e} = await supabase.from('posts').select().eq('id', Number(id_list[i]))
                        if(data){
                            saved_list.push(data[0])
                        }
                        if(e){
                            console.log(e);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                setSavedPosts(saved_list)
            }
        } catch (error) {
            console.log(error);
        }
    }

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

    function closeCreatePostModal() {
        setShowCreatePostModal(false)
    }

    function closeEditProfilePicModal() {
        setShowEditProfilePhoto(false)
    }


    useEffect(() => {

        // Get all Posts
        getAllPostofUser(profile_id)

        // Get User Metadata
        getUserMetaData(profile_id);
        getProfilePhoto(profile_id)

        // Get Number of Friends
        getNumberFriends(profile_id)

        // Check relation between current profile with authenticated User
        checkRelation(logged_user.id, profile_id)

        // Get Saved Posts
        getAllSavedPosts(logged_user.id)
    }, [])


    if(!user_data) {
        return <h1>Loading...</h1>
    }

    return (
        <>
        <Navbar />
        <div className="profile">
            <div className="container">
                <div className="profile-header"></div>
                <div className="header-container">
                    <div className="profile-pic">
                        <img src={profile_photo} onError={()=>{
                            setProfilePhoto(null)
                            return based_profileImg
                        }}/>
                        {isLoggedUser && <a onClick={(e)=>{
                            e.preventDefault()
                            setShowEditProfilePhoto(true)}}><i class="fa-solid fa-camera"></i></a>}
                    </div>
                    {showEditProfilePhoto && <EditProfilePhoto profile_photo={profile_photo} getProfilePhoto={getProfilePhoto} closeModal={closeEditProfilePicModal}></EditProfilePhoto>}
                    <div className="profile-info">
                        <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                        <h4>Has {numberFriends} friends!</h4>
                    </div>
                    <div className="profile-btns">
                        <button><i class="fa-solid fa-people-group"></i> All Friends</button>
                        {isLoggedUser && <Link to={'/editProfile/'+profile_id}><button><i class="fa-solid fa-pen"></i> Edit Profile</button></Link>}
                    </div>
                </div>
            </div>
            <div className="profile-content-posts">
                <div className="head-container">
                    <div className="switcher-menu">
                        <a className={activeLeft ? ('active-left') : ('')} onClick={(e) => {
                            e.preventDefault();
                            setActiveLeft(true)
                            setShowPosts(true);
                            setShowSaved(false)
                        }}>My Posts</a>
                        <a className={activeLeft ? ('') : ('active-right')} onClick={(e) => {
                            e.preventDefault();
                            setActiveLeft(false)
                            setShowPosts(false);
                            setShowSaved(true);
                        }}>Saved Posts</a>
                    </div>
                </div>
                {showPosts && (
                    user_posts ? (
                        <div className="display-posts">
                            {user_posts.map((post) => {
                                return <PostCard key={post.id} postData={post} />;
                            })}
                        </div>
                    ) : (
                        <h2 style={{ textAlign: 'center', marginTop: '50px' }}>
                        {user_data.first_name + ' ' + user_data.last_name + " hasn't posted anything!"}
                        </h2>
                    )
                )}
                {showSaved && (
                    saved_posts ? (
                        <div className="display-posts">
                            {saved_posts.map((post) => {
                                return <PostCard key={post.id} postData={post} />;
                            })}
                        </div>
                    ) : (
                        <h2 style={{ textAlign: 'center', marginTop: '50px' }}>No Saved Posts Yet!</h2>
                    )
                )}
                
            </div>
        </div>
        {showCreatePostModal && <CreatePostModal closeModal={closeCreatePostModal}></CreatePostModal>}
        <div className="floatingBtn">
                <button onClick={(e) => {
                    e.preventDefault()
                    setShowCreatePostModal(!showCreatePostModal)
                }}><i className="fa-solid fa-pen-to-square"></i></button>
            </div>
        </>
    )
}


export default Profile;