//////////////////////////////
// Edit Profile Photo Modal
//////////////////////////////

// libraries
import { useRef, useState } from "react";

// import media
import SelectPhoto from '../assets/select_photo.png'
import { supabase } from "../lib/supabaseClient";
import { useSelector } from "react-redux";



const EditProfilePhoto = () => {

    const logged_user = useSelector(state => state.user.user)

    const [image, setImage] = useState(null)

    const hiddenFileInput = useRef(null);
      
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const imgname = event.target.files[0].name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxSize = Math.max(img.width, img.height);
            canvas.width = maxSize;
            canvas.height = maxSize;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
            img,
            (maxSize - img.width) / 2,
            (maxSize - img.height) / 2
            );
            canvas.toBlob(
            (blob) => {
                const file = new File([blob], imgname, {
                type: "image/png",
                lastModified: Date.now(),
                });
    
                console.log(file);
                setImage(file);
            },
            "image/jpeg",
            0.8
            );
        };
        };
    };
    
    const handleUploadButtonClick = async (user_id, file) => {
        if(user_id === logged_user.id){
            try {
                let fileName = file.name
                let extension = fileName.substring(fileName.lastIndexOf('.') + 1)
                const {error} = await supabase.storage.from('profile_photos').upload(String(user_id + "." + extension), file)
                if(error){
                    console.log(error);
                }else{
                    window.location.reload()
                }
            } catch (error) {
                console.log(error);   
            }
        }
        else{
            console.log("Permission Denied!");
        }
    };
    
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
    
    return(
        <div className="image-upload-container">
            <div className="box-decoration">
                <label htmlFor="image-upload-input" className="image-upload-label">
                <i class="fa-solid fa-image"></i> Upload Profile Photo 
                </label>
                <div onClick={handleClick} className="imageBox">
                    {image ? (
                        <img src={URL.createObjectURL(image)} className="img-display" />
                    ) : (
                        <img src={SelectPhoto} alt="upload image" className="img-display" />
                    )}
                </div>
                <input
                    id="image-upload-input"
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                />

                <div className="uploadPicBtn-container">
                    <button className="image-upload-button" onClick={handleUploadButtonClick(logged_user.id, image)}>Upload Photo</button>
                </div>
            </div>
        </div>
    )
}


export default EditProfilePhoto