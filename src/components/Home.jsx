import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"
import { useLocation, useNavigate } from "react-router-dom";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const role = queryParams.get("role");

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate('/')
      
    }
  }, [location.search, navigate]);


  useEffect(() => {
    
     

    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
      // desc
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await API.get(
                `api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
      <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
      </h2>
    );
  }
  return (
    <>
      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            console.log(product)
            const { id, brand, name, price, availability, imageUrl } =
              product;
            const cardStyle = {
              width: "18rem",
              height: "12rem",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
              backgroundColor: availability ? "#fff" : "#ccc",
            };
            return (
              <div
                className="card mb-3"
                style={{
                  width: "250px",
                  height: "400px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden", 
                  
                  backgroundColor: availability ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent:'flex-start',
                  alignItems:'stretch'
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "150px", 
                      objectFit: "cover",  
                      padding: "5px",
                      margin: "0",
                      borderRadius: "10px 10px 10px 10px", 
                    }}
                  />
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{ margin: "0 0 10px 0", fontSize: "1.2rem",height : "50px",overflow : "clip" }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i
                        className="card-brand"
                        style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                      >
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr className="hr-line" style={{ margin: "10px 0" }} />
                    <div className="home-cart-price">
                      <h5
                        className="card-text"
                        style={{ fontWeight: "600", fontSize: "1.1rem",marginBottom:'5px' }}
                      >
                        <i class="bi bi-currency-rupee"></i>
                        {price}
                      </h5>
                    </div>
                    <button
                      className="btn-hover color-9"
                      style={{margin:'15px 25px 0px '}}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                        alert("Added to cart successfully!!")
                      }}
                      disabled={!availability}
                    >
                      {availability ? "Add to Cart" : "Out of Stock"}
                    </button> 
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
