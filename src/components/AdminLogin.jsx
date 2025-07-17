import { React, useState } from "react";
import { CgLogIn } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import logo from "/fav-icon.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/authSlice";

import Button from "./Button";
import getBaseURL from "../utils/baseURL";
// import { saveState } from "../sessionStorage/sessionStorage";

// import { logout } from "../redux/features/authSlice";

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${getBaseURL()}/api/auth/admin`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const auth = response.data;
      // console.log(auth);

      if (auth.token && auth.user) {
        console.log("Login Response:", auth);
        const expiryTime = Date.now() + 3600 * 1000; // 1 hour expiry
        sessionStorage.setItem("tokenExpiry", expiryTime);
        console.log(
          "Token Expiry Time:",
          sessionStorage.getItem("tokenExpiry")
        );

        // Set in Redux
        dispatch(setUser({ token: auth.token, user: auth.user }));

        Swal.fire("Admin login successfully!");

        navigate("/dashboard");
      } else {
        setMessage("Invalid response from server");
      }
    } catch (error) {
      setMessage("Please provide valid email or password");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-md px-6 pt-6 pb-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
          Admin Dashboard Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              {...register("username", { required: "username is required" })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
            />
            <p className="text-sm text-red-500">{errors.username?.message}</p>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>
          {message && (
            <div
              className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 mb-4"
              role="alert"
            >
              <p>{message}</p>
            </div>
          )}
          <div>
            <Button
              className="btn-blue bg-blue-500 dark:bg-blue-700 w-full text-white font-bold py-2 px-4 flex items-center justify-center mb-2"
              type="submit"
            >
              <CgLogIn className="mr-2" />
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
