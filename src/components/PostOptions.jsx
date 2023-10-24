import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// modals
import EditPostModal from '../modals/EditPostModal';

function PostOptions(props) {
    let post_data = props.data

    const logged_user = useSelector(state => state.user.user)
    const user_id = logged_user.id
    const [isFriend, setIsFriend] = useState(false)
    // isSaved state
    const [isSaved, setIsSaved] = useState(false)

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
            toast.success('Friend added successfully! 🎊', {
                position: toast.POSITION.TOP_RIGHT
            })
            props.closeOptions()
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
                    props.closeOptions()
                    toast.success('Friend Deleted! 🗑️', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    window.location.reload()
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const deletePost = async (post_id) => {
        try {
            const {error} = await supabase.from('posts').delete().eq('id', post_id)
            if(error){
                console.log(error);
            }
            else{
                toast.success('Post Deleted Successfully! 🎊',
                {position: toast.POSITION.TOP_RIGHT})
                window.location.reload()
            }
        } catch (e) {
            console.log(e);
        }
    }

    const checkIfSaved = async (post_id, user_id) => {
        try {
            let {data, e} = await supabase.from('users_data').select().eq('user_id', user_id)
            if(data){
                data = data[0]
                for(let i=0; i<data.savedPosts.length; i++){
                    if(Number(data.savedPosts[i]) === Number(post_id)){
                        setIsSaved(true)
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

    const savePost = async (post_id, user_id) => {
        try {
            let {data: savedPosts, e: fetchE} = await supabase.from('users_data').select("savedPosts").eq('user_id', user_id)
            if(fetchE){
                console.log(fetchE);
            }
            
            if(savedPosts){
                let updatedSavedPosts = savedPosts[0].savedPosts
                updatedSavedPosts.unshift(String(post_id))
                let {error: updateError} = await supabase.from('users_data').update({
                    savedPosts: updatedSavedPosts
                }).eq('user_id', user_id)

                if(updateError){
                    console.log(updateError)
                }
                else{
                    await checkIfSaved(post_id, user_id)
                    toast.success('Post Saved Successfully🎉', {
                        position: toast.POSITION.TOP_RIGHT
                    })
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const unSavePost = async (post_id, user_id) => {
        try {
            // Fetch the user's data
            let { data: savedPosts, error: fetchError } = await supabase.from('users_data').select('savedPosts').eq('user_id', user_id);
    
            if (fetchError) {
                console.log(fetchError);
            }
    
            if (savedPosts && savedPosts.length > 0) {
                // Remove the post_id from the savedPosts array
                const updatedSavedPosts = savedPosts[0].savedPosts.filter(
                    (savedPost) => savedPost !== String(post_id)
                );
    
                // Update the user's data with the updated savedPosts array
                let { error: updateError } = await supabase
                    .from('users_data')
                    .update({
                        savedPosts: updatedSavedPosts,
                    })
                    .eq('user_id', user_id);
    
                if (updateError) {
                    console.log(updateError);
                } else {
                    toast.success('Post Unsaved Successfully 🎉', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setTimeout(()=>{
                        window.location.reload();
                    }, 3000)
                }
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        verifyIsFriend(post_data.user_id)
        checkIfSaved(post_data.id, user_id)
    }, [])

    return(
        <>
            <div className="box-connector"></div>
            <div className="options-post">
            {isAuthor ? (
                <>
                <button onClick={(e) => {
                    e.preventDefault()
                    props.openEditPostModal()
                    props.closeOptions()
                }}><p><i className="fa-solid fa-pen"></i> Edit Post</p></button>
                <button onClick={(e) => {
                    e.preventDefault()
                    deletePost(post_data.id, user_id)
                }}><p><i className="fa-solid fa-trash-can"></i> Delete Post</p></button>
                </>
            ) : (
                <>
                    {isFriend ? (
                        <button onClick={() => { deleteFriend(logged_user.id, post_data.user_id) }}>
                        <p><i className="fa-solid fa-user-xmark"></i> Delete {post_data.author} from Friends!</p>
                        </button>
                    ) : (
                        <button onClick={() => { addFriend(logged_user.id, post_data.user_id) }}>
                        <p><i className="fa-solid fa-user-plus"></i> Add {post_data.author} as Friend!</p>
                        </button>
                    )}
                </>
            )}

            {isSaved ? (
                <button onClick={(e) => {
                e.preventDefault()
                unSavePost(post_data.id, user_id)
                }}><p><i className="fa-solid fa-bookmark"></i> Saved Post</p></button>
            ) : (
                <button onClick={(e) => {
                e.preventDefault()
                savePost(post_data.id, user_id)
                }}><p><i className="fa-regular fa-bookmark"></i> Save Post</p></button>
            )}
            </div>
        </>
    )
}

export default PostOptions