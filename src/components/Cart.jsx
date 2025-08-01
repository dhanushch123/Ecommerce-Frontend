import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import API from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await API.get("api/products");
        const backendProductIds = response.data.map((product) => product.id);
        const updatedCartItems = cart.filter((item) =>
          backendProductIds.includes(item.id)
        );

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await API.get(`api/product/${item.id}/image`, {
                responseType: "blob",
              });

              const blobData = response.data;
              const contentType = response.headers["content-type"]; // e.g., "image/jpeg"
              const extension = contentType.split("/")[1]; // e.g., "jpeg"
              const fakeFileName = `${item.id}.${extension}`;

              const file = new File([blobData], fakeFileName, { type: contentType });
              const imageUrl = URL.createObjectURL(blobData);

              return {
                ...item,
                imageUrl,
                imageData: file,
                imageType: contentType,
                imageName: fakeFileName,
              };
            } catch (error) {
              console.error("Error fetching image:", error);
              return {
                ...item,
                imageUrl: "placeholder-image-url",
                imageData: null,
                imageType: "",
                imageName: "",
              };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const {
          imageUrl,
          imageName,
          imageData,
          imageType,
          quantity,
          ...rest
        } = item;

        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = {
          ...rest,
          stockQuantity: updatedStockQuantity,
        };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", imageData, imageName);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          })
        );

        await API.put(`api/product/${item.id}`, cartProduct, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => {
          console.log("Product updated successfully:", response.data);
        }).catch((error) => {
          console.error("Error updating product:", error);
        });
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("Error during checkout", error);
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item" style={{ display: "flex", alignContent: "center" }}>
                  <div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input type="button" value={item.quantity} readOnly />
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>

                  <div className="total-price" style={{ textAlign: "center" }}>
                    ${item.price * item.quantity}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: ${totalPrice}</div>
            <Button
              className="btn btn-primary"
              style={{ width: "100%",marginTop:"15px"}}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
