import { Link } from "react-router-dom"

const IconNavButton = ( { title, to, icon } ) => {
    return (
        <li>
            <Link to={to}>
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
                    d= {icon}/>
                </svg>
                {title}
            </Link>
        </li>

    )
}

export default IconNavButton