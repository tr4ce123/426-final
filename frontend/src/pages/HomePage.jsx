import { useState, useEffect } from "react";
import Hero from "../components/Hero"
import axiosInstance from "../axios";
import CatchPokemon from "./CatchPokemon";

const HomePage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/protected");
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data");
            }
        };

        fetchData();
    }, []);


    return (
        <>
        <div className="flex flex-col items-center justify-center">
            <Hero name={data?.user?.username} />
            <div className="mt-8">
                <CatchPokemon />
            </div>
        </div>
        </>
    )
}

export default HomePage