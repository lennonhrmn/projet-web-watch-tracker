import Input from "@/components/onBoarding/Input";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [variant, setVariant] = useState("login");
  const [etape1, setEtape1] = useState(true);

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "signup" : "login"
    );
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/library",
      });

    } catch (error) {
      console.error(error);
    }
  }, [email, password]);

  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        password,
        firstName,
        lastName,
      });

      login();
    } catch (error) {
      console.error(error);
    }
  }, [email, password, firstName, lastName, login]);

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{
        backgroundImage: `url("/images/fond-ecran/jujutsu.jpeg")`,
        filter: "brightness(0.8)",
      }}
    >
      <div className="text-center  w-80 p-10 text-white bg-black bg-opacity-50 p-4 rounded-lg">
        <img
          src="/images/logo/logo.jpg"
          alt="Logo"
          className="absolute top-0 left-0 m-4"
        />
        <h1 className="text-4xl mb-4 text-left font-bold">
          {variant === "login" ? "Sign in" : "Create an account"}
        </h1>
        <form>
          <div className="mb-7 space-y-4">
            {variant === "login" || etape1 ? (
              <>
                <Input
                  id="email"
                  label="Email"
                  type="Email"
                  onChange={(ev: any) => setEmail(ev.target.value)}
                  value={email}
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  onChange={(ev: any) => setPassword(ev.target.value)}
                  value={password}
                />
                {variant === "signup" && (
                  <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    onChange={(ev: any) => setPasswordConfirmation(ev.target.value)}
                    // verifyPassword(ev.target.value)} à faire
                    value={passwordConfirmation}
                  />
                )}
              </>
            ) : (
              <>
                <Input
                  id="firstName"
                  label="FirstName"
                  type="text"
                  onChange={(ev: any) => setFirstName(ev.target.value)}
                  value={firstName}
                />
                <Input
                  id="lastName"
                  label="LastName"
                  type="text"
                  onChange={(ev: any) => setLastName(ev.target.value)}
                  value={lastName}
                />
              </>
            )}
          </div>

          {variant === "login" ? (
            <div>
            <button
              onClick={(ev) => {
                ev.preventDefault();
                login();
              }}
              type="submit"
              className="w-full px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Sign in
            </button>
            <div className="flex flex-row items-center gap-4 mt-5 justify-center">
              <div 
              onClick={() => signIn("google", { callbackUrl: "/library" })}
              className="
              w-10
              h-10
              bg-white
              rounded-full
              flex
              items-center
              justify-center
              cursor-pointer
              hover:opacity-80
              transition
              ">
                <FcGoogle size={30}/>
              </div>
              {/* <div className="
              w-10
              h-10
              bg-white
              rounded-full
              flex
              items-center
              justify-center
              cursor-pointer
              hover:opacity-80
              transition
              ">
                <FaFacebook size={30}/>
              </div> */}
            </div>
            </div>
          ) : etape1 ? (
            <button
              onClick={(ev) => {
                ev.preventDefault();
                setEtape1(false);
              }}
              type="submit"
              className="w-full px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              onClick={(ev) => {
                ev.preventDefault(); 
                register();
              }}
              className="w-full px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Submit
            </button>
          )}
        </form>
        {variant === "login" && (
          <div className="mt-4">
            <p className="text-neutral-500">
              Don't have an account?
              <span
                onClick={toggleVariant}
                className="
          text-white ml-1 hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;