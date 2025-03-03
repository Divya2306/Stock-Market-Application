import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineStock } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Header.scss";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <AiOutlineStock />
          KDU Stock Market
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <Link to="/summarizer" className="header__nav-link">
            Summarizer
          </Link>
          <Link to="/portfolio" className="header__nav-link">
            My Portfolio
          </Link>
        </nav>

        {/* Hamburger Menu Icon (Visible on Small Screens) */}
        <div
          className="header__hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <GiHamburgerMenu />
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="header__mobile-menu">
          <Link
            to="/summarizer"
            className="header__mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Summarizer
          </Link>
          <Link
            to="/portfolio"
            className="header__mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            My Portfolio
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
