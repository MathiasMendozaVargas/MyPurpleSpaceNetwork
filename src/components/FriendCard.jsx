// importing libraries
import { useState } from 'react'
import avatar from '../assets/basedProfile.png'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FriendCard = (data) => {

    const [ friend, setFriend ] = useState(data)
    const [ showModal, setShowModal ] = useState(false)

    const fullName = friend.data.first_name + ' ' + friend.data.last_name
    const username = friend.data.username
    const friend_id = friend.data.user_id

    let logged_user = useSelector(state => state.user.user)
    let loggedUserId = logged_user.id

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
                    toast.success('Friend Deleted!', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Link to={'/profile/' + friend_id}>
            <div className="friend-card">
                <img src={avatar} alt="" />
                <div className="friend-info">
                    <p className='fullName'>{fullName}</p>
                    <p className='username'>@{username}</p>
                </div>
                <div className="friends-btns">
                    <button onClick={(e) => {
                        e.preventDefault()
                        setShowModal(true)
                    }} className='deleteBtn'><i className="fa-solid fa-user-xmark"></i>Delete Friend</button>
                    { showModal && (
                        <div className="deleteModal">
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
                        </div>
                    )}
                </div>
                <ToastContainer></ToastContainer>
            </div>
        </Link>
    )
}

export default FriendCard;