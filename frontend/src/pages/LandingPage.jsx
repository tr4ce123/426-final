import { Link } from "react-router-dom"
import image from "../assets/pokemon-ball.jpg"

const LandingPage = () => {
    return (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: `url(${image})`,
            }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">Welcome to PokéCatch</h1>
                    <Link to="/register">
                        <button className="btn glass">Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LandingPage