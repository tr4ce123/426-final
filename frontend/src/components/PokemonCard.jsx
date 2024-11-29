import React, { useState } from 'react';
import PokemonDetailsModal from './PokemonDetailsModal';

function PokemonCard({ pokemon }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div 
                onClick={openModal} 
                className="card bg-base-100 shadow-xl cursor-pointer hover:scale-105 transition-transform"
            >
                <figure>
                    <img 
                        src={pokemon.imageUrl} 
                        alt={pokemon.name} 
                        className="w-full h-48 object-contain"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title capitalize">{pokemon.name}</h2>
                    <p>Caught on: {new Date(pokemon.catchTimestamp).toLocaleString()}</p>
                </div>
            </div>

            {isModalOpen && (
                <PokemonDetailsModal 
                    pokemon={pokemon} 
                    onClose={closeModal} 
                />
            )}
        </>
    );
}

export default PokemonCard;