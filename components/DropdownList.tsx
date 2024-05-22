import React, { useState, ChangeEvent } from 'react';

const DropdownList = ({ episodes, onSelectEpisode, savedEpisodes, selectedEpisode }: { episodes: number, onSelectEpisode: (episode: number | null) => void, savedEpisodes: Set<number>, selectedEpisode: number | null }) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedEpisode = parseInt(event.target.value);
        onSelectEpisode(isNaN(selectedEpisode) ? null : selectedEpisode); // Appeler la fonction de rappel avec le numéro d'épisode sélectionné ou null si aucun épisode n'est sélectionné
    };

    if (episodes <= 0) {
        return null;
    }

    return (
        <div className="h-5 w-28 mt-2.5 rounded-md">
            <select onChange={handleChange} className="bg-transparent w-28" value={selectedEpisode ?? ''}>
                <option value="">Select episode</option>
                {Array.from({ length: episodes }, (_, i) => i + 1).map((episode) => (
                    <option key={episode} value={episode} className={savedEpisodes.has(episode) ? 'bg-gray-400' : 'text-black'}>
                        Episode {episode}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownList;