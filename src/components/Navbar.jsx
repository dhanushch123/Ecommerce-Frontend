import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => localStorage.getItem("theme") || "light-theme";

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const fetchData = async () => {
    try {
      const response = await API.get("api/products");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await API.get(`api/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const textColorClass = theme === "dark-theme" ? "text-light" : "text-dark";
  const navbarBgClass = theme === "dark-theme" ? "bg-dark" : "bg-light";

  const categories = [
    "Laptop",
    "Headphone",
    "Groceries",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className={`navbar navbar-expand-lg fixed-top ${navbarBgClass} ${textColorClass}`}>
        <div className="container-fluid">
          <p
            className={`navbar-brand ${textColorClass}`}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Ecom
          </p>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item">
                <p onClick={() => navigate("/login")} className={`nav-link ${textColorClass}`} style={{ cursor: "pointer" }}>
                  Login
                </p>
              </li>
              <li className="nav-item">
                <p onClick={() => navigate("/register")} className={`nav-link ${textColorClass}`} style={{ cursor: "pointer" }}>
                  Register
                </p>
              </li>
              <li className="nav-item">
                <p onClick={() => navigate("/")} className={`nav-link ${textColorClass}`} style={{ cursor: "pointer" }}>
                  Home
                </p>
              </li>
              <li className="nav-item">
                <p onClick={() => navigate("/add_product")} className={`nav-link ${textColorClass}`} style={{ cursor: "pointer" }}>
                  Add Product
                </p>
              </li>
              <li className="nav-item dropdown">
                <p
                  className={`nav-link dropdown-toggle ${textColorClass}`}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer" }}
                >
                  Categories
                </p>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button className="dropdown-item" onClick={() => handleCategorySelect(category)}>
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <p
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                  }}
                  className={`nav-link ${textColorClass}`}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </p>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <button className="theme-btn btn btn-outline-secondary" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-sun-fill"></i>
                ) : (
                  <i className="bi bi-moon-fill"></i>
                )}
              </button>

              <p
                className={`nav-link ${textColorClass}`}
                onClick={() => navigate("/cart")}
                style={{ cursor: "pointer", marginBottom: 0 }}
              >
                <i className="bi bi-cart me-2">Cart</i>
              </p>

              <div className="position-relative">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {showSearchResults && (
                  <ul
                    className="list-group position-absolute mt-2 w-100"
                    style={{ zIndex: 1000 }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li
                          key={result.id}
                          className="list-group-item"
                          onMouseDown={() => navigate(`/product/${result.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {result.name}
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item text-danger">
                          No Product with such Name
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
