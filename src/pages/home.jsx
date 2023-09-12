import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

// importing Navbar and PostCard Components
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard';

// Modals
import CreatePostModal from '../modals/CreatePostModal';

// dummy data

import { supabase } from '../lib/supabaseClient';




// Home Page Template
function Home() {
    const [ posts, setPosts ] = useState(null)
    const [showCreatePostModal, setShowCreatePostModal] = useState(false)

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

    function closeModal() {
        setShowCreatePostModal(false)
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
                    console.log(post);
                    return <PostCard key={post.id} postData={post}/>
                })}
                <div className="floatingBtn">
                    <button onClick={(e) => {
                        e.preventDefault()
                        setShowCreatePostModal(!showCreatePostModal)
                    }}><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
                {showCreatePostModal && <CreatePostModal closeModal={closeModal}></CreatePostModal>}
            </div>
        </>
    )
}

export default Home;