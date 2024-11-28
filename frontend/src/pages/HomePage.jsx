import { useState, useEffect } from "react";
import Hero from "../components/Hero"
import axiosInstance from "../axios";

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
            <div className="flex flex-col">
                <Hero name={data?.user?.username} />
                <div className="flex w-full flex-col border-opacity-50">
                    {/* <div className="card bg-base-300 rounded-box grid h-20 place-items-center">content</div>
                    <div className="divider">OR</div>
                    <div className="card bg-base-300 rounded-box grid h-20 place-items-center">content</div> */}
                </div>
            </div>
        </>
    )
}

export default HomePage