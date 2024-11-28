import { useNavigate } from "react-router-dom"


const LogoutButton = ({setUser}) => {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("authToken")

        setUser(null);

        navigate("/login")
    }

    return (
        <>
            <button className="btn btn-outline btn-error" onClick={handleLogout}>Logout</button>
        </>
    )
}

export default LogoutButton