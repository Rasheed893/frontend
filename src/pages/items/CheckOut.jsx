// import { Children, React, useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useCreateOrderMutation } from "../../redux/features/orderAPI.js";
// import Swal from "sweetalert2";
// import { clearCart, itemQuantity } from "../../redux/features/cartSlice.js";
// import Loading from "../../components/Loading.jsx";
// import getBaseURL from "../../utils/baseURL.js";
// import SelectField from "../dashboard/additem/SelectField.jsx";
// import { useUpdateItemQuantityMutation } from "../../redux/features/itemAPI.js";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { toast } from "react-toastify";
// import { BiSolidOffer } from "react-icons/bi";

// import "react-toastify/dist/ReactToastify.css";
// // CheckOut.jsx

// const CheckOut = () => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [isCardComplete, setIsCardComplete] = useState(false);
//   const cartItems = useSelector((state) => state.cart.cartItems);
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [updateQty] = useUpdateItemQuantityMutation();
//   const [shippingPrice, setShippingPrice] = useState(0);
//   const [vat, setVat] = useState(0);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [deliveryNotes, setDeliveryNotes] = useState("");
//   // Promo code state
//   const [promoCode, setPromoCode] = useState("");
//   const [discountPercent, setDiscountPercent] = useState(0);
//   const [promoError, setPromoError] = useState("");
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [isFreeShipping, setIsFreeShipping] = useState(false);
//   const [availablePromos, setAvailablePromos] = useState([]);
//   const [showPromoList, setShowPromoList] = useState(false);
//   const [showPromoModal, setShowPromoModal] = useState(false);

//   // Stripe things
//   const stripe = useStripe();
//   const elements = useElements();
//   const [clientSecret, setClientSecret] = useState("");
//   const [processing, setProcessing] = useState(false);
//   // if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY?.startsWith("pk_test_")) {
//   //   throw new Error("Invalid Stripe public key format");
//   // }
//   const subtotal = cartItems.reduce((acc, item) => {
//     return acc + item.newPrice * item.quantity;
//   }, 0);
//   const discountedSubtotal = subtotal - discountAmount;
//   console.log(discountAmount);
//   // console.log("Cart Items:", cartItems);
//   // console.log("Cart Items:", subtotal);

//   const handleClearCart = (id) => {
//     dispatch(clearCart({ id }));
//   };
//   const defaultShippingPrices = {
//     Dubai: 15.0,
//     AbuDhabi: 20.0,
//     Sharjah: 10.0,
//     Ajman: 10.0,
//     "Ras Al Khaimah": 25.0,
//     Fujairah: 25.0,
//     "Umm Al Quwain": 15.0,
//   };

//   const [shippingPrices, setShippingPrices] = useState(defaultShippingPrices);
//   const shippingPricesRef = useRef(defaultShippingPrices);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: currentUser?.displayName,
//       email: currentUser?.email,
//       phone: "",
//       address: "",
//       city: "",
//       country: "AE",
//       state: "",
//       zipcode: "",
//     },
//   });
//   const [creatOrder, { isLoading, error }] = useCreateOrderMutation();

//   const sendOrderConfirmation = async (
//     email,
//     orderId,
//     products,
//     address,
//     subtotal,
//     shipping,
//     vat,
//     totalPrice,
//     customerName,
//     phone,
//     deliveryNotes,
//     paymentId,
//     discount
//   ) => {
//     if (
//       !email ||
//       !orderId ||
//       !products ||
//       !address ||
//       !totalPrice ||
//       !customerName ||
//       !phone
//     ) {
//       console.error("❌ Email or Order ID not provided in request");
//       return;
//     }

//     try {
//       const requestBody = JSON.stringify({
//         email,
//         orderId,
//         products,
//         address,
//         subtotal,
//         shipping,
//         vat,
//         totalPrice,
//         customerName,
//         phone,
//         deliveryNotes,
//         paymentId,
//         discount,
//       });
//       console.log("Discount amount", discount);
//       console.log("📡 Sending request body:", requestBody); // ✅ Log request body

//       const response = await fetch(`${getBaseURL()}/api/email/confirm-order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: requestBody, // ✅ Ensure email is passed correctly
//       });

//       const emailResponse = await response.json();
//       console.log("✅ API Response:", emailResponse);

//       if (!response.ok) {
//         Swal.fire({
//           title: `❌ Failed to send order Confirmation email: ${emailResponse.error} in order ID ${orderId}`,
//         });
//         throw new Error(
//           `❌ Failed to send order Confirmation email: ${emailResponse.error} in order ID ${orderId}`
//         );
//       }

//       console.log("✅ Order confirmation email sent successfully");
//     } catch (error) {
//       console.error("❌ Error sending Order confirmation email:", error);
//     }
//   };
//   useEffect(() => {
//     const fetchShippingPrices = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/shipping-rate/get"
//         );
//         if (!response.ok) throw new Error("Failed to fetch shipping rates");

//         const data = await response.json();

