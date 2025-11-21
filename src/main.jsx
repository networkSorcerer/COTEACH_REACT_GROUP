import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./app/styles/global.css";
import { router } from "./app/router";
import { AppQueryProvider } from "./app/providers/QueryClientProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId} >
    <StrictMode>
      <AppQueryProvider>
        <RouterProvider router={router} />
      </AppQueryProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
