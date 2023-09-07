/////////////////////
// Confirm Modal 
/////////////////////

// import all libraries
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'

// About Page Template
function DeleteCommentModal() {
    return (
        <div className="deleteCommentModal">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h4>Are you sure you want to delete this comment?</h4>
            <div className="btn-container">
                <button className='no'>No</button>
                <button className='yes'>Yes</button>
            </div>
        </div>
    )
}

export default DeleteCommentModal;