//         // Merge API data with default structure
//         const mergedPrices = {
//           ...defaultShippingPrices,
//           ...data,
//         };

//         setShippingPrices(mergedPrices);
//         shippingPricesRef.current = mergedPrices;
//       } catch (error) {
//         console.error("Error fetching shipping rates:", error);
//         // Maintain default prices on error
//         shippingPricesRef.current = defaultShippingPrices;
//       }
//     };

//     fetchShippingPrices();
//   }, []);

//   // Fetch available promo codes
//   useEffect(() => {
//     fetch(`${getBaseURL()}/api/promo/available`)
//       .then((res) => res.json())
//       .then((data) => setAvailablePromos(data))
//       .catch((err) => console.error("Error loading promos:", err));
//   }, []);

//   // Add a promo code
//   const handleApplyPromo = async () => {
//     setPromoError("");

//     if (!promoCode) {
//       setPromoError("Please enter a promo code.");
//       return;
//     }

//     try {
//       const userId = currentUser?.email?.toLowerCase();
//       const res = await fetch(`${getBaseURL()}/api/promo/validate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: promoCode, userId }),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Invalid promo code.");

//       const discount = (subtotal * result.discountPercentage) / 100;
//       setDiscountPercent(result.discountPercentage);
//       setDiscountAmount(discount);
//       setIsFreeShipping(result.freeShipping || false);

//       const currentCity = watch("city");
//       const updatedTotal = calculateFinalTotals(
//         currentCity,
//         discount,
//         result.freeShipping
//       );

//       // ✅ NEW: Update Stripe payment intent with discounted total
//       fetch(`${getBaseURL()}/api/payments/create-payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: updatedTotal,
//           currency: "aed",
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.clientSecret) {
//             setClientSecret(data.clientSecret);
//           } else {
//             console.error("Stripe clientSecret missing after promo:", data);
//           }
//         })
//         .catch((err) => {
//           console.error("❌ Error updating Stripe after promo:", err);
//         });
//     } catch (err) {
//       setDiscountPercent(0);
//       setDiscountAmount(0);
//       setPromoError(err.message);
//     }
//   };

//   const calculateFinalTotals = (
//     selectedCity,
//     overrideDiscount,
//     overrideFreeShipping
//   ) => {
//     const prices = shippingPricesRef.current;
//     const baseShipping = prices[selectedCity] || 30.0;
//     const shipping = overrideFreeShipping ?? isFreeShipping ? 0 : baseShipping;

//     const effectiveDiscount = overrideDiscount ?? discountAmount;
//     const discountedSubtotal = subtotal - effectiveDiscount;

//     const vatAmount = parseFloat(((discountedSubtotal * 5) / 100).toFixed(2));
//     const total = parseFloat(
//       (discountedSubtotal + vatAmount + shipping).toFixed(2)
//     );

//     setShippingPrice(shipping);
//     setVat(vatAmount);
//     setGrandTotal(total);

//     return total;
//   };

//   useEffect(() => {
//     const subscription = watch((values) => {
//       if (values.city) {
//         const amount = calculateFinalTotals(values.city, discountAmount);

//         // ✅ Create Stripe payment intent with correct amount
//         fetch(`${getBaseURL()}/api/payments/create-payment-intent`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: amount, // Stripe expects amount in cents
//             currency: "aed",
//           }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.clientSecret) {
//               setClientSecret(data.clientSecret);
//             } else {
//               console.error("Stripe clientSecret missing:", data);
//             }
//           })
//           .catch((err) =>
//             console.error("❌ Error fetching clientSecret from backend:", err)
//           );
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [watch, subtotal, discountAmount]);
//   // console.log("watching ", subtotal);

//   useEffect(() => {
//     console.log("🧾 Stripe Status", {
//       stripe: !!stripe,
//       elements: !!elements,
//       clientSecret: !!clientSecret,
//       amount: grandTotal,
//     });
//   }, [stripe, elements, clientSecret, grandTotal]);

//   // Payment logic
//   const [cardError, setCardError] = useState("");
//   useEffect(() => {
//     if (promoCode.trim() === "") {
//       // Reset discount
//       setDiscountAmount(0);
//       setDiscountPercent(0);
//       setPromoError("");

//       const currentCity = watch("city");
//       const updatedTotal = calculateFinalTotals(currentCity, 0);

//       // ✅ Refresh Stripe with normal price
//       fetch(`${getBaseURL()}/api/payments/create-payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: updatedTotal,
//           currency: "aed",
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.clientSecret) {
//             setClientSecret(data.clientSecret);
//           } else {
//             console.error(
//               "Stripe clientSecret missing after clearing promo:",
//               data
//             );
//           }
//         })
//         .catch((err) =>
//           console.error("❌ Error updating Stripe after clearing promo:", err)
//         );
//     }
//   }, [promoCode]);

//   useEffect(() => {
//     console.log("Current Stripe Status:", {
//       stripe: !!stripe,
//       elements: !!elements,
//       clientSecret: !!clientSecret,
//       amount: grandTotal,
//     });
//   }, [stripe, elements, clientSecret, grandTotal]);

//   const PaymentStatus = ({ stripe, elements, clientSecret }) => {
//     return (
//       <div className="payment-status">
//         <h4 className="text-sm font-semibold mb-2">Payment System Status</h4>
//         <div className="space-y-1">
//           <div
//             className={`status-item ${
//               stripe ? "text-green-600" : "text-yellow-600"
//             }`}
//           >
//             Stripe: {stripe ? "Ready" : "Loading..."}
//           </div>
//           <div
//             className={`status-item ${
//               elements ? "text-green-600" : "text-yellow-600"
//             }`}
//           >
//             Elements: {elements ? "Ready" : "Loading..."}
//           </div>
//           <div
//             className={`status-item ${
//               clientSecret ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             Payment Intent: {clientSecret ? "Created" : "Not Created"}
//           </div>
//         </div>
//       </div>
//     );
//   };
//   const handlePaymentError = (error) => {
//     let message = "Payment failed";

//     if (error.code) {
//       switch (error.code) {
//         case "incorrect_zip":
//         case "incomplete_zip":
//           message = "Postal code validation failed - please check UAE format";
//         case "card_declined":
//           message = "Card was declined";
//           break;
//         case "expired_card":
//           message = "Card expired";
//           break;
//       }
//     }

//     Swal.fire({
//       icon: "error",
//       title: "Payment Failed",
//       text: message,
//       footer: error.code ? `Code: ${error.code}` : "",
//     });
//   };

//   const handlePaymentSuccess = async (paymentResult, data) => {
//     const finalTotal = calculateFinalTotals();
//     console.log("Final Total:", finalTotal);
//     try {
//       // 1. Build order with payment ID
//       const newOrder = {
//         customerName: data.name,
//         email: currentUser?.email,
//         address: {
//           city: data.city,
//           country: data.country,
//           state: data.state,
//           zipcode: data.zipcode,
//         },
//         phone: data.phone,
//         products: cartItems.map((item) => ({
//           productIds: item.id,
//           quantity: item.quantity,
//           price: item.newPrice,
//           stockQuantity: item.stockQuantity,
//         })),
//         // totalPrice: subtotal,
//         deliveryNotes: deliveryNotes,

//         discount: discountAmount,
//         promoCode: promoCode || null,

//         paymentId: paymentResult.id,
//         totalPrice: grandTotal, // Use final amount
//         subtotal: subtotal,
//         shipping: shippingPrice,
//         vat: vat,
//       };

//       // 2. Create order
//       const response = await creatOrder(newOrder).unwrap();
//       const orderId = response.orderId;

//       // 3. Update stock (verify API expects array)
//       await updateQty(
//         newOrder.products.map((item) => ({
//           id: item.productIds,
//           stockQuantity: item.quantity,
//         }))
//       ).unwrap();

//       Swal.fire({
//         toast: true,
//         position: "top-end",
//         icon: "success",
//         title: "Order placed successfully!",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//           toast.addEventListener("mouseenter", Swal.stopTimer);
//           toast.addEventListener("mouseleave", Swal.resumeTimer);
//         },
//       });
//       // 5. Clear cart
//       handleClearCart();
//       // 6. Redirect
//       navigate("/orders", {
//         state: {
//           orderId,
//           paymentId: paymentResult.id,
//           discountAmount: newOrder.discount,
//         },
//       });
//       // console.log("🧪 discountAmount from newOrder:", newOrder.discountAmount);

//       // 4. Send email
//       await sendOrderConfirmation(
//         currentUser.email,
//         orderId,
//         newOrder.products,
//         newOrder.address,
//         newOrder.subtotal,
//         newOrder.shipping,
//         newOrder.vat,
//         newOrder.totalPrice,
//         newOrder.customerName,
//         newOrder.phone,
//         newOrder.deliveryNotes,
//         newOrder.paymentId,
//         newOrder.discount
//       );
//     } catch (error) {
//       console.error("Order processing error:", error);
//       Swal.fire({
//         title: "Order Created - Followup Failed",
//         text: error.message,
//         icon: "warning",
//       });
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!stripe || !elements || !clientSecret) {
//       Swal.fire("Error", "Payment system not ready", "error");
//       return;
//     }

//     setProcessing(true);

//     try {
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//             billing_details: {
//               name: data.name,
//               email: data.email,
//               phone: data.phone,
//               address: {
//                 line1: data.address,
//                 city: data.city,
//                 state: data.state,
//                 // postal_code: data.zipcode, // ✅ Here!
//                 country: data.country || "AE", // ✅ Important
//               },
//             },
//           },
//         }
//       );
//       console.log("🔍 Raw Stripe response:", { error, paymentIntent });
//       console.log("💳 Stripe PaymentIntent before charging:", paymentIntent);

//       console.log("Country Code:", data.country);

//       if (error) {
//         console.error("❌ Payment error object:", error); // ✅ Full error object
//         handlePaymentError(error); // Using the error handler
//         console.log("❌ Payment failed:", error.message || "Unknown error");
//         return;
//       }

//       if (paymentIntent && paymentIntent.status === "succeeded") {
//         console.log("✅ Payment succeeded!");
//         await handlePaymentSuccess(paymentIntent, data);
//         handleClearCart();
//         return;
//       }
//       console.log("🔍 Raw Stripe response:", { error, paymentIntent });
//     } catch (error) {
//       handlePaymentError(error); // Catch any unexpected errors
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div>
//       <section>
//         <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
//           <div className="container max-w-screen-lg mx-auto">
//             <div>
//               <div>
//                 <h2 className="font-semibold text-xl text-gray-600 mb-2">
//                   Card Payment
//                 </h2>
//                 {discountPercent > 0 ? (
//                   <>
//                     <p>
//                       Subtotal: <s>AED {subtotal.toFixed(2)}</s>{" "}
//                       <span className="text-green-600 font-semibold">
//                         AED {discountedSubtotal.toFixed(2)} ({discountPercent}%
//                         off)
//                       </span>
//                     </p>
//                   </>
//                 ) : (
//                   <p>Subtotal: AED {subtotal.toFixed(2)}</p>
//                 )}

//                 <p>VAT (5%): AED {vat.toFixed(2)}</p>
//                 <p>
//                   Shipping: AED{" "}
//                   {isFreeShipping ? (
//                     <span className="text-green-600 font-medium">
//                       0.00 (Free Shipping Applied)
//                     </span>
//                   ) : (
//                     shippingPrice.toFixed(2)
//                   )}
//                 </p>

//                 <p className="font-bold text-lg">
//                   Grand Total: AED {grandTotal.toFixed(2)}
//                 </p>
//               </div>

//               <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//                 <form
//                   onSubmit={handleSubmit(onSubmit)}
//                   className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
//                 >
//                   <div className="text-gray-600">
//                     <p className="font-medium text-lg">Personal Details</p>
//                     <p>Please fill out all the fields.</p>
//                   </div>

//                   <div className="lg:col-span-2">
//                     <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
//                       <div className="md:col-span-5">
//                         <label htmlFor="full_name">Full Name</label>
//                         <input
//                           {...register("name", {
//                             required: "Name is required",
//                           })}
//                           type="text"
//                           name="name"
//                           id="name"
//                           placeholder="Full Name"
//                           className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                         />
//                         <p className="text-sm text-red-500">
//                           {errors.name?.message}
//                         </p>
//                       </div>

//                       <div className="md:col-span-5">
//                         <label html="email">Email Address</label>
//                         <input
//                           {...register("email", {
//                             required: "Email is required",
//                           })}
//                           type="text"
//                           name="email"
//                           id="email"
//                           className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                           disabled
//                           defaultValue={currentUser?.email}
//                           placeholder="email@domain.com"
//                         />
//                         <p className="text-sm text-red-500">
//                           {errors.email?.message}
//                         </p>
//                       </div>
//                       <div className="md:col-span-5">
//                         <label html="phone">Phone Number</label>
//                         <input
//                           {...register("phone", {
//                             required: "Phone Number is required",
//                           })}
//                           type="number"
//                           name="phone"
//                           id="phone"
//                           className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                           placeholder="971xxxxxxx"
//                         />
//                         <p className="text-sm text-red-500">
//                           {errors.phone?.message}
//                         </p>
//                       </div>

//                       <div className="md:col-span-3">
//                         <label htmlFor="address">Address / Street</label>
//                         <input
//                           {...register("address", {
//                             required: "Address is required",
//                           })}
//                           type="text"
//                           name="address"
//                           id="address"
//                           className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                           placeholder="Address"
//                         />
//                         <p className="text-sm text-red-500">
//                           {errors.address?.message}
//                         </p>
//                       </div>

//                       <div className="md:col-span-2">
//                         {/* <label htmlFor="city">City</label> */}
//                         <SelectField
//                           {...register("address", {
//                             required: "Address is required",
//                           })}
//                           label="City"
//                           name="city"
//                           options={[
//                             { value: "", label: "Select A City" },
//                             { value: "Dubai", label: "Dubai" },
//                             { value: "AbuDhabi", label: "AbuDhabi" },
//                             { value: "Sharjah", label: "Sharjah" },
//                             { value: "Ajman", label: "Ajman" },
//                             {
//                               value: "Ras Al Khaimah",
//                               label: "Ras Al Khaimah",
//                             },
//                             { value: "Fujairah", label: "Fujairah" },
//                             { value: "Umm Al Quwain", label: "Umm Al Quwain" },
//                             // Add more options as needed
//                           ]}
//                           register={register}
//                         />
//                         <p className="text-sm text-red-500">
//                           {errors.city?.message}
//                         </p>
//                       </div>

//                       <div className="md:col-span-2">
//                         <label htmlFor="country">Country / region</label>
//                         <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
//                           <input
//                             {...register("country", {
//                               required: "Country is required",
//                             })}
//                             name="country"
//                             id="country"
//                             placeholder="Country"
//                             className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
//                           />

//                           <button
//                             tabIndex="-1"
//                             className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600"
//                           >
//                             <svg
//                               className="w-4 h-4 mx-2 fill-current"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <line x1="18" y1="6" x2="6" y2="18"></line>
//                               <line x1="6" y1="6" x2="18" y2="18"></line>
//                             </svg>
//                           </button>
//                           <button
//                             tabIndex="-1"
//                             className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
//                           >
//                             <svg
//                               className="w-4 h-4 mx-2 fill-current"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <polyline points="18 15 12 9 6 15"></polyline>
//                             </svg>
//                           </button>
//                         </div>
//                         <p className="text-sm text-red-500">
//                           {errors.country?.message}
//                         </p>
//                       </div>

//                       <div className="md:col-span-2">
//                         <label htmlFor="state">State / province</label>
//                         <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
//                           <input
//                             {...register("state", {
//                               required: "State is required", // Add validation
//                             })}
//                             name="state"
//                             id="state"
//                             placeholder="State"
//                             className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
//                           />
//                           <button className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
//                             <svg
//                               className="w-4 h-4 mx-2 fill-current"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <line x1="18" y1="6" x2="6" y2="18"></line>
//                               <line x1="6" y1="6" x2="18" y2="18"></line>
//                             </svg>
//                           </button>
//                           <button
//                             tabIndex="-1"
//                             className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
//                           >
//                             <svg
//                               className="w-4 h-4 mx-2 fill-current"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <polyline points="18 15 12 9 6 15"></polyline>
//                             </svg>
//                           </button>
//                         </div>
//                       </div>

//                       <div className="md:col-span-1">
//                         <label htmlFor="zipcode">Zipcode</label>
//                         <input
//                           {...register("zipcode")}
//                           type="text"
//                           name="zipcode"
//                           id="zipcode"
//                           className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                           placeholder=""
//                         />
//                       </div>
//                       {/* Promo Code */}
//                       <div className="md:col-span-3">
//                         <label htmlFor="promo">Promo Code</label>
//                         <div className="flex gap-2">
//                           <input
//                             type="text"
//                             id="promo"
//                             value={promoCode}
//                             onChange={(e) => setPromoCode(e.target.value)}
//                             className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                             placeholder="Enter promo code"
//                           />
//                           <button
//                             type="button"
//                             onClick={handleApplyPromo}
//                             className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
//                           >
//                             Apply
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setShowPromoModal(true)}
//                             className="text-sm text-blue-600 underline ml-2"
//                             title="Show Available Promo Codes"
//                           >
//                             <BiSolidOffer className="size-5" />
//                             {/* Show Available Promo Codes */}
//                           </button>
//                         </div>
//                         {promoError && (
//                           <p className="text-sm text-red-500">{promoError}</p>
//                         )}
//                         {discountPercent > 0 && (
//                           <p className="text-sm text-green-600">
//                             Promo applied: {discountPercent}% off (−AED{" "}
//                             {discountAmount.toFixed(2)})
//                           </p>
//                         )}
//                       </div>

