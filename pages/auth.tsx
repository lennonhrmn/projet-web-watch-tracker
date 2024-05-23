import Input from "@/components/Input";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaCircleArrowLeft } from "react-icons/fa6";


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [variant, setVariant] = useState("login");
  const [etape1, setEtape1] = useState(true);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  }, []);

  const toggleVariant = useCallback(() => {
    resetForm();
    setVariant((currentVariant) =>
      currentVariant === "login" ? "signup" : "login"
    );
  }, [resetForm]);

  const validateStep1 = useCallback(() => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (
      email.length <= 4 ||
      !email.match(/@/g) ||
      !email.includes(".") ||
      email.indexOf("@") <= 0 ||
      email.lastIndexOf(".") <= email.indexOf("@") + 1 ||
      email.lastIndexOf(".") >= email.length - 1
    ) {
      setEmailError("Email must be at least 5 characters long, contain '@'");
      isValid = false;
    }

    if (password.length <= 7) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else if (!password.match(/[A-Z]/g)) {
      setPasswordError("Password must contain at least one uppercase letter");
      isValid = false;
    } else if (!password.match(/[a-z]/g)) {
      setPasswordError("Password must contain at least one lowercase letter");
      isValid = false;
    } else if (!password.match(/[0-9]/g)) {
      setPasswordError("Password must contain at least one `&apos;`digit");
      isValid = false;
    } else if (!password.match(/[^a-zA-Z0-9]/g)) {
      setPasswordError("Password must contain at least one special character");
      isValid = false;
    }

    if (password !== passwordConfirmation) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  }, [email, password, passwordConfirmation]);

  const login = useCallback(async () => {
    try {
      // Réinitialiser les messages d'erreur
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setLoginError("");

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if ((result as { error: string }).error) {
        setLoginError("Wrong email or password");
        setEmail("");
        setPassword("");
      } else {
        // Rediriger vers la bibliothèque après une connexion réussie
        window.location.href = "/library";
      }
    } catch (error) {
      console.error(error);
      setLoginError("An unexpected error occurred");
    }
  }, [email, password]);

  const register = useCallback(async () => {
    try {
      // Réinitialiser les messages d'erreur
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");

      if (!validateStep1()) {
        return;
      }

      await axios.post("/api/register", {
        email,
        password,
        firstName,
        lastName,
      });

      login();
    } catch (error) {
      console.error(error);
      // Mettre à jour les messages d'erreur
      setEmailError("Invalid email");
      setPasswordError("Invalid password");
      setConfirmPasswordError("Invalid password");
    }
  }, [email, password, passwordConfirmation, firstName, lastName, login]);

  const handleBackButtonClick = () => {
    console.log("Back button clicked");
    setEmail("");
    setPassword("");
    setVariant("login");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{
        backgroundImage: `url("/images/fond-ecran/jujutsu.jpeg")`,
        filter: "brightness(0.8)",
      }}
    >
      {variant == "signup" && (
        <FaCircleArrowLeft
          size={40}
          className="relative mr-2 mb-64 z-10 text-white cursor-pointer"
          onClick={handleBackButtonClick}
        />
      )}
      <div className="text-center w-80 text-white bg-black bg-opacity-50 p-4 rounded-lg">
        <img
          src="/images/logo/logo.jpg"
          alt="Logo"
          className="absolute top-0 left-0 m-4"
        />
        <h1 className="text-4xl mb-4 text-left font-bold">
          {variant === "login" ? "Sign in" : "Create an account"}
        </h1>
        <form>
          <div className="mb-5 space-y-2">
            {variant === "login" || etape1 ? (
              <>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  onChange={(ev: any) => setEmail(ev.target.value)}
                  value={email}
                  autoComplete="email"
                />
                {emailError && <div className="text-xs text-red-500">{emailError}</div>}
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  onChange={(ev: any) => setPassword(ev.target.value)}
                  value={password}
                  autoComplete="current-password"
                />
                {passwordError && (
                  <div className="text-xs text-red-500">{passwordError}</div>
                )}
                {loginError && (
                  <div className="text-xs text-red-500">{loginError}</div>
                )}
                {variant === "signup" && (
                  <div>
                    <Input
                      id="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      onChange={(ev: any) =>
                        setPasswordConfirmation(ev.target.value)
                      }
                      value={passwordConfirmation}
                      autoComplete="new-password"
                    />
                    {confirmPasswordError && (
                      <div className="text-xs text-red-500">
                        {confirmPasswordError}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <Input
                  id="firstName"
                  label="First Name"
                  type="text"
                  onChange={(ev: any) => setFirstName(ev.target.value)}
                  value={firstName}
                  autoComplete="given-name"
                />
                <Input
                  id="lastName"
                  label="Last Name"
                  type="text"
                  onChange={(ev: any) => setLastName(ev.target.value)}
                  value={lastName}
                  autoComplete="family-name"
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
              {/* <div className="flex flex-row items-center gap-4 mt-5 justify-center">
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
            </div> */}
            </div>
          ) : etape1 ? (
            <button
              onClick={(ev) => {
                ev.preventDefault();
                if (validateStep1()) {
                  setEtape1(false);
                }
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
};

export default Auth;
