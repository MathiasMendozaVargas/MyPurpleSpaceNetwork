

import { useDispatch, useSelector } from 'react-redux'

import { supabase } from '../lib/supabaseClient'

function PostOptions() {

    const user = useSelector(state => state.user.user)

    return(
        <>
            <div className="box-connector"></div>
            <div className="options-post">
                <button><p><i class="fa-solid fa-pen"></i> Edit Post</p></button>
                <button><p><i class="fa-solid fa-trash-can"></i> Delete Post</p></button>
                <button><p><i class="fa-regular fa-bookmark"></i> Save Post</p></button>
                <button><p><i class="fa-solid fa-user-xmark"></i> Stop Following</p></button>
            </div>
        </>
    )
}

export default PostOptions