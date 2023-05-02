import { toast } from 'react-toastify'
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// importing Navbar
import Navbar from '../components/Navbar'


// importing media files


// Login Page Template

const CreatePost = () => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    

    // Post References
    const contentRef = useRef()
    const user_id = user.id

    const getUserMetaData = async (current_user_id) => {
        const { data, error } = await supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === current_user_id){
                    return data[i]
                }
                else{
                    console.log('Nothing found...');
                }
            }
        }

        return () => {}
    }


    const insertNewPost = async () => {

        const user_meta_data = await getUserMetaData(user.id)

        console.log(user_meta_data);

        const { error } = await supabase.from('posts').insert({
            author: user_meta_data.username,
            content: contentRef.current.value,
            user_id: user_id
        })

        if(error){
            console.log(error);
        }

        if(!error){
            console.log("Post created!");
            navigate('/home')
        }

        return () => {}
    }

    if(!user){
        return null
    }

    return (
        <>
            <Navbar />
            <div className='loginPage'>
                <div className='loginPage-header'>
                    <h1 style={{marginBottom: '30px'}}>Create a new Purple Post!</h1>
                    <div className='loginPage-login'>
                        <form>
                            <textarea ref={contentRef} name="contentPost" id="contentPost" cols="30" rows="10"></textarea>
                            <button style={{fontStyle: 'italic'}} onClick={(e) => {
                                e.preventDefault();
                                insertNewPost()
                            } }><i class="fa-solid fa-paper-plane"></i> Post Purple</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost;