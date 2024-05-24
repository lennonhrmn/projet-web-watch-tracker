import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import NavbarItem from './NavbarItem';
import MobileMenu from './MobileMenu';
import SearchBar from './searchBar';

const TOP_OFFSET = 66;

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
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
          px-4
          md:px-16
          py-6
          flex
          flex-row
          items-center
          transition
          duration-500
          ${showBackground ? 'bg-black bg-opacity-100' : ''}
        `}
      >
        <img className="h-6 lg:h-7" src="/images/logo/logo.jpg" alt="logo" />
        <div className="text-white flex-row ml-8 hidden gap-7 sm:flex">
          <Link href="/library">
            <NavbarItem label="Library" />
          </Link>
          <select
            id="categorySelect"
            className="bg-transparent cursor-pointer hover:text-gray-300 translation"
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
          <Link href="/account">
            <NavbarItem label="Account" />
          </Link>
          <div onClick={() => signOut({ callbackUrl: '/auth' })} className="cursor-pointer">
            <NavbarItem label="Sign out" />
          </div>
        </div>
        <div onClick={toggleMobileMenu} className="sm:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
          <RxHamburgerMenu className="text-white transition" />
          <MobileMenu visible={showMobileMenu} />
        </div>
        <SearchBar />
      </div>
    </nav>
  );
};

export default Navbar;
