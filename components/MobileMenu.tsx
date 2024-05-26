import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface MobileMenuProps {
    visible: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    if (!visible) return null;

    const handleCategoryChange = (category: string) => {
        if (category !== "category") {
            router.push(`/${category}`);
            setIsDropdownOpen(false); // Close dropdown after selection
        }
    };

    const toggleDropdown = (event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="
            bg-black
            w-28
            flex
            py-3
            flex-col
            border-2
            border-gray-800
            relative
            z-50
        ">
            <div className="flex flex-col gap-4">
                <div className="px-3 text-center text-white hover:underline">
                    <Link href="/library">
                        Library
                    </Link>
                </div>
                <div className="px-3 text-center text-white hover:underline relative">
                    <button
                        onClick={toggleDropdown}
                        className="w-full bg-transparent cursor-pointer hover:text-gray-300 transition"
                    >
                        Category
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-full bg-white text-black border border-gray-800">
                            <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleCategoryChange("anime")}
                            >
                                Anime
                            </div>
                            <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleCategoryChange("manga")}
                            >
                                Manga
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-3 text-center text-white hover:underline">
                    <Link href="/account">
                        Account
                    </Link>
                </div>
                <div
                    onClick={() => signOut({ callbackUrl: "/auth" })}
                    className="px-3 text-center text-white hover:underline cursor-pointer"
                >
                    Sign out
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
