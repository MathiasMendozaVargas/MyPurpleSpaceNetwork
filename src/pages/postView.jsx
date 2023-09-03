/////////////////
// Post View Page
/////////////////

// importing Components
import Navbar from '../components/Navbar'
import PostCardView from '../components/PostCardView'
import Comment from '../components/Comment'

// media
import avatar from '../assets/basedProfile.png'



// import all libraries
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'

// About Page Template
function PostView() {
    const { post_id } = useParams()
    const logged_user = useSelector(state => state.user.user)
    const [ postData, setPostData ] = useState(null)
    const [ comments, setComments] = useState(null)

    // let isLoggedUser = false
    // if(profile_id === logged_user.id){
    //     isLoggedUser = true
    // }

    const getPostData = async (post_id) => {
        try {
            const { data:postData, e } = await supabase.from('posts').select().eq('id', post_id)

            if(postData){
                setPostData(postData[0])
            }

            if(e){
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const getComments = async (post_id) => {
        try {
            const { data, e } = await supabase.from('comments').select().order('created_at', { ascending: false })
            if(e){
                console.log(e);
            }

            if(data){
                let comments_list = []
                for(let i= 0;i<data.length;i++){
                    if(data[i].post_id === post_id){
                        comments_list.push(data[i])
                    }
                }
                setComments(comments_list)
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getPostData(post_id)
        getComments(post_id)
    }, [])


    if(!postData){
        return <div style={{color: 'white'}}>Loading...</div>;
    }

    if(!comments){
        return <div style={{color: 'white'}}>Loading...</div>;   
    }

    return (
        <>
            <Navbar />
            <div className="postView">
                <div className="container">
                    <PostCardView nComments={comments.length} postData={postData}/>
                    <div className="comments">
                        <div className="container">
                            <div className="head">
                                <h2>Comments</h2>
                            </div>
                            <div className="body">
                                { comments.length > 0 && 
                                    comments.map((comment) => {
                                        return <Comment key={comment.id} data={comment}></Comment>
                                    })
                                }
                                { comments.length === 0 && 
                                    <h3 className='no-comments'><i class="fa-regular fa-face-sad-tear"></i>No Comments Yet</h3>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostView;