import Hero from "../components/Hero"

const HomePage = () => {
    return (
        <>
            <div className="flex flex-col">
                <Hero />
                <div className="flex w-full flex-col border-opacity-50">
                    <div className="card bg-base-300 rounded-box grid h-20 place-items-center">content</div>
                    <div className="divider">OR</div>
                    <div className="card bg-base-300 rounded-box grid h-20 place-items-center">content</div>
                </div>
            </div>
        </>
    )
}

export default HomePage