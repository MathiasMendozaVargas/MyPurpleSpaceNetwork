import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Post Card Component
import PostCard from '../components/PostCard';

// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


// Login Page Template
const SavedPostsView = (props) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [showEmojis, setShowEmojis] = useState(false)
    const [postText, setPostText] = useState(props.postData.content)
    

    // Post References
    const user_id = user.id

    const addEmoji = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((el) => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        setPostText(postText + emoji)
    }

    // Get all the Saved Posts from the User's metadata and then get the postdata by the post_id
    const getAllSavedPosts = async (post_id, user_id) => {
        try {
            const {data:metadata, error} = await supabase.from('users_data').select().eq("user_id", user_id)
            if(error){
                console.log(error);
            }
            if(metadata){
                console.log(metadata);
                // for(let i=0; i<metadata.length)
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(!user){
        return null
    }

    useEffect(() => {
        getAllSavedPosts(props.postData.post_id, user_id)
    })

    return (
        <div className="savedPost-view">
            {/* <PostCard></PostCard> */}
        </div>
    )
}

export default SavedPostsView;