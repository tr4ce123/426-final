
const Hero = ({name}) => {
    return (
        <div className="hero bg-base-800 h-full" style={{ height: '300px' }}>
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Welcome, {name}!</h1>
                    <p className="py-6">
                    Discover, catch, and collect random Pokémon to build your ultimate Pokédex!
                    Will you find a common friend or a rare shiny to brag about? 
                    Can you Catch 'Em All?
                    To catch a Pokemon, click the button below!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Hero