import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCreateOrderMutation } from "../../redux/features/orderAPI.js";
import Swal from "sweetalert2";
import { clearCart } from "../../redux/features/cartSlice.js";
import Loading from "../../components/Loading.jsx";
import getBaseURL from "../../utils/baseURL.js";
import SelectField from "../dashboard/additem/SelectField.jsx";
import { useUpdateItemQuantityMutation } from "../../redux/features/itemAPI.js";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { BiSolidOffer } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(
  "pk_test_51RKxVYRwuS6JdnjN1wsYRmPAilZU6KjCUFNGk6nsV1AfoMmow8Rwduag6Tl5DaHeJV8IkphmhPMat7xe2ApxHNsY002kXiYbXz"
);

const CheckOut = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateQty] = useUpdateItemQuantityMutation();
  const [shippingPrice, setShippingPrice] = useState(0);
  const [vat, setVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [showPromoList, setShowPromoList] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.newPrice * item.quantity;
  }, 0);
  const discountedSubtotal = subtotal - discountAmount;

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch(
        `${getBaseURL()}/api/payments/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal, currency: "aed" }),
        }
      );
      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    if (grandTotal > 0) {
      fetchClientSecret();
    }
  }, [grandTotal]);

  const handleClearCart = (id) => {
    dispatch(clearCart({ id }));
  };
  const defaultShippingPrices = {
    Dubai: 15.0,
    AbuDhabi: 20.0,
    Sharjah: 10.0,
    Ajman: 10.0,
    "Ras Al Khaimah": 25.0,
    Fujairah: 25.0,
    "Umm Al Quwain": 15.0,
  };

  const [shippingPrices, setShippingPrices] = useState(defaultShippingPrices);
  const shippingPricesRef = useRef(defaultShippingPrices);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser?.displayName,
      email: currentUser?.email,
      phone: "",
      address: "",
      city: "",
      country: "AE",
      state: "",
      zipcode: "",
    },
  });
  const [creatOrder, { isLoading, error }] = useCreateOrderMutation();

  const sendOrderConfirmation = async (
    email,
    orderId,
    products,
    address,
    subtotal,
    shipping,
    vat,
    totalPrice,
    customerName,
    phone,
    deliveryNotes,
    paymentId,
    discount
  ) => {
    if (
      !email ||
      !orderId ||
      !products ||
      !address ||
      !totalPrice ||
      !customerName ||
      !phone
    ) {
      console.error("❌ Email or Order ID not provided in request");
      return;
    }

    try {
      const requestBody = JSON.stringify({
        email,
        orderId,
        products,
        address,
        subtotal,
        shipping,
        vat,
        totalPrice,
        customerName,
        phone,
        deliveryNotes,
        paymentId,
        discount,
      });

      const response = await fetch(`${getBaseURL()}/api/email/confirm-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const emailResponse = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: `❌ Failed to send order Confirmation email: ${emailResponse.error} in order ID ${orderId}`,
        });
        throw new Error(
          `❌ Failed to send order Confirmation email: ${emailResponse.error} in order ID ${orderId}`
        );
      }
    } catch (error) {
      console.error("❌ Error sending Order confirmation email:", error);
    }
  };

  useEffect(() => {
    const fetchShippingPrices = async () => {
      try {
        const response = await fetch(
          `${getBaseURL()}/api/shipping-rate/get`
          // "http://localhost:5000/api/shipping-rate/get"
        );
        if (!response.ok) throw new Error("Failed to fetch shipping rates");

        const data = await response.json();
        const mergedPrices = {
          ...defaultShippingPrices,
          ...data,
        };

        setShippingPrices(mergedPrices);
        shippingPricesRef.current = mergedPrices;
      } catch (error) {
        shippingPricesRef.current = defaultShippingPrices;
      }
    };

    fetchShippingPrices();
  }, []);

  useEffect(() => {
    fetch(`${getBaseURL()}/api/promo/available`)
      .then((res) => res.json())
      .then((data) => setAvailablePromos(data))
      .catch((err) => {});
  }, []);

  const handleApplyPromo = async () => {
    setPromoError("");

    if (!promoCode) {
      setPromoError("Please enter a promo code.");
      return;
    }

    try {
      const userId = currentUser?.email?.toLowerCase();
      const res = await fetch(`${getBaseURL()}/api/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, userId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Invalid promo code.");

      const discount = (subtotal * result.discountPercentage) / 100;
      if (result.discountPercentage > 0 || result.freeShipping) {
        setDiscountPercent(result.discountPercentage || 0);
        setDiscountAmount(discount);
        setIsFreeShipping(result.freeShipping || false);
        // Optionally: setPromoError(""); // clear any previous error
      }

      const currentCity = watch("city");
      const updatedTotal = calculateFinalTotals(
        currentCity,
        discount,
        result.freeShipping
      );

      fetch(`${getBaseURL()}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: updatedTotal,
          currency: "aed",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => {});
    } catch (err) {
      setDiscountPercent(0);
      setDiscountAmount(0);
      setPromoError(err.message);
    }
  };

  const calculateFinalTotals = (
    selectedCity,
    overrideDiscount,
    overrideFreeShipping
  ) => {
    const prices = shippingPricesRef.current;
    const baseShipping = prices[selectedCity] || 30.0;
    const shipping = overrideFreeShipping ?? isFreeShipping ? 0 : baseShipping;

    const effectiveDiscount = overrideDiscount ?? discountAmount;
    const discountedSubtotal = subtotal - effectiveDiscount;

    const vatAmount = parseFloat(((discountedSubtotal * 5) / 100).toFixed(2));
    const total = parseFloat(
      (discountedSubtotal + vatAmount + shipping).toFixed(2)
    );

    setShippingPrice(shipping);
    setVat(vatAmount);
    setGrandTotal(total);

    return total;
  };

  useEffect(() => {
    const subscription = watch((values) => {
      if (values.city) {
        const amount = calculateFinalTotals(values.city, discountAmount);

        fetch(`${getBaseURL()}/api/payments/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount,
            currency: "aed",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.clientSecret) {
              setClientSecret(data.clientSecret);
            }
          })
          .catch((err) => {});
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, subtotal, discountAmount]);

  useEffect(() => {}, [stripe, elements, clientSecret, grandTotal]);

  const [cardError, setCardError] = useState("");
  useEffect(() => {
    if (promoCode.trim() === "") {
      setDiscountAmount(0);
      setDiscountPercent(0);
      setPromoError("");

      const currentCity = watch("city");
      const updatedTotal = calculateFinalTotals(currentCity, 0);

      fetch(`${getBaseURL()}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: updatedTotal,
          currency: "aed",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => {});
    }
  }, [promoCode]);

  useEffect(() => {}, [stripe, elements, clientSecret, grandTotal]);

  const PaymentStatus = ({ stripe, elements, clientSecret }) => {
    return (
      <div className="payment-status">
        <h4 className="text-sm font-semibold mb-2">Payment System Status</h4>
        <div className="space-y-1">
          <div
            className={`status-item ${
              stripe ? "text-green-600" : "text-yellow-600"
            }`}
          >
            Stripe: {stripe ? "Ready" : "Loading..."}
          </div>
          <div
            className={`status-item ${
              elements ? "text-green-600" : "text-yellow-600"
            }`}
          >
            Elements: {elements ? "Ready" : "Loading..."}
          </div>
          <div
            className={`status-item ${
              clientSecret ? "text-green-600" : "text-red-600"
            }`}
          >
            Payment Intent: {clientSecret ? "Created" : "Not Created"}
          </div>
        </div>
      </div>
    );
  };

  const handlePaymentError = (error) => {
    let message = "Payment failed";
    if (error.code) {
      switch (error.code) {
        case "incorrect_zip":
        case "incomplete_zip":
          message = "Postal code validation failed - please check UAE format";
        case "card_declined":
          message = "Card was declined";
          break;
        case "expired_card":
          message = "Card expired";
          break;
      }
    }
    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: message,
      footer: error.code ? `Code: ${error.code}` : "",
    });
  };

  const handlePaymentSuccess = async (paymentResult, data) => {
    const finalTotal = calculateFinalTotals();
    try {
      const newOrder = {
        customerName: data.name,
        email: currentUser?.email,
        address: {
          city: data.city,
          country: data.country,
          state: data.state,
          zipcode: data.zipcode,
        },
        phone: data.phone,
        products: cartItems.map((item) => ({
          productIds: item.id,
          quantity: item.quantity,
          price: item.newPrice,
          stockQuantity: item.stockQuantity,
        })),
        deliveryNotes: deliveryNotes,
        discount: discountAmount,
        promoCode: promoCode || null,
        paymentId: paymentResult.id,
        totalPrice: grandTotal,
        subtotal: subtotal,
        shipping: shippingPrice,
        vat: vat,
      };

      const response = await creatOrder(newOrder).unwrap();
      const orderId = response.orderId;

      await updateQty(
        newOrder.products.map((item) => ({
          id: item.productIds,
          stockQuantity: item.quantity,
        }))
      ).unwrap();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Order placed successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      handleClearCart();
      navigate("/orders", {
        state: {
          orderId,
          paymentId: paymentResult.id,
          discountAmount: newOrder.discount,
        },
      });

      await sendOrderConfirmation(
        currentUser.email,
        orderId,
        newOrder.products,
        newOrder.address,
        newOrder.subtotal,
        newOrder.shipping,
        newOrder.vat,
        newOrder.totalPrice,
        newOrder.customerName,
        newOrder.phone,
        newOrder.deliveryNotes,
        newOrder.paymentId,
        newOrder.discount
      );
    } catch (error) {
      Swal.fire({
        title: "Order Created - Followup Failed",
        text: error.message,
        icon: "warning",
      });
    }
  };

  // const onSubmit = async (data) => {
  //   if (!stripe || !elements || !clientSecret) {
  //     Swal.fire("Error", "Payment system not ready", "error");
  //     return;
  //   }

  //   setProcessing(true);

  //   try {
  //     const { error, paymentIntent } = await stripe.confirmCardPayment(
  //       clientSecret,
  //       {
  //         payment_method: {
  //           card: elements.getElement(PaymentElement),
  //           billing_details: {
  //             name: data.name,
  //             email: data.email,
  //             phone: data.phone,
  //             address: {
  //               line1: data.address,
  //               city: data.city,
  //               state: data.state,
  //               country: data.country || "AE",
  //             },
  //           },
  //         },
  //       }
  //     );

  //     if (error) {
  //       handlePaymentError(error);
  //       return;
  //     }

  //     if (paymentIntent && paymentIntent.status === "succeeded") {
  //       await handlePaymentSuccess(paymentIntent, data);
  //       handleClearCart();
  //       return;
  //     }
  //     console.log("paymentIntent", paymentIntent);
  //   } catch (error) {
  //     handlePaymentError(error);
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  const onSubmit = async (data) => {
    if (!stripe || !elements || !clientSecret) {
      Swal.fire("Error", "Payment system not ready", "error");
      return;
    }

    setProcessing(true);

    try {
      // First submit the elements to collect form data
      await elements.submit();

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements, // Pass the elements instance
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-completion`,
          payment_method_data: {
            billing_details: {
              name: data.name,
              email: data.email,
              phone: data.phone,
              address: {
                line1: data.address,
                city: data.city,
                state: data.state,
                country: data.country || "AE",
              },
            },
          },
        },
        redirect: "if_required",
      });

      // Process result
      if (error) {
        handlePaymentError(error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await handlePaymentSuccess(paymentIntent, data);
      }
    } catch (error) {
      handlePaymentError(error);
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
    >
      <div className="lg:col-span-3">
        <h3 className="font-semibold text-gray-600 dark:text-gray-300 text-lg mb-3">
          Personal Information
        </h3>
      </div>

      <div className="lg:col-span-3">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-5">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="md:col-span-5">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="md:col-span-5">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              {...register("phone", { required: "Phone is required" })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <label htmlFor="address">Address / Street</label>
            <input
              type="text"
              id="address"
              {...register("address", { required: "Address is required" })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              {...register("city", { required: "City is required" })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="country">Country</label>
            <SelectField
              id="country"
              register={register}
              name="country"
              options={[
                { value: "AE", label: "United Arab Emirates" },
                { value: "US", label: "United States" },
                { value: "GB", label: "United Kingdom" },
              ]}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="state">State / Province</label>
            <input
              type="text"
              id="state"
              {...register("state", { required: "State is required" })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="md:col-span-1">
            <label htmlFor="zipcode">Zipcode</label>
            <input
              type="text"
              id="zipcode"
              {...register("zipcode", { required: "Zipcode is required" })}
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-700"
            />
            {errors.zipcode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.zipcode.message}
              </p>
            )}
          </div>

          <div className="md:col-span-5">
            <label
              htmlFor="payment-element"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Card Details
            </label>
            <div className="p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 shadow-sm">
              <PaymentElement
                id="payment-element"
                onChange={(event) => {
                  setIsCardComplete(!event.empty);
                  setCardError(event.error?.message || "");
                }}
              />
            </div>
            {cardError && (
              <p className="text-sm text-red-500 mt-2">{cardError}</p>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="agreement"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="rounded"
              />
              <label
                htmlFor="agreement"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          <div className="md:col-span-5 mt-3">
            <button
              type="submit"
              disabled={!stripe || processing || !isChecked || !isCardComplete}
              className={`${
                !isChecked || !stripe || processing || !isCardComplete
                  ? "bg-gray-400 cursor-not-allowed opacity-50 py-2 px-4 rounded"
                  : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              }`}
            >
              {processing ? "Processing..." : `Complete Payment`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckOut;
