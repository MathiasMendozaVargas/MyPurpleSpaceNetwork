import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

// Modals
import DeleteModal from './DeleteModal';


// Login Page Template
const EditPostModal = (props) => {

    const logged_user = useSelector(state => state.user.user)
    let postData = props.postData.postData

    const hiddenFileInput = useRef()
    const user = useSelector(state => state.user.user)

    const [showEmojis, setShowEmojis] = useState(false)
    const [postText, setPostText] = useState(postData.content)
    const [oldImages, setOldImages] = useState(props.media ? (props.media) : (null))
    const [newImages, setNewImages] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    

    // Post References
    const post_id = postData.id
    const user_id = user.id

    const addEmoji = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((el) => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        setPostText(postText + emoji)
    }

    const getPostMedia = async (media) => {
        // work on multi media later
        try {
            const {data, e} = supabase.storage.from('post_photos').getPublicUrl(String(media))
            if(e){
                console.log(e);
            }
            if(data){
                setOldImages(data.publicUrl)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const editPost = async (user_id, post_id) => {
        if(user_id == logged_user.id){
            if(newImages){
                // Deleting old Image from the database first
                let filenameN
                let filepath
                if(oldImages){
                    let filenameNumber = oldImages.split(`${user.id}/${post_id}/`)[1]
                    filenameN = filenameNumber
                    filepath = `${user_id}/${post_id}/${filenameNumber}`;
                    const {data, error} = await supabase.storage.from('post_photos').remove([filepath])
                    if(data){
                        // Modify file path in the Database
                        filenameN = (parseInt(filenameN, 10) + 1) % 4;
                        filepath = `${user_id}/${post_id}/${filenameN}`
                    }
                }
                // Upload new Photo
                const {e} = await supabase.storage.from('post_photos').upload(filepath, newImages, {
                    cacheControl: 3600,
                    upsert: true
                })
                if(e){
                    toast.warning(e, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                }
                else{
                    let new_media = []
                    new_media.push(filepath)
    
                    const {e} = await supabase.from('posts').update({
                        content: postText,
                        media: new_media
                    }).eq('id', post_id)
                    if(e){
                        console.log(e);
                    }
                    else{
                        toast.success('Post Updated Successfully! 🎊', {
                            position:"top-right"
                        })
                        setTimeout(()=>{
                            window.location.reload()
                        }, 2000)
                    }
                }
            }
            if(!newImages){
                const {e} = await supabase.from('posts').update({
                    content: postText
                }).eq('id', post_id)
                if(e){
                    console.log(e);
                }
                else{
                    toast.success('Post Updated Successfully! 🎊', {
                        position:"bottom-left"
                    })
                    setTimeout(()=>{
                        window.location.reload()
                    }, 2000)
                }
            }
    
            return () => {}
        }
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
        
            setNewImages(newFile);
            setOldImages(null)
            };
        };
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    if(!user){
        return null
    }

    return (
        <div className={oldImages || newImages ? ('newPostPage-body media-selected') : ('newPostPage-body')}>
            <div className="header-card">
                <a onClick={props.closeEditPostModal}><i class="fa-solid fa-circle-xmark"></i></a>
                <h2><i class="fa-solid fa-feather"></i> Edit your purple </h2>
            </div>
            <textarea value={postText} onChange={(e) => {setPostText(e.target.value)}} name="contentPost" id="contentPost" cols="30" rows="10"></textarea>
            {oldImages || newImages ? (
                <div className='media'>
                    <a onClick={(e)=>{e.preventDefault(); setOldImages(null); setNewImages(null)}}><i class="fa-solid fa-circle-xmark"></i></a>
                    {oldImages ? (
                        <img src={oldImages} className='post-image'></img>
                    ): (<img src={URL.createObjectURL(newImages)} className='post-image'></img>)}
                </div>
            ):(null)}
            <div className="extra-btns">
                <button onClick={() => {setShowEmojis(!showEmojis)}} className="emojis"><i class="fa-solid fa-face-smile"></i></button>
                <button onClick={handleClick} className='emojis'><i class="fa-solid fa-images"></i></button>
                <button className='emojis'><i class="fa-solid fa-video"></i></button>
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
                editPost(logged_user.id, post_id)
            } }><i class="fa-solid fa-paper-plane"></i> Update Purple</button>
        </div>
    )
}

export default EditPostModal;