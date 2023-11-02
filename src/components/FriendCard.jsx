// importing libraries
import { useEffect, useState } from 'react'
import avatar from '../assets/basedProfile.png'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'


const FriendCard = (data) => {

    const [ friend, setFriend ] = useState(data)
    const [ showModal, setShowModal ] = useState(false)
    const [ profilePhoto, setProfilePhoto] = useState(null)

    const fullName = friend.data.first_name + ' ' + friend.data.last_name
    const username = friend.data.username
    const friend_id = friend.data.user_id

    let logged_user = useSelector(state => state.user.user)
    let loggedUserId = logged_user.id

    // Framer Motion
    const [motionRef, inViewCard] = useInView()
    const [modalRef, inViewModal] = useInView()
    const controlCard = useAnimation()
    const controlModal = useAnimation()

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
                } else{
                    // Reload the page to reflect the changes
                    toast.success('Friend deleted! 🗑️', {
                        position: toast.POSITION.BOTTOM_LEFT
                    })
                    setTimeout(()=>{
                        window.location.reload()
                    }, 2000)
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

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

    const variants = {
        visible: {opacity: 1, scale: 1, transition: {duration: 0.3}, delay: {duration: 0}},
        hidden: {opacity: 0, scale: 0, transition: {duration: 0.3}, delay: {duration: 0}}
    }

    useEffect(()=>{
        getProfilePhoto(friend_id)

        if(inViewCard){
            controlCard.start('visible')
        }else{
            controlCard.start('hidden')
        }

        if(inViewModal){
            controlModal.start('visible')
        }else{
            controlModal.start('hidden')
        }

    }, [controlCard, controlModal, inViewCard, inViewModal])

    return (
        <motion.div
            ref={motionRef}
            initial='hidden'
            exit='visible'
            animate={controlCard}
            variants={variants}
        >
            <Link to={'/profile/' + friend_id} style={{textDecoration:'none'}}>
                <div className="friend-card">
                    {profilePhoto ? (
                        <img src={profilePhoto} onError={()=>{
                            setProfilePhoto(null)
                            return avatar
                        }}/>
                    ): (
                        <img src={avatar} />
                    )}
                    <div className="friend-info">
                        <div className="info">
                            <p className='fullName'>{fullName}</p>
                            <p className='username'>@{username}</p>
                        </div>
                        <div className="friends-btns">
                            
                            <button onClick={(e) => {
                                e.preventDefault()
                                setShowModal(true)
                            }} className='deleteBtn'><i className="fa-solid fa-user-xmark"></i>Delete Friend</button>
                            { showModal && (
                                <motion.div
                                className="deleteModal"
                                ref={modalRef}
                                initial='hidden'
                                exit='visible'
                                animate={controlModal}
                                variants={variants}
                                >
                                    <i class="fa-solid fa-face-sad-tear"></i>
                                    <h4>Are you sure you want to delete your friend?</h4>
                                    <div className="btn-container">
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setShowModal(false)
                                        }} className='no'>No</button>
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            // call the function that deletes a post and refresh page
                                            deleteFriend(loggedUserId, friend_id)
                                        }} className='yes'>Yes</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default FriendCard;