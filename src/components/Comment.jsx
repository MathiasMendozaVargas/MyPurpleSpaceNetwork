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

// About Page Template
function Comment(data) {
    const logged_user = useSelector(state => state.user.user)

    const [metadata, setMetaData] = useState(null)

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

    useEffect(() => {
        getUserMetaData(data.data.user_id)
    }, [])

    if(metadata){
        return (
            <div className="comment">
                <div className="top">
                    <img className='avatar' src={avatar}/>
                    <h4 className='author'>{metadata.username}</h4>
                    <p className='time'>1hr ago</p>
                </div>
                <div className="bottom">
                    <p>{data.data.body}</p>
                </div>
            </div>
        )
    }
}

export default Comment;