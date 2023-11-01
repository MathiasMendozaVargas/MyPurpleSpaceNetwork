
import Navbar from "../components/Navbar";
import based_profileImg from '../assets/basedProfile.png'
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";

// Modals
import CreatePostModal from "../modals/CreatePostModal";
import EditProfilePhoto from "../modals/EditProfilePhoto";

// Components
import Loading from '../components/Loading';

// 3d Model
import { StarsCanvas } from '../components/Canvas/Stars'


// Profile Pages
const Profile = () => {
    const { profile_id } = useParams()
    const logged_user = useSelector(state => state.user.user)

    let isLoggedUser = false

    if(profile_id === logged_user.id){
        isLoggedUser = true
    }

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

    // Frame Motion
    const control = useAnimation()
    const [profilePicRef, inView] = useInView({
        threshold: 0,
        triggerOnce: true
    })

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

    // Add Friend Function
    const addFriend = async (loggedUserId, current_user_id) => {
        try {
            // Get the logged-in user's data
            const { data: usersData, e } = await supabase
                .from('users_data')
                .select()
                .eq('user_id', loggedUserId);
            if(e){
                console.error(e);
            }
    
            const loggedUser = usersData[0];
            const currentFriends = loggedUser.friends || [];
    
            if(currentFriends.includes(current_user_id)) {
                console.log('User is already a friend!');
                return;
            }
    
            const updatedFriends = [...currentFriends, current_user_id];
    
            // Update the friend list in the database
            const {error: updateError} = await supabase
                .from('users_data')
                .update({ friends: updatedFriends })
                .eq('user_id', loggedUserId);
    
            if (updateError) {
                console.error(updateError);
                return;
            }
    
            // Reload the page to reflect the changes
            toast.success('Friend added successfully! 🎊', {
                position: toast.POSITION.BOTTOM_LEFT
            })
            setTimeout(()=>{
                window.location.reload()
            }, 2000)
        } catch (e) {
            console.error(e);
        }
    };

    // Delete friend function
    const deleteFriend = async (loggedUserId, current_user_id) => {
        try {
            // Fetch user data
            const { data, error } = await supabase.from('users_data').select().eq('user_id', loggedUserId);
    
            if (error) {
                console.log(error);
                return;
            }
    
            if (data && data.length === 1) {
                const user = data[0];
                
                // Remove the friend from the user's friends list
                const updatedFriends = user.friends.filter(friendId => friendId !== current_user_id);
    
                // Update the user's friends list in the database
                const { error: updateError } = await supabase.from('users_data').update({
                    friends: updatedFriends
                }).eq('user_id', loggedUserId);
    
                if (updateError) {
                    console.log(updateError);
                } else {
                    toast.success('Friend Deleted! 🗑️', {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                    setTimeout(()=>{
                        window.location.reload()
                    }, 2000)
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

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
            const {data:metadata, error} = await supabase.from('users_data').select('savedPosts').eq("user_id", user_id)
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
                            if(data[0] !== undefined){
                                saved_list.push(data[0])
                            }else{
                                // eliminate undefined or erased posts from the network from our saved posts table
                                let updated_list_to_Db = id_list
                                let idx = updated_list_to_Db.indexOf(id_list[i])
                                updated_list_to_Db.splice(idx, 1)

                                // update updated Saved Post list on DB since some of them don't exist anymore
                                try {
                                    let {e: updateError} = await supabase.from('users_data').update({
                                        savedPosts: updated_list_to_Db
                                    }).eq('user_id', user_id)

                                    if(updateError){
                                        console.log(updateError);
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        }
                        if(e){
                            console.log(e);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                if(saved_list.length > 0){
                    setSavedPosts(saved_list)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getProfilePhoto = async (profile_id) => {
        let { data: filename, error } = await supabase.storage.from('profile_photos').list(profile_id, {
            limit: 2,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })
        if(error){
            console.log(error);
        }
        if(filename){
            filename = filename[filename.length-1].name
            let filepath = `${profile_id}/${filename}`
            const {data} = supabase.storage.from('profile_photos').getPublicUrl(filepath)
            if(data){
                setProfilePhoto(data.publicUrl)
            }
        }
    }

    function closeCreatePostModal() {
        setShowCreatePostModal(false)
    }

    function closeEditProfilePicModal() {
        setShowEditProfilePhoto(false)
    }

    const zoomInVariant = {
        visible: {opacity: 1, scale: 1, transition: {duration: 0.3}, delay: {duration: 0}},
        hidden: {opacity: 0, scale: 0, transition: {duration: 0}}
    }

    // listening for profile user's id changes on route
    let current_id_user = window.location.pathname.split('/profile/').pop()

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

        if(inView){
            control.start('visible')
        }else{
            control.start('hidden')
        }
    }, [control, inView, current_id_user])


    if(!user_data) {
        return <Loading />
    }
    
    return (
        <>
        <Navbar />
        <div className="profile">
            <div className="container">
                <div className="stars-animation">
                    <StarsCanvas />
                </div>
                <div className="profile-header"></div>
                <div className="header-container">
                    <div className="profile-pic">
                        <motion.img
                            ref={profilePicRef}
                            animate={control}
                            variants={zoomInVariant}
                            initial='hidden'
                            exit='visible' 
                            src={profile_photo} onError={()=>{
                                setProfilePhoto(based_profileImg)
                        }}/>
                        {isLoggedUser && <a onClick={(e)=>{
                            e.preventDefault()
                            setShowEditProfilePhoto(true)}}><i class="fa-solid fa-camera"></i></a>}
                    </div>
                    {showEditProfilePhoto && <EditProfilePhoto profile_photo={profile_photo} getProfilePhoto={getProfilePhoto} closeModal={closeEditProfilePicModal}></EditProfilePhoto>}
                    <div className="profile-info">
                        <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                        <h4>{isLoggedUser ? 'You have ' : 'Has'} {numberFriends} friends!</h4>
                    </div>
                    <div className="profile-btns">
                        <button><i class="fa-solid fa-people-group"></i> All Friends</button>
                        {isLoggedUser ? (
                            <Link to={'/editProfile/'+profile_id}><button><i class="fa-solid fa-pen"></i> Edit Profile</button></Link>) : (
                                isFriend ? (
                                    <button onClick={()=>{deleteFriend(logged_user.id, profile_id)}}><i class="fa-solid fa-user-xmark"></i> Delete Friend</button>
                                ) : (
                                    <button onClick={()=>{addFriend(logged_user.id, profile_id)}}><i class="fa-solid fa-user-plus"></i> Add Friend</button>
                                )
                            )}
                    </div>
                </div>
            </div>
            <div className="profile-content-posts">
                <div className="head-container">
                    <div className="switcher-menu">
                        <a className={`${activeLeft ? ('active-left') : ('')} ${isLoggedUser ? ('') : ('justPosts')}`} onClick={(e) => {
                            e.preventDefault();
                            setActiveLeft(true)
                            setShowPosts(true);
                            setShowSaved(false)
                        }}>{isLoggedUser ? ('My Posts') : (`${user_data.first_name}'s Posts`)}</a>
                        {isLoggedUser && (
                            <a className={activeLeft ? ('') : ('active-right')} onClick={(e) => {
                                e.preventDefault();
                                setActiveLeft(false)
                                setShowPosts(false);
                                setShowSaved(true);
                            }}>Saved Posts</a>
                        )}
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
                                console.log(post);
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