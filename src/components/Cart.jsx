import React, { useEffect, useState } from "react";
import API from "../API";
import { Button, Card, CardContent, Typography } from "@mui/material";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const cartResponse = await API.get("api/cart");
      const itemsWithImages = await Promise.all(
        cartResponse.data.map(async (item) => {
          const imageResponse = await API.get(`api/product/${item.id}/image`, {
            responseType: "blob"
          });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          return { ...item, imageUrl };
        })
      );
      setCartItems(itemsWithImages);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const handleCheckout = async (productId) => {
    try {
      const response = await API.post(`api/product/checkout/${productId}`);
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        cartItems.map((item) => (
          <Card
            key={item.id}
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              padding: "1rem"
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: "150px", height: "150px", objectFit: "cover", marginRight: "1rem" }}
              />
            )}

            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography color="textSecondary">Price: ₹{item.price}</Typography>
            </CardContent>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCheckout(item.id)}
            >
              Checkout
            </Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default Cart;
