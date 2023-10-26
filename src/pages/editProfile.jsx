import { useState, useEffect } from 'react'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabaseClient';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from "react-toastify";

// Components
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

// assets
import based_profileImg from '../assets/basedProfile.png'
import select_image from '../assets/image-select.png'

// 3d Model
import { StarsCanvas } from '../components/Canvas/Stars'

const EditProfile = () => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const [userData, setUserData] = useState(null)
    const [newImage, setNewImage] = useState(null)
    const [oldImage, setOldImage] = useState(null)

    // framer motion
    const [picMotionRef, picInView] = useInView({
        threshold: 0,
        triggerOnce: true
    })
    const control = useAnimation()

    const updateProfilePhoto = async (user_id, new_photo) => {
        try {
            let filenameN = 0;
        
            if (oldImage) {
                let filenameNumber = oldImage.split(`${user_id}/profile`)[1];
                filenameN = filenameNumber;
                let filepath = `${user_id}/profile${filenameNumber}`;
            
                const { data, error } = await supabase.storage
                    .from('profile_photos')
                    .remove([filepath]);
            
                if (data) {
                    // Modify file path in the Database
                    filenameN = (parseInt(filenameN, 10) + 1) % 4;
                }
            }
        
            // Upload new Photo
            const { e } = await supabase.storage.from('profile_photos').upload(`${user_id}/profile${filenameN}`, new_photo, {
                cacheControl: 3600,
                upsert: true,
            });
        
            if (e) {
                toast.warning(e, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };


    const getUserMetaData = async (current_user_id) => {
        const { data, error } = await supabase.from('users_data').select()
    
        if(error){
            console.log(error);
        }
    
        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === current_user_id){
                    setUserData(data[i])
                }
                else{
                    console.log('Nothing found...');
                }
            }

            usernameRef.current.value = userData['username']
            firstNameRef.current.value = userData['first_name']
            lastNameRef.current.value = userData['last_name']
            genderRef.current.value = userData['gender']
            ageRef.current.value = userData['age']
        }
    }

    const updateProfile = async () => {
        try {
            const { error } = await supabase.from('users_data').update({
                username: usernameRef.current.value,
                first_name: firstNameRef.current.value,
                last_name: lastNameRef.current.value,
                gender: genderRef.current.value,
                age: ageRef.current.value
            })
            .eq('user_id', user.id)
    
            if(error){
                console.log(error);
            }

        } catch (error) {
            console.log(error);
        } finally {
            // if we have newImage to update we execute the update photo function
            if(newImage){
                await updateProfilePhoto(user.id, newImage)
            }
            toast.success('Profile updated Successfully! 🎊', {
                position: toast.POSITION.BOTTOM_LEFT
            })
            setTimeout(()=>{
                navigate(`/profile/${user.id}`)
            }, 2000)
        }
    }

    const getProfilePhoto = async (profile_id) => {
        let { data: filename, error } = await supabase.storage.from('profile_photos').list(profile_id, {
            limit: 2,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })
        if(error){
            console.log(error);
        }
        if(filename){
            filename = filename[filename.length-1].name
            let filepath = `${profile_id}/${filename}`
            const {data} = supabase.storage.from('profile_photos').getPublicUrl(filepath)
            if(data){
                setOldImage(data.publicUrl)
            }
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
        
            setNewImage(newFile);
            };
        };
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
    
    const zoomInVariant = {
        visible: {opacity: 1, scale: 1, transition: {duration: 0.3}, delay: {duration: 0}},
        hidden: {opacity: 0, scale: 0, transition: {duration: 0}}
    }

    useEffect(() => {
        getUserMetaData(user.id)
        getProfilePhoto(user.id)
        
        if(picInView){
            control.start('visible')
        }else if(!picInView){
            control.start('hidden')
        }
    }, [control, picInView])

    const hiddenFileInput = useRef()
    const usernameRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const genderRef = useRef()
    const ageRef = useRef()

    if(!userData){
        return <Loading />
    }

    if(userData){
        return(
            <>
                <Navbar />
                <div className="editProfile">
                    <div className="editProfile-header">
                        <div onClick={handleClick} className="imageBox">
                            {oldImage ? (
                                newImage ?
                                (<img src={URL.createObjectURL(newImage)} className="img-display" />):
                                (<img src={oldImage} className="img-display"/>)
                                
                            ) : (
                                <img src={based_profileImg} alt="upload image" className="img-display" />
                            )}
                        </div>
                        <input
                            id="image-upload-input"
                            type="file"
                            onChange={handleImageChange}
                            ref={hiddenFileInput}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </div>
                    <div className="editProfile-content">
                        <form>
                            <input ref={usernameRef} value={userData.username} type='text' placeholder='Username' />
                            <input ref={firstNameRef} value={userData.first_name} type='text' placeholder='First Name' />
                            <input ref={lastNameRef} value={userData.last_name} type='text' placeholder='Last Name' />
                            <div className="age-and-age-div">
                                <select ref={genderRef} name="gender" id="gender" value={userData.gender}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non Binary">Non Binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                <select ref={ageRef} value={userData.age}><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option><option value="59">59</option><option value="60">60</option><option value="61">61</option><option value="62">62</option><option value="63">63</option><option value="64">64</option><option value="65">65</option><option value="66">66</option><option value="67">67</option><option value="68">68</option><option value="69">69</option><option value="70">70</option><option value="71">71</option><option value="72">72</option><option value="73">73</option><option value="74">74</option><option value="75">75</option><option value="76">76</option><option value="77">77</option><option value="78">78</option><option value="79">79</option><option value="80">80</option><option value="81">81</option><option value="82">82</option><option value="83">83</option><option value="84">84</option><option value="85">85</option><option value="86">86</option><option value="87">87</option><option value="88">88</option><option value="89">89</option><option value="90">90</option><option value="91">91</option><option value="92">92</option><option value="93">93</option><option value="94">94</option><option value="95">95</option><option value="96">96</option><option value="97">97</option><option value="98">98</option><option value="99">99</option><option value="100">100</option></select>
                            </div>
                            <button style={{marginBottom: "5.2px"}} onClick={async (e) => {
                                e.preventDefault()
                                await updateProfile()
                                } }>Update Profile <i class="fa-solid fa-address-card"></i></button>
                        </form>
                    </div>
                    <div className="stars-animation">
                        <StarsCanvas />
                    </div>
                </div>
            </>
        )
    }
}

export default EditProfile;