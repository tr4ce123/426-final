import { FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router-dom";


const NotFound = () => {
    return(
        <div className="flex flex-col justify-center items-center text-center">
            <FaTriangleExclamation className="text-yellow-400 text-6xl mb-10 mt-10 "/>

            <h1 className="text-5xl font-bold">404 Not Found</h1>
            <p className="textet-xl mb-5">This page does not exist</p>

            <Link to="/home">
                <button className="btn btn-primary">Go Back</button>
            </Link>

        </div>
    )
}

export default NotFound