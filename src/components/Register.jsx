import { React, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { CgLogIn } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import logo from "/fav-icon.png";
import { useForm } from "react-hook-form";

import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import getBaseURL from "../utils/baseURL";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { registerUser, signInWithGoogle } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const sendWelcomeEmail = async (email) => {
    console.log("📩 Sending email to:", email);

    if (!email) {
      console.error("❌ Email is undefined or empty");
      return;
    }

    try {
      const requestBody = JSON.stringify({ email });
      console.log("📡 Sending request body:", requestBody); // ✅ Log request body

      const response = await fetch(`${getBaseURL()}/api/email/welcome-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody, // ✅ Ensure email is passed correctly
      });

      const emailResponse = await response.json();
      console.log("✅ API Response:", emailResponse);

      if (!response.ok) {
        throw new Error(
          `❌ Failed to send welcome email: ${emailResponse.error}`
        );
      }

      alert("🎉 Welcome email sent successfully!");
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log("Data: ", data);
    setLoading(true);
    try {
      await registerUser(data.email, data.password);
      alert("User registered successfully");
      await sendWelcomeEmail(data.email);
    } catch (error) {
      setMessage("Please provide valid email or password", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(errors);
  const email = watch("email");
  // console.log(watch("password"));

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await signInWithGoogle(email);
  //     console.log(email);
  //     alert("Google logged in successfully");
  //     navigate("/");
  //   } catch (error) {
  //     alert("please enter valid account");
  //     console.error(error);
  //   }
  // };
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle(); // ✅ Sign in with Google

      if (user && user.email) {
        console.log("✅ Google Sign-In Success:", user.email);

        // ✅ Send welcome email
        await sendWelcomeEmail(user.email);

        alert("Google logged in successfully, and welcome email sent!");
        navigate("/");
      } else {
        console.error("❌ Google Sign-In Failed: No user email found.");
        alert("Failed to sign in with Google. Please try again.");
      }
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      alert("Please enter a valid account");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-[white] shadow-md px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
            {/* <p>{email}</p> */}
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 charecters required",
                },
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>
          {message && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4"
              role="alert"
            >
              <p>{message}</p>
            </div>
          )}
          <div>
            <Button
              className="btn-blue bg-blue-500 text-white font-bold py-2 px-4 flex items-center mb-2"
              type="submit"
            >
              <CgLogIn className="mr-2" />
              Sign Up
            </Button>
          </div>
        </form>
        <p>
          Have an account? Please{" "}
          <span className="inline-flex items-baseline gap-2">
            {" "}
            <img src={logo} className="ml-1 self-center size-5" />
            <Link
              className="text-blue-500 hover:underline text-blue-700"
              to="/login"
            >
              Login.
            </Link>
          </span>{" "}
        </p>

        {/* Google Login */}
        <div className="mt-4">
          <Button
            onClick={handleGoogleSignIn}
            className="bg-secondary hover:bg-blue-700 mt-2 btn-blue text-white font-bold w-full flex flex-wrap gap-1 items-center justify-center py-2 px-4 rounded focus:outline-none"
          >
            {" "}
            <FaGoogle className="mr-2 size-5" />
            Sing in with Google
          </Button>
        </div>
        {/* <Button
          onClick={sendWelcomeEmail}
          className="bg-secondary hover:bg-blue-700 mt-2 btn-blue text-white font-bold w-full flex flex-wrap gap-1 items-center justify-center py-2 px-4 rounded focus:outline-none"
        >
          Send Welcome Email
        </Button> */}
        <p className="text-center text-gray-500 text-xs mt-4">
          &copy;2025 Book Store All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