//                       {/* Delivery Notes */}
//                       <div className="md:col-span-5">
//                         <label htmlFor="deliveryNotes">Delivery Notes</label>
//                         <textarea
//                           id="deliveryNotes"
//                           name="deliveryNotes"
//                           value={deliveryNotes}
//                           onChange={(e) => setDeliveryNotes(e.target.value)}
//                           placeholder="e.g. Leave at reception"
//                           className="h-20 border mt-1 rounded px-4 w-full bg-gray-50"
//                         ></textarea>
//                       </div>
//                       <div className="md:col-span-5 mb-4">
//                         <PaymentStatus
//                           stripe={stripe}
//                           elements={elements}
//                           clientSecret={clientSecret}
//                         />
//                       </div>
//                       {/* Card Details */}
//                       <div className="md:col-span-5">
//                         <label
//                           htmlFor="card-element"
//                           className="block mb-2 text-sm font-medium text-gray-700"
//                         >
//                           Card Details
//                         </label>
//                         <div className="p-4 border border-gray-300 rounded bg-white shadow-sm">
//                           <CardElement
//                             id="card-element"
//                             onChange={(event) => {
//                               setIsCardComplete(!event.empty);
//                               setCardError(event.error?.message || "");
//                             }}
//                             options={{
//                               hidePostalCode: true,
//                               style: {
//                                 base: {
//                                   fontSize: "16px",
//                                   color: "#32325d",
//                                   "::placeholder": {
//                                     color: "#a0aec0",
//                                   },
//                                 },
//                                 invalid: {
//                                   color: "#fa755a",
//                                 },
//                               },
//                             }}
//                           />
//                         </div>
//                         {cardError && (
//                           <p className="text-sm text-red-500 mt-2">
//                             {cardError}
//                           </p>
//                         )}
//                       </div>

