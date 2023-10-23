import { useEffect, useState } from "react";
import based_profileImg from '../assets/basedProfile.png'
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Components
import PostOptions from "./PostOptions";

// modals
import EditPostModal from '../modals/EditPostModal';


// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { duration } from "moment/moment";

const PostCard = (props) => {
    const [post, setPost] = useState(props.postData);
    const [showEmojis, setShowEmojis] = useState(false)
    const [profile_photo, setProfilePhoto] = useState(false)
    // Comments states
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [btnCommentText, setBtnCommentText] = useState('Write Comment')
    const [commentText, setCommentText] = useState('')
    const [nComments, setnComments] = useState(null)
    // Media States
    const [images, setImages] = useState(null)
    // likes states
    const [likes, setLikes] = useState(null)
    const [nLikes, setnLikes] = useState(null)
    const [wasLiked, setWasLiked] = useState(false)
    // dislikes states
    const [dislikes, setDislikes] = useState(null)
    const [nDislikes, setnDislikes] = useState(null)
    const [wasDisliked, setWasDisliked] = useState(false)

    const [showEditPost, setShowEditPost] = useState(false)

    // Framer Motion
    const control = useAnimation()
    const [motionRef, inView] = useInView({
        threshold: 0
    })

    // Options Box
    const [showOptions, setShowOptions] = useState(false)
    function closeOptions(){
        setShowOptions(false)
    }


    const user = useSelector(state => state.user.user)
    const user_id = user.id

    const author = post.author;
    const postDate = post.date;
    const postContent = post.content;
    const author_id = post.user_id;
    const post_id = post.id
    

    const addEmoji = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((el) => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        setCommentText(commentText + emoji)
    }

    console.log(props);


    const insertNewParentComment = async (user_id, post_id, comment) => {
        const { error } = await supabase.from('comments').insert({
            body: comment,
            post_id: post_id,
            user_id: user_id
        })

        if(error){
            console.log(error);
        }

        if(!error){
            setShowCommentForm(!showCommentForm)
            toast.success('Comment Posted!🎉', {
                position: toast.POSITION.TOP_RIGHT
            });
            getAmountComments(post_id)
        }
    }

    const getAmountComments = async (post_id) => {
        try {
            const {data, e} = await supabase.from('comments').select().eq('post_id', post_id)
            if(data){
                let nComments = 0
                for(let i=0; i<data.length; i++){
                    if(Number(data[i].post_id) === post_id){
                        nComments++
                    }
                }
                setnComments(nComments)
            }
            if(e){
                console.log(e);
            }
        } catch (e) {
            console.log(e); 
        }
    }

    const getVotes = async (post_id) => {
        try {
            const {data, e} = await supabase.from('post_votes').select().eq('post_id', post_id)
            if(data){
                let likes = []
                let dislikes = []
                // Get all the votes from post
                for(let i=0; i<data.length; i++){
                    if(Number(data[i].post_id) == Number(post_id)){
                        if(Number(data[i].voteType) === -1){
                            dislikes.push(data[i])
                        }
                        if(Number(data[i].voteType) === +1 ){
                            likes.push(data[i])
                        }
                        else{
                            setWasLiked(false)
                            setWasDisliked(false)
                        }
                    }
                }
                setLikes(likes)
                setnLikes(likes.length)
                setDislikes(dislikes)
                setnDislikes(dislikes.length)
            }
            if(e){
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const votePost = async (post_id, voteType) => {
        if(voteType === 1){

        }
        try {
            const {e} = await supabase.from('post_votes').insert({
                post_id: post_id,
                user_id: user_id,
                voteType: voteType
            })
            if(e){
                console.log(e);
            }
            else{
                getVotes(post_id)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const undoVote = async (post_id, voteType) => {
        try {
            const {data, e} = await supabase.from('post_votes').select().eq('post_id', post_id)
            if(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].user_id === user_id){
                        if(data[i].voteType === voteType){
                            const {e} = await supabase.from('post_votes').delete().eq('id', data[i].id)
                            if(e){
                                console.log(e);
                            }
                            else{
                                getVotes(post_id)
                            }
                        }
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

    const checkIfLikedAndDisliked = async (post_id) => {
        try {
            const {data, e} = await supabase.from('post_votes').select().eq('post_id', post_id)
            if(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].user_id === user_id){
                        if(data[i].voteType === 1){
                            setWasLiked(true)
                        }
                        else if(data[i].voteType === -1){
                            setWasDisliked(true)
                        }
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

    const getProfilePhoto = async (profile_id) => {
        try {
            let filepath = String(profile_id + '/profile')
            const {data} = supabase.storage.from('profile_photos').getPublicUrl(filepath)
            if(data){
                setProfilePhoto(data.publicUrl)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getPostMedia = async(postMedia)=>{
        if(postMedia){
            let media = postMedia
            let new_images = []
            for(let i=0;i<media.length; i++){
                const {data:mediaUrl} = supabase.storage.from('post_photos').getPublicUrl(media[i])
                if(mediaUrl){
                    new_images.push(mediaUrl)
                }
            }
            setImages(new_images)
        }
    }

    const calculateTimeDifference = (timePost) => {
        const startDate = new Date(timePost);
        const currentTime = new Date();
        const difference = currentTime.getTime() - startDate.getTime();
        
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days === 0) {
            if (hours === 0) {
                if (minutes === 0) {
                    if (seconds === 0) {
                        return 'Just now';
                    } else {
                        return `${seconds} ${seconds === 1 ? 'sec' : 'secs'} ago`;
                    }
                } else {
                    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
                }
            } else {
                return `${hours} ${hours === 1 ? 'hour' : 'hrs'} ago`;
            }
        } else if (days === 1) {
            return '1 day ago';
        } else {
            return `${days} days ago`;
        }
    };

    const motionVariant = {
        visible: {opacity: 1, scale: 1, transition: {duration: 0.3}, delay: {duration: 0}},
        hidden: {opacity: 0, scale: 0, transition: {duration: 0}}
    }

    const current_time = post.created_at
    const timeDiff = calculateTimeDifference(current_time);

    function closeEditPostModal(){
        setShowEditPost(false)
    }

    function openEditPostModal(){
        setShowEditPost(true)
    }


    useEffect(() => {
        getAmountComments(post_id)
        getVotes(post_id)
        checkIfLikedAndDisliked(post_id)
        getProfilePhoto(author_id)
        if(post.media){
            getPostMedia(post.media)
        };
        if(inView){
            control.start('visible')
        }
        else{
            control.start('hidden')
        }
    }, [control, inView])

    return (
        <motion.div
        ref={motionRef}
        animate={control}
        variants={motionVariant}
        initial='hidden'
        exit='visible'
        className="post-card">
            {/* Header */}
            <div className="post-card-header">
                <Link className="userLink" to={'/profile/' + author_id}>
                    <img className="avatar" src={profile_photo} onError={(e)=>{
                        e.target.src = based_profileImg
                        e.onError = null
                    }}/>
                </Link>
                <span className="spanAuthor"><Link className="userLink" to={'/profile/' + author_id}><h4 className="post-author">{author}</h4></Link><p>{timeDiff}</p></span>
                <div className="right-postCard">
                    <a className="optionsBtn" onClick={() => {setShowOptions(!showOptions)}}>{showOptions ? (<i class="fa-solid fa-xmark"></i>) : (<i className="fa-solid fa-ellipsis"></i>)}</a>
                    {showEditPost && <EditPostModal postData={props} closeEditPostModal={closeEditPostModal}></EditPostModal>}
                    {showOptions && <PostOptions data={post} openEditPostModal={openEditPostModal} closeEditPostModal={closeEditPostModal} closeOptions={closeOptions}></PostOptions>}
                </div>
                <ToastContainer></ToastContainer>
            </div>
            {/* Body */}
            <div className="post-card-body">
                <Link style={{textDecoration: 'none', color: 'whitesmoke'}} to={'/posts/' + post_id}>
                    {/* Content TEXT */}
                    <div className="post-card-body-inner">
                        <p>{postContent}</p>
                    </div>
                </Link>
            </div>
            {/* Media */}
            {images && (
                <Link style={{textDecoration: 'none', color: 'whitesmoke'}} to={'/posts/' + post_id}>
                    <div className="media">
                        {images.map((src) => {
                            console.log(src);
                            return <img className="img-post" src={src.publicUrl}></img>
                        })}
                    </div>
                </Link> 
            )}
            {/* Reactions */}
            <div className="reactions">
                <div className="likes">
                    <a onClick={(e) => {
                        setWasLiked(!wasLiked)
                        {wasLiked ? (undoVote(post_id, 1)) : (votePost(post_id, 1))}
                    }}>{wasLiked ? <i class="fa-solid fa-thumbs-up"></i>:<i class="fa-regular fa-thumbs-up"></i>}<p className="nLikes">{nLikes}</p></a>
                    <a onClick={(e) => {
                        setWasDisliked(!wasDisliked)
                        {wasDisliked ? (undoVote(post_id, -1)) : (votePost(post_id, -1))}
                    }}>{wasDisliked ? <i class="fa-solid fa-thumbs-down"></i>:<i class="fa-regular fa-thumbs-down"></i>}<p className="nLikes">{nDislikes}</p></a>
                </div>
                <div className="comments">
                    <a onClick={(e) => {
                        e.preventDefault()
                        if(!showCommentForm){
                            setBtnCommentText('Hide Form')
                        }else{
                            setBtnCommentText('Write Comment')
                        }
                        setShowCommentForm(!showCommentForm)
                    }}><i class="fa-regular fa-comment"></i><p className="nComments">{nComments}</p></a>
                </div>
            </div>
            {/* Write Comment */}
            {showCommentForm && <div className="comment-field">
                <textarea value={commentText} onChange={(e) => {setCommentText(e.target.value)}} className="commentsIconPicker" type="text" />
                <div className="btn-comment">
                    <button onClick={() => {setShowEmojis(!showEmojis)}} className="extra-content-btn"><i class="fa-solid fa-face-smile"></i></button>
                    <button onClick={(e) => {
                        e.preventDefault()
                        insertNewParentComment(user.id, post_id, commentText)
                    }} className="postCommentBtn"><i class="fa-solid fa-paper-plane"></i>Post</button>
                </div>
                {showEmojis && <div className="emojiPicker">
                    <Picker data={data} emojiSize={18} emojiButtonSize={28} onEmojiSelect={addEmoji} />
                </div>}
            </div>}
        </motion.div>
    )
}

export default PostCard;

