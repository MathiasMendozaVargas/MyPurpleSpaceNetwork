// importing libraries
import { useState } from 'react'
import avatar from '../assets/basedProfile.png'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useSelector } from 'react-redux'

const FriendCard = (data) => {

    const [ friend, setFriend ] = useState(data)

    const fullName = friend.data.first_name + ' ' + friend.data.last_name
    const username = friend.data.username
    const friend_id = friend.data.user_id

    let logged_user = useSelector(state => state.user.user)
    let loggedUserId = logged_user.id

    // Delete a friend
    const deleteFriend = async (loggedUserId, current_user_id) => {
        // Get friend list of current logged in user
        const { data, error } = await supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            console.log(data);
            for(let i=0; i<data.length; i++){
                // Double layer of security to make sure that only the owner can remove other users as their friends
                if(data[i].user_id === loggedUserId){
                    // Remove friend from array
                    let updatedList = []
                    for(let j=0;j<data[i].friends.length; j++){
                        if(data[i].friends[j] !== current_user_id){
                            updatedList.push(data[i].friends[j])
                        }
                    }
                    // Send request to update DB with new list
                    try{
                        // updating user's friends list on database
                        const { data, error } = await supabase.from('users_data').update({
                            friends: updatedList
                        })
                        .eq('user_id', loggedUserId)
                        
                        // check for errors
                        if(error){
                            console.log(error);
                        }

                        if(!error){
                            window.location.reload()
                        }
                        // catch errors
                    } catch(e){
                        console.log(e);
                    }
                }
            }
        }
    }

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
                        deleteFriend(loggedUserId, friend_id)
                    }} className='deleteBtn'><i className="fa-solid fa-user-xmark"></i>Delete Friend</button>
                </div>
            </div>
        </Link>
    )
}

export default FriendCard;