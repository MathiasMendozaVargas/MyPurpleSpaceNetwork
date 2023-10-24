// Delete Modal


// libraries
import { motion, useAnimate } from "framer-motion";


const DeleteModal = ({context, icon, closeModal, deleteFunction}) => {
    return (
        <div className="deleteModal">
            <i class={icon}></i>
            <h4>{context}</h4>
            <div className="btn-container">
                <button onClick={closeModal} className='no'>No</button>
                <button onClick={deleteFunction} className='yes'>Yes</button>
            </div>
        </div>
    )
}

export default DeleteModal;