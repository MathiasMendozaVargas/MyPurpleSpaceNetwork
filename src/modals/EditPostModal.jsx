import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


// Login Page Template
const EditPostModal = (props) => {

    console.log(props);
    let postData = props.postData.postData

    const hiddenFileInput = useRef()
    const user = useSelector(state => state.user.user)

    console.log(postData);

    const [showEmojis, setShowEmojis] = useState(false)
    const [postText, setPostText] = useState(postData.content)
    const [oldImages, setOldImages] = useState(null)
    const [newImages, setNewImages] = useState(null)
    

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
    console.log(postData.media[0]);

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


    const editPost = async (post_id) => {
        // console.log("Hiii");
        // const { data:postData, error } = await supabase.from('posts').update({
        //     content: postText,
        // }).eq('user_id', user_id)

        // if(error){
        //     console.log(error);
        // }

        // if(postData){
        //     if(newImages){
        //         console.log("hiiiiiii");
        //         const {data:mediaPath, e} = await supabase.storage.from('post_photos').update(String(user_id+'/'+postData[0].id+'/0'), newImages)
        //         if(e){
        //             console.log(e);
        //         }
        //         if(mediaPath){
        //             let new_media = []
        //             new_media.push(mediaPath.path)
        //             const {e} = await supabase.from('posts').update({
        //                 media: new_media
        //             }).eq('id', postData[0].id)
        //             if(e){
        //                 console.log(e);
        //             }
        //             else{
        //                 console.log("Updated!");
        //             }
        //         }
        //     }
        //     toast.success("Post updated!", {
        //         position: toast.POSITION.TOP_RIGHT
        //     });
        //     window.location.reload()
        // }

        if(newImages){
            console.log("Hiiiii");
            let filePath = String(user_id+'/'+post_id+'/0')
            const {e} = await supabase.storage.from('posts_photos').update(filePath, newImages, {
                cacheControl: '3600',
                upsert: true
            })
            if(e){
                console.log(e);
            }
            else{
                let new_media = []
                new_media.push(filePath)

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
                    position:"top-right"
                })
                setTimeout(()=>{
                    window.location.reload()
                }, 2000)
            }
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
        
            setNewImages(newFile);
            setOldImages(null)
            };
        };
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    useEffect(()=>{
        if(postData.media[0]){
            getPostMedia(postData.media[0])
        }
    }, [])

    if(!user){
        return null
    }

    return (
        <div className={oldImages ? ('newPostPage-body media-selected') : ('newPostPage-body')}>
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
                editPost(post_id)
            } }><i class="fa-solid fa-paper-plane"></i> Update Purple</button>
        </div>
    )
}

export default EditPostModal;