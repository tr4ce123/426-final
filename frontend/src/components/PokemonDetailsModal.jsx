import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';

function PokemonDetailsModal({ pokemon, onClose }) {
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                if (!pokemon || !pokemon.pokemonId) {
                    throw new Error('Invalid Pokemon data');
                }

                const response = await axiosInstance.get(`/pokemon-details/${pokemon.pokemonId}`);
                setPokemonDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokemon details:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [pokemon]);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    if (loading) {
        return (
            <dialog open className="modal">
                <div className="modal-box">
                    <span className="loading loading-infinity loading-lg"></span>
                </div>
            </dialog>
        );
    }

    if (error || !pokemonDetails) {
        return (
            <dialog open className="modal" onClick={handleOverlayClick}>
                <div className="modal-box">
                    <p>Unable to fetch Pokemon details. Please try again.</p>
                </div>
            </dialog>
        );
    }

    return (
        <dialog open className="modal" onClick={handleOverlayClick}>
            <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-2xl capitalize text-center mb-4">{pokemon.name}</h3>

                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img 
                            src={pokemonDetails.sprites.front_default} 
                            alt={pokemon.name} 
                            className="w-64 h-64 object-contain"
                        />
                    </div>

                    <div className="w-full md:w-1/2 p-4">
                        <h4 className="text-xl font-semibold mb-2">Details</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <p><strong>Height:</strong> {pokemonDetails.height / 10} m</p>
                            <p><strong>Weight:</strong> {pokemonDetails.weight / 10} kg</p>
                            <p><strong>Caught On:</strong> {new Date(pokemon.catchTimestamp).toLocaleString()}</p>
                        </div>

                        <h4 className="text-xl font-semibold mt-4 mb-2">Types</h4>
                        <div className="flex gap-2">
                            {pokemonDetails.types.map((type, index) => (
                                <span 
                                    key={index} 
                                    className="badge badge-primary capitalize"
                                >
                                    {type}
                                </span>
                            ))}
                        </div>

                        <h4 className="text-xl font-semibold mt-4 mb-2">Base Stats</h4>
                        <div className="space-y-2">
                            {pokemonDetails.stats.map((stat, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="capitalize w-1/3">{stat.name}:</span>
                                    <progress 
                                        className="progress progress-primary w-2/3" 
                                        value={stat.base_stat} 
                                        max="100"
                                    ></progress>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default PokemonDetailsModal;