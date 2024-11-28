import IconNavButton from "./IconNavButton"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <>
            <div className="navbar bg-base-300">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <IconNavButton 
                            title="Home" 
                            to="/home" 
                            icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                        <IconNavButton 
                            title="Page 1"
                            to="/page1"
                            icon="M6 12h12"
                        />
                        <IconNavButton 
                            title="Page 2"
                            to="/page2"
                            icon="M6 12h12"
                        />

                    </ul>
                </div>

                <Link to="/home">
                    <button className="btn btn-ghost text-xl">Final Project</button>
                </Link>
            </div>
        </>
    )
}

export default Navbar