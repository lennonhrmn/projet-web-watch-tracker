import { RxHamburgerMenu } from "react-icons/rx";
import NavbarItem from "./NavbarItem";
import MobileMenu from "./MobileMenu";
import React, { use, useCallback, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";

const TOP_OFFSET = 66;

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const router = useRouter();
  const [searchFormActive, setSearchFormActive] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const results = await searchAnime(searchQuery);
    setSearchResults(results);
};

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    if (category !== "category") {
      router.push(`/${category}`);
    }
  };

  return (
    <nav className="w-full top-0 fixed z-40">
      <div
        className={`
          px-4
          md:px-16
          py-6
          flex
          flex-row
          items-center
          transition
          duration-500
          ${showBackground ? "bg-black bg-opacity-100" : ""}
        `}
      >
        <img className="h-6 lg:h-7" src="/images/logo/logo.jpg" />
        <div className="text-white flex-row ml-8 hidden gap-7 sm:flex">
          <Link href="/library">
            <NavbarItem label="Library" />
          </Link>
          <select
            id="categorySelect"
            className="bg-transparent cursor-pointer hover:text-gray-300 translation"
            onChange={handleCategoryChange}
          >
            <option className="text-black" value="category">
              Category
            </option>
            <option className="text-black" value="anime">
              Anime
            </option>
            <option className="text-black" value="manga">
              Manga
            </option>
          </select>
          <Link href="/account">
            <NavbarItem label="Account" />
          </Link>
          <div onClick={() => signOut({ callbackUrl: "/auth" })} className="cursor-pointer">
            <NavbarItem label="Sign out" />
          </div>
        </div>
        <div onClick={toggleMobileMenu} className="sm:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
          <RxHamburgerMenu className="text-white transition" />
          <MobileMenu visible={showMobileMenu} />
        </div>
        {!searchFormActive && (
        <div
          className="flex flex-row ml-auto gap-7 items-center cursor-pointer text-white"
          onClick={() => setSearchFormActive(!searchFormActive)}
        >
          <BsSearch />
        </div>)}
        {searchFormActive && (
            <>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-row ml-auto gap-2 items-center">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        handleSearch(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                    }}
                    className="text-gray-200 bg-transparent focus:outline-none border-b-2 border-gray-400 py-1 px-2"
                />
                <button type="submit" className="text-gray-200 hover:text-gray-400 cursor-pointer transition">
                    <BsSearch />
                </button>
                </form>
                <div
                className="flex flex-row ml-3 items-center cursor-pointer text-white"
                onClick={() => setSearchFormActive(false)}
                >
                <RxCross2 />
                </div>
            </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
