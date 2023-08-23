///////////////////////////////////////
// Friends Page (For all Users)
///////////////////////////////////////

// importing Navbar
import Navbar from '../components/Navbar'

// media
import based_profileImg from '../assets/basedProfile.png'


// import all libraries
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'

// About Page Template
function Friends() {
    const { profile_id } = useParams()
    const logged_user = useSelector(state => state.user.user)

    let isLoggedUser = false
    if(profile_id === logged_user.id){
        isLoggedUser = true
    }

    // UseStates
    const [ friends, setFriends ] = useState(null)


    // Get All Friends of the Current User
    const getAllFriends = async (current_user_id) => {
        try {
            const {data, error} = await supabase.from('users_data').select()

            // check for errors
            if(error){
                console.log(error);
            }
            if(data){
                // Look for the User's Row on database
                for(let i=0; i<data.length; i++){
                    if(current_user_id === data[i].user_id){
                        // assigning friends list to current state of friends
                        setFriends(data[i].friends)
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    const getMetadataFromFriends = async (friends) => {
        var friendList = []
        for(var j in friends){
            // Getting Profile Data From Database
            const { user , error } = await supabase.from("users_data").select().eq('user_id', friends[j])
            if(!isLoggedUser && !friendList.includes(user)){
                friendList.push({...user})
            }
        }
        console.log(friendList);
        setFriends(friendList)
    }

    useEffect(() => {

        // get all friends of a user
        getAllFriends(profile_id)

        // Set Friends Metadata to Friends State
        getMetadataFromFriends(friends)
    
    }, [])

    return (
        <>
            <Navbar />
            <div className="friends">
                <div className="container">
                    {/* header */}
                    <div className="header">
                        <i class="fa-solid fa-user-group"></i>
                        <h1>Friends</h1>
                    </div>
                    {/* body */}
                    <div className="body">
                        <div className="friend-card">
                            <img src={based_profileImg} alt="" />
                            <div className="friend-info">
                                <p className='fullName'>Mark Zuckerberg</p>
                                <p className='username'>@markzuck</p>
                            </div>
                            <div className="friends-btns">
                                <button className='deleteBtn'><i class="fa-solid fa-user-xmark"></i>Delete Friend</button>
                            </div>
                        </div>
                        <div className="friend-card">
                            <img src={based_profileImg} alt="" />
                            <div className="friend-info">
                                <p className='fullName'>Mark Zuckerberg</p>
                                <p className='username'>@markzuck</p>
                            </div>
                            <div className="friends-btns">
                                <button className='deleteBtn'><i class="fa-solid fa-user-xmark"></i>Delete Friend</button>
                            </div>
                        </div>
                        <div className="friend-card">
                            <img src={based_profileImg} alt="" />
                            <div className="friend-info">
                                <p className='fullName'>Mark Zuckerberg</p>
                                <p className='username'>@markzuck</p>
                            </div>
                            <div className="friends-btns">
                                <button className='deleteBtn'><i class="fa-solid fa-user-xmark"></i>Delete Friend</button>
                            </div>
                        </div>
                        <div className="friend-card">
                            <img src={based_profileImg} alt="" />
                            <div className="friend-info">
                                <p className='fullName'>Mark Zuckerberg</p>
                                <p className='username'>@markzuck</p>
                            </div>
                            <div className="friends-btns">
                                <button className='deleteBtn'><i class="fa-solid fa-user-xmark"></i>Delete Friend</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Friends;