// import all libraries
import { useNavigate } from 'react-router-dom'

// media
import based_profileImg from '../assets/basedProfile.png'


// importing Navbar
import Navbar from '../components/Navbar'


// About Page Template
function Friends() {

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