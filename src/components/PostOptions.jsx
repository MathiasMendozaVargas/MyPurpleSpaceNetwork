import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// modals
import EditPostModal from '../modals/EditPostModal';

function PostOptions(props) {
    let post_data = props.data.postData

    const logged_user = useSelector(state => state.user.user)
    const [isFriend, setIsFriend] = useState(false)
    const [showEditPost, setShowEditPost] = useState(false)

    let isAuthor = false
    if(post_data.user_id === logged_user.id){
        isAuthor = true
    }

    const verifyIsFriend = async(another_id) => {
        try {
            let {data, e} = await supabase.from('users_data').select().eq('user_id', logged_user.id)
            if(data){
                data = data[0]
                if(data.friends.length > 1){
                    for(let i=0; i<data.friends.length; i++){
                        if(data.friends[i] === another_id){
                            setIsFriend(true)
                        }
                    }
                }
                else{
                    if(data.friends[0] === another_id){
                        setIsFriend(true)
                    }
                }
            }
            if(e){
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

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
            window.location.reload();
            console.log('Friend added successfully.');
        } catch (e) {
            console.error(e);
        }
    };

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
                    window.location.reload()
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    function closeModal(){
        setShowEditPost(false)
    }

    useEffect(() => {
        verifyIsFriend(post_data.user_id)
    }, [])


    if(isAuthor){
        return (
            <>
                {showEditPost && <EditPostModal postData={post_data} closeModal={closeModal}></EditPostModal>}
                <div className="box-connector"></div>
                <div className="options-post">
                    <button onClick={(e) => {
                        e.preventDefault()
                        setShowEditPost(true)
                    }}><p><i class="fa-solid fa-pen"></i> Edit Post</p></button>
                    <button><p><i class="fa-solid fa-trash-can"></i> Delete Post</p></button>
                    <button><p><i class="fa-regular fa-bookmark"></i> Save Post</p></button>
                </div>
            </>
        )
    }
    if(!isAuthor){
        return(
            <>
                <div className="box-connector"></div>
                <div className="options-post">
                    <button><p><i class="fa-regular fa-bookmark"></i> Save Post</p></button>
                    {isFriend ? (<button onClick={() => {deleteFriend(logged_user.id, post_data.user_id)}}><p><i class="fa-solid fa-user-xmark"></i> Delete {post_data.author} from Friends!</p></button>) : (
                        <button onClick={() => {addFriend(logged_user.id, post_data.user_id)}}><p><i class="fa-solid fa-user-plus"></i> Add {post_data.author} as Friend!</p></button>
                    )}
                </div>
            </>
        )
    }
}

export default PostOptions