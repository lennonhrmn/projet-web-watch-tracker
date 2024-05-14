import Navbar from '@/components/Navbar';
import Input from "@/components/Input2";
import React, { useCallback, useState } from "react";
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import useCurrentUser from '@/hooks/useCurrentUser';
import Box from "@/components/Box";
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export async function getServerSideProps(context : NextPageContext) {
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
    const { data: currentUser} = useCurrentUser();
    const [email, setEmail] = useState(currentUser.email);
    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [newPassword, setNewPassword] = useState('');
    const [confirmationNewPassword, setConfirmationNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

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


    const handleSaveClick = useCallback(async () => {
      setIsEditing(false);
    
      try {
        const response = await fetch('/api/modifyAccount', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
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
    }, [email, firstName, lastName, newPassword, confirmationNewPassword]);

    const handleBackButtonClick = () => {
      console.log("Back button clicked");
      setIsEditing(false);
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
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    onChange={(ev: any) => setEmail(ev.target.value)}
                    value={email} label={''}                  />
                ) : (
                  <Box>
                    <p className="text-black">
                      {email}
                    </p>
                  </Box>
                )}
                <label htmlFor="firstName" className="block">First Name</label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    type="text"
                    onChange={(ev: any) => setFirstName(ev.target.value)}
                    value={firstName} label={''}                  />
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
                    value={lastName} label={''}                  />
                ) : (
                  <Box>
                    <p className="text-black">
                      {lastName}
                    </p>
                  </Box>
                )}
              {isEditing ? (
                <>
                <label htmlFor="lastName" className="block">New Password</label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"} // Utiliser l'état showPassword ici
                  onChange={(ev: any) => setNewPassword(ev.target.value)}
                  value={newPassword} label={''} >
                {showNewPassword ? (
                <FaEyeSlash className="cursor-pointer" onClick={toggleNewPasswordVisibility} />
                ) : (
                  <FaEye className="cursor-pointer" onClick={toggleNewPasswordVisibility} />
                )}
                </Input>

                <label htmlFor="lastName" className="block">Confirmation New Password</label>
                <Input
                  id="confirmationNewPassword"
                  type={showConfirmNewPassword ? "text" : "password"} // Utiliser l'état showPassword ici
                  onChange={(ev: any) => setConfirmationNewPassword(ev.target.value)}
                  value={confirmationNewPassword} label={''} >
                {showConfirmNewPassword ? (
                <FaEyeSlash className="cursor-pointer" onClick={toggleConfirmNewPasswordVisibility} />
                ) : (
                  <FaEye className="cursor-pointer" onClick={toggleConfirmNewPasswordVisibility} />
                )}
                </Input>
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
                className="px-4 py-1 mt-10 bg-blue-500 text-white rounded"
              >
                Modify
              </button>
            )}
            </div>
          </form>
        </div>
      </div>
    );
};

export default AccountPage;
