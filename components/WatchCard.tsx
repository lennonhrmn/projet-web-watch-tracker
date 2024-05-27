import { useRouter } from "next/router";
import { FaHeart } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";
import useFavorite from "@/hooks/useFavorite";
import { useEffect, useState } from "react";

interface WatchCardProps {
  data: Record<string, any>;
  type: string;
}

const WatchCard: React.FC<WatchCardProps> = ({ data, type }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false); // Variable d'état pour suivre si le contenu a été ajouté aux favoris
  const { data: userFavorites } = useFavorite(type as string); // Récupérer les favoris de l'utilisateur

  // Effectue une mise à jour de l'état isFavorite si le contenu est déjà dans les favoris de l'utilisateur
  useEffect(() => {
    if (userFavorites && userFavorites.some((favorite: { id: number }) => favorite.id === parseInt(data.id as string))) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [userFavorites, data.id]);

  const handleCardClick = () => {
    router.push({
      pathname: `/content${type}`,
      query: { id: data.id, type: type }
    });
  };

  return (
    <div className="group bg-zinc-900 rounded-md overflow-hidden shadow-md relative not-draggable">
      <img src={data.coverImage.large}
        alt={data.title.english}
        onClick={handleCardClick}
        className="cursor-pointer object-fill w-full h-full group-hover:opacity-0 group-hover:-translate-y-[20%] transition-all duration-300" draggable="false" />

      <div className="absolute bottom-0 w-full h-full flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
        <img src={data.coverImage.large}
          alt={data.title.english}
          onClick={handleCardClick}
          className="cursor-pointer object-fill w-full h-full" draggable="false" />
        <div className="bg-zinc-800 p-2">
          <div className="flex flex-row items-center justify-between mb-2 gap-2">
            <p className="text-xs text-white truncate">{data.title.english}</p>
            <div className="flex flex-row space-x-2 mt-1">
              <p className="text-xs text-white">{data.popularity}</p>
              <FaHeart className='text-red-500 text-1xl' />
            </div>
          </div>
          <div className="flex flex-row items-center gap-3">
            <FavoriteButton contentId={data.id} type={type} />
            {isFavorite ? (
              <p className="text-xs text-white">Remove from library</p>
            ) : (
              <p className="text-xs text-white">Add to library</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchCard;