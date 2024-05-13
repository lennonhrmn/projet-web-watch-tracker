import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/test/Nav";
import {useState} from "react";
import Logo from "@/components/test/Logo";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showNav,setShowNav] = useState(false);
  const { data: session } = useSession();

  return (
      <div style={{ 
        backgroundImage: `url('/images/fond-ecran/jujutsu.jpeg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100vh'
      }}>
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
            <RxHamburgerMenu className="text-white transition"/>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
}