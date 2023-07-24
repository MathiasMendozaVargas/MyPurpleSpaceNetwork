import Navbar from '../components/Navbar'

import based_profileImg from '../assets/basedProfile.png'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSelector } from 'react-redux'

import PostCard from '../components/PostCard'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { current } from '@reduxjs/toolkit'
import { useSearchParams } from 'react-router-dom'


// Another User's Profile Page

const AnotherProfile = () => {
    const [searchParams] = useSearchParams()

    const another_user_id = searchParams.userId

    const navigate = useNavigate()

    const [ user_data, set_user_data ] = useState(null)
    const [ user_posts, set_user_posts ] = useState(null)

    const getAnotherUserMetaData = async (current_user_id) => {
        const { data, error } = await supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            for(var i=0; i<data.length; i++) {
                if(data[i].user_id === current_user_id){
                    set_user_data(data[i])
                }
                else{
                    console.log('Nothing found...');
                }
            }
        }
    }
    

    const getAllPostofAnotherUser = async (current_user_id) => {
        // Get all posts of another users and display them on the page
        const { data, error } = await supabase.from('posts').select().order('created_at', { ascending: false })

        if(error){
            console.log(error);
        }

        if(data){
            const postsOfAnotherUser = []

            for(var i=0; i<data.length; i++){
                if(data[i].user_id ===  current_user_id){
                    postsOfAnotherUser.push(data[i])
                }
            }

            if(postsOfAnotherUser.length <= 0){
                set_user_posts(null)
            }
            else{
                set_user_posts(postsOfAnotherUser)
            }
        }
    }

    useEffect(() => {
        // Get Another User Metadata
        getAnotherUserMetaData(another_user_id)

        // Get Another User Posts
        getAllPostofAnotherUser(another_user_id)
    })

    if(!user_data) {
        return null
    }

    if(!user_posts){
        return (
            <>
                <Navbar />
                <div className="profile">
                    <div className="profile-header">
                        <img src={based_profileImg} alt="" />
                    </div>
                    <div className="profile-content">
                        <div className="profile-content-info">
                            <span>
                                <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                                <a><i class="fa-solid fa-pen"></i></a>
                            </span>
                            <h4>Username: {user_data.username}</h4>
                            <h4>Age: {user_data.age}</h4>
                            <h4>Gender: {(user_data.gender).toUpperCase()}</h4>
                            <h2>Contact Info</h2>
                            <h4>Email: {user.email}</h4>
                        </div>
                        <div className="profile-content-posts">
                            <h2 style={{textAlign: 'center', marginTop: '50px'}}>{user_data.first_name + ' ' + user_data.last_name + ' '} hasn't purple anything!</h2>
                        </div>

                    </div>
                </div>
                <div className="floatingBtn">
                    <button onClick={() => {
                        navigate('/createNewPost')
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </>
        )
    }

    if(user_posts){
        return (
            <>
            <Navbar />
            <div className="profile">
                <div className="profile-header">
                    <img src={based_profileImg} alt="" />
                </div>
                <div className="profile-content">
                    <div className="profile-content-info">
                        <span className="profileInfoSpan">
                            <h1>{user_data.first_name + ' ' + user_data.last_name}</h1>
                            <Link to={'/editProfile/' + user.id}><a><i class="fa-solid fa-pen"></i></a></Link>
                        </span>
                        <h4>Username: {user_data.username}</h4>
                        <h4>Age: {user_data.age}</h4>
                        <h4>Gender: {(user_data.gender).toUpperCase()}</h4>
                        <h2>Contact Info</h2>
                        <h4>Email: {user.email}</h4>
                    </div>
                    <div className="profile-content-posts">
                        {user_posts.map((post) => {
                            return <PostCard key={post.id} postData={post}/>
                        })}
                    </div>
                </div>
            </div>
            <div className="floatingBtn">
                    <button onClick={() => {
                        navigate('/createNewPost')
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </>
        )
    }
}

export default AnotherProfile;