import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

// importing Navbar and PostCard Components
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard';

// dummy data

import { supabase } from '../lib/supabaseClient';




// Home Page Template
function Home() {
    const [ posts, setPosts ] = useState(null)

    const navigate = useNavigate()

    const getAllPost = async () => {
        const { data, error } = await supabase.from('posts').select().order('created_at', { ascending: false })

        if(error){
            console.log(error);
        }
        
        if(data) {
            console.log(data);
            setPosts(data)
        }
    }

    useEffect(() => {
        // Getting all posts
        getAllPost()
    }, [])

    if(!posts){
        return <h1 style={{textAlign: 'center', marginTop: '150px'}}>Loading...</h1>
    }

    return (
        <>
            <Navbar />
            <div className="home">
                {posts.map((post) => {
                    return <PostCard key={post.id} postData={post}/>
                })}
                <div className="floatingBtn">
                    <button onClick={() => {
                        navigate('/createNewPost')
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </div>
        </>
    )
}

export default Home;