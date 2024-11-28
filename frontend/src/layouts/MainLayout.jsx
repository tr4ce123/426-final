import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

const MainLayout = ( {setUser} ) => {
    return (
        <>
            <Navbar setUser={setUser}/>
            <Outlet />
        </>
    )
}

export default MainLayout