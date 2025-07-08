import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/home/Home";
import AllProducts from "../pages/allProducts/AllProducts";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/items/cartPage";
import CheckOut from "../pages/items/CheckOut";
import PrivateRouter from "./PrivateRouter";
import Orders from "../pages/items/Orders";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageItem from "../pages/dashboard/mamageItems/ManageItem";
import AddItem from "../pages/dashboard/additem/AddItem";
import UpdateItems from "../pages/dashboard/editItem/UpdateItems";
import ManageOrders from "../pages/dashboard/manageOrders/ManageOrders";
import SlidesManager from "../pages/dashboard/slidesManagment/SlidesManager";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ContactUs from "../pages/companyInfo/ContactUs";
import AboutUs from "../pages/companyInfo/AboutUs";
import SingleItem from "../pages/items/SingleItem";
import Services from "../pages/companyInfo/Services";
import PrivacyPolicy from "../pages/companyInfo/PrivacyPolicy";
import TermsOfService from "../pages/companyInfo/TermsOfService";
import CategoryPage from "../pages/items/CategoryPage";
import PromoManagment from "../pages/dashboard/promoManagment/PromoManagment";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/all-products",
        element: <AllProducts />,
      },
      {
        path: "/cart",
        element: (
          <PrivateRouter>
            <CartPage />
          </PrivateRouter>
        ),
      },
      {
        path: "/orders",
        element: (
          <PrivateRouter>
            <Orders />
          </PrivateRouter>
        ),
      },
      {
        path: "/category/:category",
        element: <CategoryPage />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRouter>
            <Elements stripe={stripePromise}>
              <CheckOut />
            </Elements>
          </PrivateRouter>
        ),
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/item/:id",
        element: <SingleItem />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: "add-new-item",
        element: (
          <AdminRoute>
            <AddItem />
          </AdminRoute>
        ),
      },
      {
        path: "edit-item/:id",
        element: (
          <AdminRoute>
            <div>
              <UpdateItems />
            </div>
          </AdminRoute>
        ),
      },
      {
        path: "manage-items",
        element: (
          <AdminRoute>
            <ManageItem />
          </AdminRoute>
        ),
      },
      {
        path: "manage-orders",
        element: (
          <AdminRoute>
            <ManageOrders />
          </AdminRoute>
        ),
      },
      {
        path: "slides-managment",
        element: (
          <AdminRoute>
            <SlidesManager />
          </AdminRoute>
        ),
      },
      {
        path: "promo-managment",
        element: (
          <AdminRoute>
            <PromoManagment />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
