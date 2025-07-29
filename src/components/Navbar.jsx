import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const navigate = useNavigate();

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.get("api/products");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <p className="navbar-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
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
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <p className="nav-link active" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                    Login
                  </p>
                </li>
                <li className="nav-item">
                  <p className="nav-link active" onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
                    Register
                  </p>
                </li>
                <li className="nav-item">
                  <p className="nav-link active" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    Home
                  </p>
                </li>
                <li className="nav-item">
                  <p className="nav-link" onClick={() => navigate("/add_product")} style={{ cursor: "pointer" }}>
                    Add Product
                  </p>
                </li>
                <li className="nav-item dropdown">
                  <p
                    className="nav-link dropdown-toggle"
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
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
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
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </p>
                </li>
              </ul>

              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-sun-fill"></i>
                ) : (
                  <i className="bi bi-moon-fill"></i>
                )}
              </button>

              <div className="d-flex align-items-center cart">
                <p
                  onClick={() => navigate("/cart")}
                  className="nav-link text-dark"
                  style={{ cursor: "pointer", marginBottom: 0 }}
                >
                  <i className="bi bi-cart me-2">Cart</i>
                </p>

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
                  <ul className="list-group position-absolute mt-2" style={{ zIndex: 1000, width: '100%' }}>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li
                          key={result.id}
                          className="list-group-item"
                          style={{ cursor: "pointer" }}
                          onMouseDown={() => navigate(`/product/${result.id}`)} // use onMouseDown to avoid blur before click
                        >
                          {result.name}
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <p className="no-results-message p-2">No Product with such Name</p>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
