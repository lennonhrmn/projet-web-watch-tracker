import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

import Navbar from '@/components/Navbar';
import Input from "@/components/Input2";
import React, { useCallback, useState, useEffect } from "react";
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import useCurrentUser from '@/hooks/useCurrentUser';
import Box from "@/components/Box";
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const AccountPage = () => {
  const { data: currentUser } = useCurrentUser();
  const [email, setEmail] = useState(currentUser?.email || '');
  // const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationNewPassword, setConfirmationNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const validateEmail = (email: string) => {
    let isValid = true;
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
    return isValid;
  };

  const validatePassword = (password: string) => {
    let isValid = true;
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
      setPasswordError("Password must contain at least one digit");
      isValid = false;
    } else if (!password.match(/[^a-zA-Z0-9]/g)) {
      setPasswordError("Password must contain at least one special character");
      isValid = false;
    }
    return isValid;
  };

  const validatePasswords = () => {
    const isValid = newPassword === confirmationNewPassword;
    setConfirmPasswordError(isValid ? "" : "Passwords do not match");
    return isValid;
  };

  const handleSaveClick = useCallback(async () => {

    if (!validateEmail(email) || (newPassword && !validatePassword(newPassword)) || (confirmationNewPassword && !validatePasswords())) {
      return;
    }

    setIsEditing(false);

    try {
      const response = await fetch('/api/modifyAccount', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          // newEmail,
          newPassword,
          confirmationNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User data saved:', data);
      } else {
        console.error('Failed to save user data:', data.error);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }

    // setEmail(newEmail);
    setNewPassword("");
    setConfirmationNewPassword("");

  }, [email, firstName, lastName, newPassword, confirmationNewPassword, validatePasswords]);

  const handleBackButtonClick = () => {
    setIsEditing(false);
    // setNewEmail(email);
    setNewPassword("");
    setConfirmationNewPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmailError("");
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{
        backgroundImage: `url("/images/fond-ecran/jujutsu.jpeg")`,
        filter: "brightness(0.8)",
      }}
    >
      <Navbar />
      {isEditing && (
        <FaCircleArrowLeft
          size={40}
          className='absolute z-10 top-24 left-[30%] mr-5 text-white cursor-pointer'
          onClick={handleBackButtonClick}
        />
      )}
      <div className="text-center w-80 text-white bg-black bg-opacity-50 p-2 mt-20 rounded-lg">
        <form>
          <p className="text-4xl mb-3 text-left font-bold">
            My account
          </p>
          <div className="mb-2 space-y-1">
            <label htmlFor="email" className="block">Email</label>
            {/* {isEditing ? (
              <>
                <Input
                  id="email"
                  type="email"
                  onChange={(ev: any) => setNewEmail(ev.target.value)}
                  value={newEmail} label={''} />
                {emailError && <div className="text-xs text-red-500">{emailError}</div>}
              </>
            ) : ( */}
            <Box>
              <p className="text-black">
                {email}
              </p>
            </Box>
            {/* )} */}
            <label htmlFor="firstName" className="block">First Name</label>
            {isEditing ? (
              <Input
                id="firstName"
                type="text"
                onChange={(ev: any) => setFirstName(ev.target.value)}
                value={firstName}
                label={''}
                autoComplete="given-name"
              />
            ) : (
              <Box>
                <p className="text-black">
                  {firstName}
                </p>
              </Box>
            )}
            <label htmlFor="lastName" className="block">Last Name</label>
            {isEditing ? (
              <Input
                id="lastName"
                type="text"
                onChange={(ev: any) => setLastName(ev.target.value)}
                value={lastName}
                label={''}
                autoComplete="family-name"
              />
            ) : (
              <Box>
                <p className="text-black">
                  {lastName}
                </p>
              </Box>
            )}
            {isEditing ? (
              <>
                <label htmlFor="newPassword" className="block">New Password</label>
                <Input
                  id="newPassword"
                  type="password"
                  onChange={(ev: any) => setNewPassword(ev.target.value)}
                  value={newPassword}
                  label={''}
                  autoComplete="new-password"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="cursor-pointer" onClick={toggleNewPasswordVisibility} />
                  ) : (
                    <FaEye className="cursor-pointer" onClick={toggleNewPasswordVisibility} />
                  )}
                </Input>
                {passwordError && <div className="text-xs text-red-500">{passwordError}</div>}

                <label htmlFor="confirmationNewPassword" className="block">Confirmation New Password</label>
                <Input
                  id="confirmationNewPassword"
                  type="password"
                  onChange={(ev: any) => setConfirmationNewPassword(ev.target.value)}
                  value={confirmationNewPassword}
                  label={''}
                  autoComplete="new-password"
                >
                  {showConfirmNewPassword ? (
                    <FaEyeSlash className="cursor-pointer" onClick={toggleConfirmNewPasswordVisibility} />
                  ) : (
                    <FaEye className="cursor-pointer" onClick={toggleConfirmNewPasswordVisibility} />
                  )}
                </Input>
                {confirmPasswordError && <div className="text-xs text-red-500">{confirmPasswordError}</div>}

                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="px-4 py-1 bg-blue-500 text-white rounded"
                >
                  Save
                </button></>
            ) : (
              <button
                type="button"
                onClick={handleEditClick}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
