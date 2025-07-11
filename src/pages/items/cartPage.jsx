import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  itemQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/features/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const handleIncreaseQty = (id, quantity, stockQuantity) => {
    if (typeof id === "string" || typeof id === "number") {
      const newQuantity = quantity + 1;
      dispatch(itemQuantity({ id, quantity: newQuantity, stockQuantity }));
      const updatedCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      sessionStorage.setItem("itemsInCart", JSON.stringify(updatedCartItems));
    }
  };

  const handleDecreaseQty = (id, quantity, stockQuantity) => {
    if (typeof id === "string" || typeof id === "number") {
      if (quantity > 1) {
        const newQuantity = quantity - 1;
        dispatch(itemQuantity({ id, quantity: newQuantity, stockQuantity }));
        const updatedCartItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        sessionStorage.setItem("itemsInCart", JSON.stringify(updatedCartItems));
      }
    }
  };

  const handleRemoveFromCart = (id) => {
    if (typeof id === "string" || typeof id === "number") {
      dispatch(removeFromCart({ id }));
    }
  };
  const handleClearCart = (id) => {
    dispatch(clearCart({ id }));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.newPrice * item.quantity;
  }, 0);

  return (
    <>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white dark:bg-gray-900 shadow-xl w-full">
        <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Shopping cart
            </div>
            <div className="mt-2 sm:mt-0 ml-0 sm:ml-3 flex h-7 items-center">
              <button
                type="button"
                onClick={handleClearCart}
                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
              >
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              {cartItems.length > 0 ? (
                <ul
                  role="list"
                  className="-my-6 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col sm:flex-row py-6"
                    >
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 mx-auto sm:mx-0">
                        <img
                          alt=""
                          src={item?.coverImage}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex flex-col sm:flex-row justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                            <h3>
                              <Link to="/">{item.title}</Link>
                            </h3>
                            <p className="sm:ml-4">
                              AED {(item.newPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                            <strong>Category:</strong> {item.category}
                          </p>
                          {item.stockQuantity === 0 ? (
                            <p className="text-sm font-semibold text-red-600">
                              Out of stock!
                            </p>
                          ) : item.stockQuantity <= 5 ? (
                            <p className="text-sm text-yellow-600">
                              Only {item.stockQuantity} left!
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-1 items-center justify-between text-sm mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                              onClick={() =>
                                handleDecreaseQty(
                                  item.id,
                                  item.quantity,
                                  item.stockQuantity
                                )
                              }
                            >
                              -
                            </button>
                            <p className="text-gray-500 dark:text-gray-300">
                              <strong>Qty:</strong> {item.quantity}
                            </p>
                            <button
                              type="button"
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                              onClick={() =>
                                handleIncreaseQty(
                                  item.id,
                                  item.quantity,
                                  item.stockQuantity
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No Items In Cart
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-2 sm:px-6 py-6">
          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
            <p>Subtotal</p>
            <p>AED {subtotal.toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="btn-primary flex items-center justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center text-center text-sm text-gray-500 dark:text-gray-400 gap-2">
            <Link to="/">
              or
              <button
                type="button"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 ml-1"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
