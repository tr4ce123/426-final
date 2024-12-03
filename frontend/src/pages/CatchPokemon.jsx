import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import PokemonDetailsModal from '../components/PokemonDetailsModal';
import catchGif from '../assets/pokemon-catch-gif.gif';

function CatchPokemon() {
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [canCatch, setCanCatch] = useState(true);
    const [showCatchGif, setShowCatchGif] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gifLoaded, setGifLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = catchGif;
        img.onload = () => setGifLoaded(true);
    }, []);

    useEffect(() => {
        const checkCooldown = async () => {
            try {
                const response = await axiosInstance.get('/catch-cooldown');
                if (response.data.cooldown > 0) {
                    setCanCatch(false);
                    setCooldown(response.data.cooldown);
                }
            } catch (error) {
                console.error('Error checking cooldown:', error);
            }
        };

        checkCooldown();
    }, []);

    useEffect(() => {
        let intervalId;
        if (cooldown > 0) {
            intervalId = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        setCanCatch(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [cooldown]);

    const handleCatchPokemon = async () => {
        if (!canCatch || !gifLoaded) return;

        try {
            const response = await axiosInstance.post('/catch-pokemon');
            
            const pokemonToSave = {
                pokemonId: response.data.pokemon.id,
                name: response.data.pokemon.name,
                imageUrl: response.data.pokemon.imageUrl,
                catchTimestamp: new Date().toISOString()
            };

            setCurrentPokemon(pokemonToSave);
            setCanCatch(false);
            setCooldown(60);
            
            setShowCatchGif(true);
            
            setTimeout(() => {
                setShowCatchGif(false);
                setIsModalOpen(true);
            }, 4600);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                setCanCatch(false);
                setCooldown(error.response.data.cooldown);
            } else {
                console.error('Error catching Pokemon:', error);
            }
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Catch a Pokemon</h1>
            
            {showCatchGif && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <img 
                        src={catchGif} 
                        alt="Catching Pokemon" 
                        className="max-w-full max-h-full"
                    />
                </div>
            )}

            <div className="flex justify-center mt-4">
                <button 
                    onClick={handleCatchPokemon} 
                    disabled={!canCatch || !gifLoaded}
                    className={`btn ${canCatch && gifLoaded ? 'btn-primary' : 'btn-disabled'}`}
                >
                    {!gifLoaded 
                        ? 'Loading...' 
                        : (canCatch 
                            ? 'Catch Pokemon' 
                            : `Cooldown: ${formatTime(cooldown)}`
                        )
                    }
                </button>
            </div>

            {currentPokemon && isModalOpen && (
                <PokemonDetailsModal 
                    pokemon={currentPokemon} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
}

export default CatchPokemon;