//                       <div className="text-sm text-gray-500 mt-2">
//                         Test card: 4242 4242 4242 4242 | Any future date | Any 3
//                         digits
//                       </div>
//                       {/* Submit Button */}

//                       <div className="md:col-span-5 mt-3">
//                         <div className="inline-flex items-center">
//                           <input
//                             type="checkbox"
//                             name="billing_same"
//                             id="billing_same"
//                             className="form-checkbox"
//                             onChange={(e) => setIsChecked(e.target.checked)}
//                             // onChange={() => setIsChecked(true)}
//                           />
//                           <label htmlFor="billing_same" className="ml-2 ">
//                             I am aggree to the{" "}
//                             <Link className="underline underline-offset-2 text-blue-600">
//                               Terms & Conditions
//                             </Link>{" "}
//                             and{" "}
//                             <Link className="underline underline-offset-2 text-blue-600">
//                               Shoping Policy.
//                             </Link>
//                           </label>
//                         </div>
//                       </div>
//                       <div className="md:col-span-5 text-right">
//                         <div className="inline-flex items-end">
//                           <button
//                             type="submit"
//                             disabled={
//                               !stripe ||
//                               processing ||
//                               !isChecked ||
//                               !isCardComplete
//                             }
//                             className={`${
//                               !isChecked ||
//                               !stripe ||
//                               processing ||
//                               !isCardComplete
//                                 ? "bg-gray-400 cursor-not-allowed opacity-50 py-2 px-4 rounded"
//                                 : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                             }`}
//                           >
//                             {processing
//                               ? "Processing..."
//                               : `Pay AED ${grandTotal.toFixed(2)}`}
//                           </button>
//                         </div>
//                       </div>

