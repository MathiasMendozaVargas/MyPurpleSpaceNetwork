import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


// Login Page Template
const CreatePostModal = (props) => {
    const hiddenFileInput = useRef()
    const user = useSelector(state => state.user.user)

    const [showEmojis, setShowEmojis] = useState(false)
    const [postText, setPostText] = useState('')
    const [images, setImages] = useState(null)

    // Post References
    const user_id = user.id

    // Framer Motion
    const control = useAnimation()
    const [motionRef, inView] = useInView({
        threshold: 0
    })

    const addEmoji = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((el) => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        setPostText(postText + emoji)
    }

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

        const { data:postData, error } = await supabase.from('posts').insert({
            author: user_meta_data.username,
            content: postText,
            user_id: user_id
        }).select()

        if(error){
            console.log(error);
        }

        if(postData){
            if(images){
                const {data:mediaPath, e} = await supabase.storage.from('post_photos').upload(String(user_id+'/'+postData[0].id+'/0'), images)
                if(e){
                    console.log(e);
                }
                if(mediaPath){
                    let new_media = []
                    new_media.push(mediaPath.path)
                    const {e} = await supabase.from('posts').update({
                        media: new_media
                    }).eq('id', postData[0].id)
                    if(e){
                        console.log(e);
                    }
                    else{
                        console.log("Updated!");
                    }
                }
            }
            toast.success("Post created!", {
                position: toast.POSITION.TOP_RIGHT
            });
            window.location.reload()
        }

        return () => {}
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const imgname = file.name;
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onloadend = async () => {
            const img = new Image();
            img.src = reader.result;
        
            img.onload = async () => {
            const maxSize = Math.max(img.width, img.height);
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = maxSize;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, (maxSize - img.width) / 2, (maxSize - img.height) / 2);
        
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/jpeg", 0.8);
            });
        
            const newFile = new File([blob], imgname, {
                type: "image/png",
                lastModified: Date.now(),
            });
        
            setImages(newFile);
            };
        };
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const motionVariant = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: "-100%", transition: {duration: 0.5, ease: 'easeInOut'}},
    }

    useEffect(() => {
        if(inView){
            control.start('visible')
        }
        else{
            control.start('hidden')
        }
    }, [control, inView])

    if(!user){
        return null
    }

    return (
        <motion.div
            ref={motionRef}
            animate={control}
            variants={motionVariant}
            initial='hidden'
            exit='visible'
            className={images ? ('newPostPage-body media-selected') : ('newPostPage-body')}>
            <div className="header-card">
                <a onClick={props.closeModal}><i class="fa-solid fa-circle-xmark"></i></a>
                <h2><i class="fa-solid fa-feather"></i> Create your new Purple </h2>
            </div>
            <textarea value={postText} onChange={(e) => {setPostText(e.target.value)}} name="contentPost" id="contentPost" cols="30" rows="10"></textarea>
            {images ? (
                <div className='media'>
                    <a onClick={(e)=>{e.preventDefault(); setImages(null)}}><i class="fa-solid fa-circle-xmark"></i></a>
                    <img src={URL.createObjectURL(images)} className='post-image'></img>
                </div>
            ):(null)}
            <div className="extra-btns">
                <button onClick={() => {setShowEmojis(!showEmojis)}}><i class="fa-solid fa-face-smile"></i></button>
                <button onClick={handleClick}><i class="fa-solid fa-images"></i></button>
                <button><i class="fa-solid fa-video"></i></button>
                <input
                    id="image-upload-input"
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    accept="image/*"
                    style={{ display: "none" }}
                />
            </div>
            {showEmojis && <div className="emojiPicker">
                <Picker data={data} emojiSize={18} emojiButtonSize={28} onEmojiSelect={addEmoji} />
            </div>}
            <button className='postBtn' style={{fontStyle: 'italic'}} onClick={(e) => {
                e.preventDefault();
                insertNewPost()
            } }><i class="fa-solid fa-paper-plane"></i> Post Purple</button>
        </motion.div>
    )
}

export default CreatePostModal;