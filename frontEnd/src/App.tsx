import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyOtpPage } from "./pages/VerifyOtpPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { PdfEditorPage } from "./pages/PdfEditorPage";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  refreshSession,
  selectAuthInitialized,
} from "./redux/slices/authSlice";
function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(selectAuthInitialized);
  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);
  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
        {" "}
        Loading your workspace…{" "}
      </div>
    );
  }
  return null;
}
function App() {
  return (
    <BrowserRouter>
      {" "}
      <SessionBootstrap />{" "}
      <Layout>
        {" "}
        <Routes>
          {" "}
          <Route path="/" element={<HomePage />} />{" "}
          <Route path="/login" element={<LoginPage />} />{" "}
          <Route path="/register" element={<RegisterPage />} />{" "}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />{" "}
          <Route path="/verify-otp" element={<VerifyOtpPage />} />{" "}
          <Route path="/reset-password" element={<ResetPasswordPage />} />{" "}
          <Route path="/pdf/:id" element={<PdfEditorPage />} />{" "}
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
        </Routes>{" "}
      </Layout>{" "}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />{" "}
    </BrowserRouter>
  );
}
export default App;