//                       {/* <div className="md:col-span-5 text-right">
//                         <div className="inline-flex items-end">
//                           <button
//                             disabled={!isChecked}
//                             className={`${
//                               !isChecked
//                                 ? "bg-gray-400 cursor-not-allowed opacity-50 py-2 px-4 rounded"
//                                 : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                             }`}
//                           >
//                             Place an Order
//                           </button>
//                         </div>
//                       </div> */}
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* Show Promo Modal */}
//       {showPromoModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-md p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto relative">
//             <button
//               className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg"
//               onClick={() => setShowPromoModal(false)}
//             >
//               ×
//             </button>
//             <h2 className="text-lg font-semibold mb-4">
//               Available Promo Codes
//             </h2>
//             {availablePromos.length === 0 ? (
//               <p>No active promo codes.</p>
//             ) : (
//               <ul className="space-y-3 text-sm">
//                 {availablePromos.map((promo) => (
//                   <li key={promo.code} className="border-b pb-2">
//                     <p className="font-medium text-blue-700">{promo.code}</p>
//                     <p className="text-gray-700">{promo.promoDescription}</p>
//                     <div className="text-xs mt-1">
//                       {promo.discountPercentage > 0 && (
//                         <span className="text-blue-600 mr-2">
//                           {promo.discountPercentage}% Off
//                         </span>
//                       )}
//                       {promo.freeShipping && (
//                         <span className="text-green-600">Free Shipping</span>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );

// };

// export default CheckOut;

