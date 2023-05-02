// importing media images
import { useNavigate } from 'react-router-dom'
import earthImg from '../assets/Earth-PNG-Image-Background.png'
import personPcImg from '../assets/personConnected.png'
import personPcImg2 from '../assets/personConnected2.png'


// importing Navbar
import Navbar from '../components/Navbar'


// About Page Template
function About() {

    const navigate = useNavigate()

    return (
        <>
            <Navbar />
            <div className="about">
                <div className="left-about">
                    <img src={earthImg} alt="" />
                </div>
                <div className="right-about">
                    <h1>My Purple Space brings the world together!</h1>
                    <h4>Get Connected!</h4>
                    <div className="personConnecteds">
                        <img src={personPcImg} alt="" style={{marginRight:'35px'}} />
                        <img src={personPcImg2} alt="" />
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi tempora beatae unde eum officiis necessitatibus quidem, totam, est dolor reiciendis dolores recusandae maxime voluptatem itaque in iusto adipisci quas voluptatibus?</p>
                    <button onClick={() => {
                        navigate('/login')
                    }}>Start being Purple</button>
                </div>
            </div>
        </>
    )
}

export default About;