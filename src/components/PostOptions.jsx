

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function PostOptions(data) {
    let post_data = data.data.postData

    const logged_user = useSelector(state => state.user.user)
    const [isFriend, setIsFriend] = useState(false)

    let isAuthor = false
    if(post_data.user_id === logged_user.id){
        isAuthor = true
    }

    const verifyIsFriend = async(another_id) => {
        try {
            let {data, e} = await supabase.from('users_data').select().eq('user_id', logged_user.id)
            if(data){
                data = data[0]
                if(data.friends.length > 1){
                    for(let i=0; i<data.friends.length; i++){
                        if(data.friends[i] === another_id){
                            setIsFriend(true)
                        }
                    }
                }
                else{
                    if(data.friends[0] === another_id){
                        setIsFriend(true)
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

    useEffect(() => {
        verifyIsFriend(post_data.user_id)
    }, [])


    if(isAuthor){
        return (
            <>
                <div className="box-connector"></div>
                <div className="options-post">
                    <button><p><i class="fa-solid fa-pen"></i> Edit Post</p></button>
                    <button><p><i class="fa-solid fa-trash-can"></i> Delete Post</p></button>
                    <button><p><i class="fa-regular fa-bookmark"></i> Save Post</p></button>
                </div>
            </>
        )
    }
    if(!isAuthor){
        return(
            <>
                <div className="box-connector"></div>
                <div className="options-post">
                    <button><p><i class="fa-regular fa-bookmark"></i> Save Post</p></button>
                    {isFriend ? (<button><p><i class="fa-solid fa-user-xmark"></i> Stop Following</p></button>) : (<div></div>)}
                </div>
            </>
        )
    }
}

export default PostOptions