import { Children, React, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCreateOrderMutation } from "../../redux/features/orderAPI.js";
import Swal from "sweetalert2";
import { clearCart, itemQuantity } from "../../redux/features/cartSlice.js";
import Loading from "../../components/Loading.jsx";
import getBaseURL from "../../utils/baseURL.js";
import SelectField from "../dashboard/additem/SelectField.jsx";
import { useUpdateItemQuantityMutation } from "../../redux/features/itemAPI.js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { BiSolidOffer } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

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
  // Add this function to your CheckOut.jsx component
  const checkPaymentStatus = async (paymentIntentId) => {
    try {
      // Call your new backend endpoint
      const response = await fetch(
        `${getBaseURL()}/api/payments/check-payment-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const { status } = await response.json();

      // Handle different status values
      switch (status) {
        case "succeeded":
          // Payment was successful
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Your payment has been processed successfully!",
          });
          return true;
        case "requires_action":
          Swal.fire({
            icon: "warning",
            title: "Additional Authentication Required",
            text: "Please complete the authentication process.",
          });
          return false;
        case "requires_payment_method":
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Please try another payment method.",
          });
          return false;
        default:
          Swal.fire({
            icon: "info",
            title: "Payment Status",
            text: `Current status: ${status}`,
          });
          return false;
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not verify payment status. Please contact support.",
      });
      return false;
    }
  };
  const onSubmit = async (data) => {
    if (!stripe || !elements || !clientSecret) {
      Swal.fire("Error", "Payment system not ready", "error");
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
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
        }
      );

      if (error) {
        handlePaymentError(error);
        return;
      }

      if (paymentIntent) {
        // First verify the payment on the server
        const isPaymentVerified = await checkPaymentStatus(paymentIntent.id);

        if (isPaymentVerified) {
          // Only proceed if the server confirms payment success
          await handlePaymentSuccess(paymentIntent, data);
          handleClearCart();
        } else {
          // Handle verification failure
          console.log("Payment verification failed or status not successful");
        }
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
    <div>
      <section>
        <div className="min-h-screen p-2 sm:p-6 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="container max-w-screen-lg mx-auto">
            <div>
              <div>
                <h2 className="font-semibold text-xl text-gray-600 dark:text-gray-100 mb-2">
                  Card Payment
                </h2>
                {discountPercent > 0 ? (
                  <>
                    <p>
                      Subtotal: <s>AED {subtotal.toFixed(2)}</s>{" "}
                      <span className="text-green-600 font-semibold">
                        AED {discountedSubtotal.toFixed(2)} ({discountPercent}%
                        off)
                      </span>
                    </p>
                  </>
                ) : (
                  <p>Subtotal: AED {subtotal.toFixed(2)}</p>
                )}

                <p>VAT (5%): AED {vat.toFixed(2)}</p>
                <p>
                  Shipping: AED{" "}
                  {isFreeShipping ? (
                    <span className="text-green-600 font-medium">
                      0.00 (Free Shipping Applied)
                    </span>
                  ) : (
                    shippingPrice.toFixed(2)
                  )}
                </p>

                <p className="font-bold text-lg">
                  Grand Total: AED {grandTotal.toFixed(2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-2 sm:p-4 md:p-8 mb-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
                >
                  <div className="text-gray-600 dark:text-gray-300">
                    <p className="font-medium text-lg">Personal Details</p>
                    <p>Please fill out all the fields.</p>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      {/* ...other input fields... */}
                      <div className="md:col-span-5">
                        <label
                          htmlFor="full_name"
                          className="dark:text-gray-200"
                        >
                          Full Name
                        </label>
                        <input
                          {...register("name", {
                            required: "Name is required",
                          })}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Full Name"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        />
                        <p className="text-sm text-red-500">
                          {errors.name?.message}
                        </p>
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="email" className="dark:text-gray-200">
                          Email Address
                        </label>
                        <input
                          {...register("email", {
                            required: "Email is required",
                          })}
                          type="text"
                          name="email"
                          id="email"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                          disabled
                          defaultValue={currentUser?.email}
                          placeholder="email@domain.com"
                        />
                        <p className="text-sm text-red-500">
                          {errors.email?.message}
                        </p>
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="phone" className="dark:text-gray-200">
                          Phone Number
                        </label>
                        <input
                          {...register("phone", {
                            required: "Phone Number is required",
                          })}
                          type="number"
                          name="phone"
                          id="phone"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                          placeholder="971xxxxxxx"
                        />
                        <p className="text-sm text-red-500">
                          {errors.phone?.message}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <label htmlFor="address" className="dark:text-gray-200">
                          Address / Street
                        </label>
                        <input
                          {...register("address", {
                            required: "Address is required",
                          })}
                          type="text"
                          name="address"
                          id="address"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                          placeholder="Address"
                        />
                        <p className="text-sm text-red-500">
                          {errors.address?.message}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <SelectField
                          {...register("address", {
                            required: "Address is required",
                          })}
                          label="City"
                          name="city"
                          options={[
                            { value: "", label: "Select A City" },
                            { value: "Dubai", label: "Dubai" },
                            { value: "AbuDhabi", label: "AbuDhabi" },
                            { value: "Sharjah", label: "Sharjah" },
                            { value: "Ajman", label: "Ajman" },
                            {
                              value: "Ras Al Khaimah",
                              label: "Ras Al Khaimah",
                            },
                            { value: "Fujairah", label: "Fujairah" },
                            { value: "Umm Al Quwain", label: "Umm Al Quwain" },
                          ]}
                          register={register}
                        />
                        <p className="text-sm text-red-500">
                          {errors.city?.message}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="country" className="dark:text-gray-200">
                          Country / region
                        </label>
                        <div className="h-10 bg-gray-50 dark:bg-gray-900 flex border border-gray-200 dark:border-gray-700 rounded items-center mt-1">
                          <input
                            {...register("country", {
                              required: "Country is required",
                            })}
                            name="country"
                            id="country"
                            placeholder="Country"
                            className="px-4 appearance-none outline-none text-gray-800 dark:text-gray-100 w-full bg-transparent"
                          />
                          {/* ...buttons unchanged... */}
                        </div>
                        <p className="text-sm text-red-500">
                          {errors.country?.message}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="state" className="dark:text-gray-200">
                          State / province
                        </label>
                        <div className="h-10 bg-gray-50 dark:bg-gray-900 flex border border-gray-200 dark:border-gray-700 rounded items-center mt-1">
                          <input
                            {...register("state", {
                              required: "State is required",
                            })}
                            name="state"
                            id="state"
                            placeholder="State"
                            className="px-4 appearance-none outline-none text-gray-800 dark:text-gray-100 w-full bg-transparent"
                          />
                          {/* ...buttons unchanged... */}
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor="zipcode" className="dark:text-gray-200">
                          Zipcode
                        </label>
                        <input
                          {...register("zipcode")}
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                          placeholder=""
                        />
                      </div>
                      {/* Promo Code */}
                      <div className="md:col-span-3">
                        <label htmlFor="promo" className="dark:text-gray-200">
                          Promo Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="promo"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                            placeholder="Enter promo code"
                            disabled={discountPercent > 0 || isFreeShipping}
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                            disabled={
                              discountPercent > 0 ||
                              isFreeShipping ||
                              !promoCode
                            }
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPromoModal(true)}
                            className="text-sm text-blue-600 underline ml-2"
                            title="Show Available Promo Codes"
                            disabled={discountPercent > 0 || isFreeShipping}
                          >
                            <BiSolidOffer className="size-5" />
                          </button>
                          {(discountPercent > 0 || isFreeShipping) && (
                            <button
                              type="button"
                              onClick={() => {
                                setPromoCode("");
                                setDiscountPercent(0);
                                setDiscountAmount(0);
                                setIsFreeShipping(false);
                                setPromoError("");
                              }}
                              className="bg-red-500 text-white px-2 rounded hover:bg-red-600 ml-2"
                              title="Remove Promo"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {promoError && (
                          <p className="text-sm text-red-500">{promoError}</p>
                        )}
                        {(discountPercent > 0 || isFreeShipping) && (
                          <p className="text-sm text-green-600">
                            Promo applied:
                            {discountPercent > 0 && (
                              <>
                                {" "}
                                {discountPercent}% off (−AED{" "}
                                {discountAmount.toFixed(2)}){" "}
                              </>
                            )}
                            {isFreeShipping && (
                              <>
                                {" "}
                                {discountPercent > 0 ? "and " : ""}Free Shipping
                                applied
                              </>
                            )}
                          </p>
                        )}
                      </div>
                      {/* Delivery Notes */}
                      <div className="md:col-span-5">
                        <label
                          htmlFor="deliveryNotes"
                          className="dark:text-gray-200"
                        >
                          Delivery Notes
                        </label>
                        <textarea
                          id="deliveryNotes"
                          name="deliveryNotes"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="e.g. Leave at reception"
                          className="h-20 border mt-1 rounded px-4 w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        ></textarea>
                      </div>
                      <div className="md:col-span-5 mb-4">
                        <PaymentStatus
                          stripe={stripe}
                          elements={elements}
                          clientSecret={clientSecret}
                        />
                      </div>
                      {/* Card Details */}
                      <div className="md:col-span-5">
                        <label
                          htmlFor="card-element"
                          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          Card Details
                        </label>
                        <div className="p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 shadow-sm">
                          <CardElement
                            id="card-element"
                            onChange={(event) => {
                              setIsCardComplete(!event.empty);
                              setCardError(event.error?.message || "");
                            }}
                            options={{
                              hidePostalCode: true,
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#32325d",
                                  "::placeholder": {
                                    color: "#a0aec0",
                                  },
                                },
                                invalid: {
                                  color: "#fa755a",
                                },
                              },
                            }}
                          />
                        </div>
                        {cardError && (
                          <p className="text-sm text-red-500 mt-2">
                            {cardError}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Test card: 4242 4242 4242 4242 | Any future date | Any 3
                        digits
                      </div>
                      {/* Submit Button */}
                      <div className="md:col-span-5 mt-3">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="billing_same"
                            id="billing_same"
                            className="form-checkbox"
                            onChange={(e) => setIsChecked(e.target.checked)}
                          />
                          <label
                            htmlFor="billing_same"
                            className="ml-2 dark:text-gray-200"
                          >
                            I am aggree to the{" "}
                            <Link className="underline underline-offset-2 text-blue-600 dark:text-blue-400">
                              Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link className="underline underline-offset-2 text-blue-600 dark:text-blue-400">
                              Shoping Policy.
                            </Link>
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            type="submit"
                            disabled={
                              !stripe ||
                              processing ||
                              !isChecked ||
                              !isCardComplete
                            }
                            className={`${
                              !isChecked ||
                              !stripe ||
                              processing ||
                              !isCardComplete
                                ? "bg-gray-400 cursor-not-allowed opacity-50 py-2 px-4 rounded"
                                : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            }`}
                          >
                            {processing
                              ? "Processing..."
                              : `Pay AED ${grandTotal.toFixed(2)}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Show Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg"
              onClick={() => setShowPromoModal(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
              Available Promo Codes
            </h2>
            {availablePromos.length === 0 ? (
              <p className="dark:text-gray-300">No active promo codes.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {availablePromos.map((promo) => (
                  <li
                    key={promo.code}
                    className="border-b pb-2 dark:border-gray-700"
                  >
                    <p className="font-medium text-blue-700 dark:text-blue-400">
                      {promo.code}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {promo.promoDescription}
                    </p>
                    <div className="text-xs mt-1">
                      {promo.discountPercentage > 0 && (
                        <span className="text-blue-600 dark:text-blue-400 mr-2">
                          {promo.discountPercentage}% Off
                        </span>
                      )}
                      {promo.freeShipping && (
                        <span className="text-green-600 dark:text-green-400">
                          Free Shipping
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
