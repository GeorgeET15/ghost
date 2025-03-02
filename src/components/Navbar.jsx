// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ account, isAdmin, isOwner, disconnectWallet }) {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-4 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-green-400 font-bold text-xl">
          G.H.O.S.T
        </NavLink>
        <div className="flex items-center space-x-4">
          {account && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-400 font-medium"
                    : "text-gray-300 hover:text-green-400 transition duration-200"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/tips"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-400 font-medium"
                    : "text-gray-300 hover:text-green-400 transition duration-200"
                }
              >
                My Tips
              </NavLink>
              {(isAdmin || isOwner) && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-400 font-medium"
                      : "text-gray-300 hover:text-green-400 transition duration-200"
                  }
                >
                  Admin Panel
                </NavLink>
              )}
              <span className="text-gray-400 text-sm">
                {account.slice(0, 6)}…{account.slice(-4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="bg-red-950 text-gray-200 font-medium py-2 px-6 rounded-lg border border-red-900 hover:bg-red-900 transition duration-300"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
