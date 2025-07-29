import React, { useEffect, useState } from "react";
import API from "../API";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await API.get("api/cart");

      const itemsWithImages = await Promise.all(
        data.map(async (item) => {
          try {
            const imageRes = await API.get(`api/product/${item.id}/image`, {
              responseType: "blob",
            });
            const imageUrl = URL.createObjectURL(imageRes.data);
            return { ...item, imageUrl };
          } catch (err) {
            console.error(`Error loading image for product ${item.id}`, err);
            return { ...item, imageUrl: null };
          }
        })
      );

      setCartItems(itemsWithImages);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (productId) => {
    try {
      await API.post(`api/product/checkout/${productId}`);
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Your cart is empty.
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.map(({ id, name, price, imageUrl }) => (
        <Card
          key={id}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            p: 2,
          }}
        >
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt={name}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 1,
                mr: 2,
              }}
            />
          )}

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{name}</Typography>
            <Typography color="text.secondary">₹{price}</Typography>
          </CardContent>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCheckout(id)}
          >
            Checkout
          </Button>
        </Card>
      ))}
    </Box>
  );
};

export default Cart;
