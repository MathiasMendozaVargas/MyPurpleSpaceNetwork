/////////////////////
// Comment Component 
/////////////////////

// media
import avatar from '../assets/basedProfile.png'

// import all libraries
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'

// Modals
import DeleteCommentModal from '../modals/deleteCommentModal' 

// About Page Template
function Comment(data) {
    const logged_user = useSelector(state => state.user.user)

    const [metadata, setMetaData] = useState(null)
    const [isAuthor, setIsAuthor] = useState(false)

    const getUserMetaData = async (user_id) => {
        try {
            const {data, e} = await supabase.from('users_data').select().eq('user_id', user_id)
            if(data){
                setMetaData(data[0])
            }
            if(e){
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const checkifIsAuthor = async () => {
        if(data.data.user_id === logged_user.id){
            setIsAuthor(true)
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

    let time = calculateTimeDifference(data.data.created_at)

    useEffect(() => {
        getUserMetaData(data.data.user_id)
        checkifIsAuthor()
    }, [])

    if(metadata){
        return (
            <div className="comment">
                <div className="top">
                    <img className='avatar' src={avatar}/>
                    <h4 className='author'>{metadata.username}</h4>
                    <p className='time'>{time}</p>
                    <a className='dltComment'><i class="fa-solid fa-trash"></i></a>
                </div>
                <div className="bottom">
                    <p>{data.data.body}</p>
                </div>
                <DeleteCommentModal></DeleteCommentModal>
            </div>
        )
    }
}

export default Comment;