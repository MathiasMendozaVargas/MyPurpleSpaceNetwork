import { motion } from "framer-motion";

const DeleteModal = ({ context, icon, closeModal, deleteFunction }) => {
    const modalAnimation = {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 50, opacity: 0 },
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimation}
            className="deleteModal"
        >
            <i className={icon}></i>
            <h4>{context}</h4>
            <div className="btn-container">
                <motion.button
                    onClick={closeModal}
                    className="no"
                    whileHover={{ scale: 1.1 }}
                >
                    No
                </motion.button>
                <motion.button
                    onClick={deleteFunction}
                    className="yes"
                    whileHover={{ scale: 1.1 }}
                >
                    Yes
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DeleteModal;