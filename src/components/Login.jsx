import { React, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { CgLogIn } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import logo from "/fav-icon.png";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [message, setMessage] = useState("");
  const { signInUser, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      await signInUser(data.email, data.password);
      // alert("User logged in successfully");
      navigate("/");
      Swal.fire({
        title: `Welcom Back ${data.email}`,
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      setMessage("Please provide valid emai or password");
    }
  };

  const handleForgotPassword = async () => {
    const email = watch("email"); // Get the email entered in the form
    if (!email) {
      Swal.fire({
        title: "Error",
        text: "Please enter your email address to reset your password.",
        icon: "error",
      });
      return;
    }

    try {
      await resetPassword(email);
      Swal.fire({
        title: "Password Reset Email Sent",
        text: `A password reset email has been sent to ${email}. Please check your inbox.`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to send password reset email.",
        icon: "error",
      });
    }
  };

  // const hundleGoogleSignIn = async () => {
  //   try {
  //     const result = await signInWithGoogle();
  //     const user = result.user; // Extract the user object
  //     const email = user.email; // Get the user's email
  //     console.log(user);

  //     navigate("/");
  //     Swal.fire({
  //       title: `Welcome Back<br>${email}`,
  //       icon: "success",
  //       draggable: true,
  //     });
  //   } catch (error) {
  //     alert("please enter valid account");
  //     console.error(error);
  //   }
  // };
  const hundleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (!result || !result.email) {
        throw new Error("No user email returned");
      }

      const email = result.email;
      console.log("✅ Logged in as:", email);

      navigate("/");
      Swal.fire({
        title: `Welcome Back<br>${email}`,
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      alert("Please enter a valid account");
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-[white] shadow-md px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

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
              className="btn-blue bg-blue-500 w-full text-white font-bold py-2 px-30 flex items-center mb-2"
              type="submit"
            >
              <CgLogIn className="mr-2" />
              Login
            </Button>
          </div>
        </form>
        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <p>
          Haven't an account? Please{" "}
          <span className="inline-flex items-baseline gap-2">
            {" "}
            <img src={logo} className="ml-1 self-center size-5" />
            <Link
              className="text-blue-500 hover:underline text-blue-700"
              to="/register"
            >
              Register.
            </Link>
          </span>{" "}
        </p>

        {/* Google Login */}
        <div className="mt-4">
          <Button
            onClick={hundleGoogleSignIn}
            className="bg-secondary hover:bg-blue-700 mt-2 btn-blue text-white font-bold w-full flex flex-wrap gap-1 items-center justify-center py-2 px-4 rounded focus:outline-none"
          >
            {" "}
            <FaGoogle className="mr-2 size-5" />
            Sing in with Google
          </Button>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">
          &copy;2025 Book Store All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
