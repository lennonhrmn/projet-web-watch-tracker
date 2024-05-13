import React from 'react';

interface BoxProps {
        children: React.ReactNode;
}

const Box = ({ children }: BoxProps) => {
    return (
        <div className="bg-white shadow-md rounded-lg opacity-50 h-6">
                {children}
        </div>
    );
};

export default Box;