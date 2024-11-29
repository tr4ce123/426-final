import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import PokemonCard from '../components/PokemonCard';

function Pokedex() {
    const [pokedex, setPokedex] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokedex = async () => {
            try {
                const response = await axiosInstance.get('/pokedex');
                setPokedex(response.data.pokedex);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokedex:', error);
                setLoading(false);
            }
        };

        fetchPokedex();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-infinity loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Pokedex</h1>
            
            {pokedex.length === 0 ? (
                <p>You haven't caught any Pokemon yet!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pokedex.map((pokemon) => (
                        <PokemonCard 
                            key={pokemon._id} 
                            pokemon={pokemon} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Pokedex;