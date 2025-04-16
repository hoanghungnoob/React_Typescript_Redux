import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { logout } from "../features/auth/authSlice"; // nếu bạn có action logout
import { Link } from "react-router-dom";
import type { AppDispatch } from "../app/store";

const HeaderComponent: React.FC = () => {
  const [isNavVisible, setNavVisibility] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();


  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] z-20 bg-[#00FFFF] shadow flex items-center px-4">
      <img src={logo} className="h-[50px] mr-4" alt="logo" />
        <nav
          className={`flex-1 flex justify-evenly items-center 
            text-white text-lg font-medium 
            max-md:absolute max-md:top-[70px] max-md:left-0 max-md:right-0 
            max-md:flex-col max-md:bg-[#1e1e1e] max-md:shadow-md max-md:py-4`}
        >
          <Link to="/" className="hover:scale-110 transition-transform">Home</Link>
          <Link to="/user" className="hover:scale-110 transition-transform">User</Link>
          <Link to="/product" className="hover:scale-110 transition-transform">Product</Link>
          <button
            onClick={handleAuthAction}
            className="hover:shadow-[0_2px_0_rgba(255,0,0,0.25)] px-4 py-2"
          >
            {isAuthenticated ? "Logout" : "Login"}
          </button>
        </nav>
      <button
        onClick={toggleNav}
        className="md:hidden ml-auto text-3xl text-white bg-transparent border-none outline-none transition-transform active:scale-125"
      >
        🍔
      </button>
    </header>
  );
};

export default HeaderComponent;
