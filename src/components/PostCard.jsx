import { useState } from "react";
import avatar from '../assets/basedProfile.png'
import moment from "moment/moment";

const PostCard = (postData) => {
    const [post, setPost] = useState(postData);

    // const list_of_effects = ['fade-up', 'fade-down', 'fade-left', 'fade-right']

    // const random_effect = String(list_of_effects[Math.floor(Math.random() * 4)])

    const author = post.postData.author;
    const postDate = post.postData.date;
    const postContent = post.postData.content;


    const calculateTimeDifference = (timePost) => {
        const startDate = new Date(timePost);
        const curretTime = new Date();
        const difference = curretTime.getTime() - startDate.getTime();
    
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        var timeDiff = ''

        if(days === -1){
            timeDiff = 'Just now';
        }
        
        if(days !== 0){
            

            if(days === 1){
                timeDiff = days + '1 day ago'
            }
            else{
                timeDiff = days + ' days ago'
            }
        }

        else if(hours !== 0){
            if(hours === 1){
                timeDiff = hours + '1 hour ago'
            }
            else{
                timeDiff = hours + ' hrs ago'
            }
        }

        else if(minutes !== 0){
            if(minutes === 1){
                timeDiff = minutes + ' min ago'
            }
            else{
                timeDiff = minutes + ' mins ago'
            }
        }

        else if(seconds !== '0'){
            if(seconds === 1){
                timeDiff = seconds + ' sec ago'
            }
            else{
                timeDiff = seconds + ' secs ago'
            }
        }

        return timeDiff;

    }

    const current_time = post.postData.created_at
    const timeDiff = calculateTimeDifference(current_time)

    return (
        <div className="post-card">
            <div className="post-card-header">
                <img className="avatar" src={avatar} alt="" />
                <h4 className="post-author">{author}</h4>
                <p>{timeDiff}</p>
            </div>
            <div className="post-card-body">
                <div className="post-card-body-inner">
                    <p>{postContent}</p>
                </div>
            </div>
        </div>
    )
}

export default PostCard;