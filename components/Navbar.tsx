import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import NavbarItem from './NavbarItem';
import MobileMenu from './MobileMenu';
import SearchBar from './searchBar';
import useCurrentUser from '@/hooks/useCurrentUser';

const TOP_OFFSET = 54;

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackground(window.scrollY >= TOP_OFFSET);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    if (category !== 'category') {
      router.push(`/${category}`);
    }
  };

  return (
    <nav className="w-full top-0 fixed z-40">
      <div
        className={`
          px-[2vw]
          py-6
          flex
          flex-row
          items-center
          justify-between
          transition
          duration-500
          ${showBackground ? 'bg-black bg-opacity-100' : ''}
        `}
      >
        <div className="flex items-center">
          {session !== null ? (
            <Link href="/library">
              <img className="h-[2vh]" src="/images/logo/logo.png" alt="logo" />
            </Link>
          ) : (
            <Link href="/anime">
              <img className="h-[2vh]" src="/images/logo/logo.png" alt="logo" />
            </Link>
          )}
          <div className="text-white flex-row ml-7 hidden gap-7 sm:flex">
            {session !== null && (
              <Link href="/library">
                <NavbarItem label="Library" />
              </Link>
            )}
            <select
              id="categorySelect"
              className="bg-transparent cursor-pointer hover:text-gray-300 transition"
              onChange={handleCategoryChange}
            >
              <option className="text-black" value="category" style={{ display: 'none' }}>
                Category
              </option>
              <option className="text-black" value="anime">
                Anime
              </option>
              <option className="text-black" value="manga">
                Manga
              </option>
            </select>
            {session !== null && (
              <Link href="/account">
                <NavbarItem label="Account" />
              </Link>
            )}
            {session === null ? (
              <Link href="/auth">
                <NavbarItem label="Sign in" />
              </Link>
            ) : (
              <div onClick={() => signOut({ callbackUrl: '/anime' })} className="cursor-pointer">
                <NavbarItem label="Sign out" />
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <div onClick={toggleMobileMenu} className="sm:hidden flex cursor-pointer">
              <RxHamburgerMenu className="text-white transition" />
            </div>
            {showMobileMenu && (
              <div className="absolute top-10 right-0">
                <MobileMenu visible={showMobileMenu} />
              </div>
            )}
          </div>
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
