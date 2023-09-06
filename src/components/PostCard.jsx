import { useEffect, useState } from "react";
import avatar from '../assets/basedProfile.png'
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import { Link } from 'react-router-dom'

// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const PostCard = (postData) => {
    const [post, setPost] = useState(postData);
    const [showEmojis, setShowEmojis] = useState(false)
    // Comments states
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [btnCommentText, setBtnCommentText] = useState('Write Comment')
    const [commentText, setCommentText] = useState('')
    const [nComments, setnComments] = useState(null)
    // likes states
    const [likes, setLikes] = useState(null)
    const [nLikes, setnLikes] = useState(null)
    const [wasLiked, setWasLiked] = useState(false)
    // dislikes states
    const [dislikes, setDislikes] = useState(null)
    const [nDislikes, setnDislikes] = useState(null)
    const [wasDisliked, setWasDisliked] = useState(false)


    const user = useSelector(state => state.user.user)

    const author = post.postData.author;
    const postDate = post.postData.date;
    const postContent = post.postData.content;
    const user_id = post.postData.user_id;
    const post_id = post.postData.id

    const addEmoji = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((el) => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        setCommentText(commentText + emoji)
    }

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
            console.log("Comment created!");
            window.location.reload()
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
            else{
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
        try {
            const {e} = await supabase.from('post_votes').insert({
                post_id: post_id,
                user_id: user_id,
                voteType: voteType
            })
            if(e){
                console.log(e);
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
                        }
                    }
                }
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

    const current_time = post.postData.created_at
    const timeDiff = calculateTimeDifference(current_time);

    useEffect(() => {
        getAmountComments(post_id)
        getVotes(post_id)
        checkIfLikedAndDisliked(post_id)
    })

    return (
        // Gotta work on the individual post page for personalized page
        <div className="post-card">
            <div className="post-card-header">
                <img className="avatar" src={avatar} alt="" />
                <span className="spanAuthor"><Link className="userLink" to={'/profile/' + user_id}><h4 className="post-author">{author}</h4></Link><p>{timeDiff}</p></span>
                <a className="optionsBtn" href=""><i className="fa-solid fa-ellipsis"></i></a>
            </div>
            <div className="post-card-body">
                <Link style={{textDecoration: 'none', color: 'whitesmoke'}} to={'/posts/' + post_id}>
                    <div className="post-card-body-inner">
                        <p>{postContent}</p>
                    </div>
                </Link>
                <div className="reactions">
                    <div className="likes">
                        {wasLiked ? (
                            <a onClick={(e) => {
                                setWasLiked(false)
                                undoVote(post_id, 1)
                            }}><i class="fa-solid fa-thumbs-up"></i><p className="nLikes">{nLikes}</p></a>
                        ) : (
                            <a onClick={(e) => {
                                setWasLiked(true)
                                votePost(post_id, 1)
                            }}><i class="fa-regular fa-thumbs-up"></i><p className="nLikes">{nLikes}</p></a>
                        )}
                        {wasDisliked ? (
                            <a onClick={(e) => {
                                setWasDisliked(false)
                                undoVote(post_id, -1)
                            }}><i class="fa-solid fa-thumbs-down"></i><p className="nLikes">{nDislikes}</p></a>
                        ) : (
                            <a onClick={(e) => {
                                setWasDisliked(true)
                                votePost(post_id, -1)
                            }}><i class="fa-regular fa-thumbs-down"></i><p className="nLikes">{nDislikes}</p></a>
                        )}
                    </div>
                    <div className="comments">
                        <a><i class="fa-regular fa-comment"></i><p className="nComments">{nComments}</p></a>
                    </div>
                    <div className="reactions-btns">
                        <button className="left" onClick={() => {
                            if(!showCommentForm){
                                setBtnCommentText('Hide Form')
                            }else{
                                setBtnCommentText('Write Comment')
                            }
                            setShowCommentForm(!showCommentForm)
                            
                        }}><i class="fa-solid fa-comment"></i> {btnCommentText}</button>
                        <button className="right"><i class="fa-solid fa-share"></i> Share</button>
                    </div>
                </div>
                {showCommentForm && <div className="comment-field">
                    <textarea value={commentText} onChange={(e) => {setCommentText(e.target.value)}} className="commentsIconPicker" type="text" />
                    <div className="btn-comment">
                        <button onClick={() => {setShowEmojis(!showEmojis)}} className="extra-content-btn"><i class="fa-solid fa-face-smile"></i></button>
                        <button onClick={(e) => {
                            e.preventDefault()
                            console.log(commentText);
                            insertNewParentComment(user.id, post_id, commentText)
                        }} className="postCommentBtn"><i class="fa-solid fa-paper-plane"></i>Post</button>
                    </div>
                    {showEmojis && <div className="emojiPicker">
                        <Picker data={data} emojiSize={18} emojiButtonSize={28} onEmojiSelect={addEmoji} />
                    </div>}
                </div>}
            </div>
        </div>
    )
}

export default PostCard;

