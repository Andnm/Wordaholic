"use client";

import { ROLE_CUSTOMER } from "@utils/constants";
import { emailRegex, isValidEmail } from "@utils/helpers";
import { Form, message } from "antd";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { handleActionNotSupport } from "@utils/global";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLoginWithGoogle = async () => {
    try {
      setIsLoading(true);
      signIn("google");
    } catch (err) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithEmailPassword = async (
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    if (e) e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      if (!email || !password) {
        setError("Please fill in email and password input!");
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError("Email is not valid!");
        setIsLoading(false);
        return;
      }

      const response = await signIn("cus_credentials", {
        redirect: false,
        email: email,
        password: password,
        role: ROLE_CUSTOMER,
      });

      if (response?.error) {
        return message.error("Wrong login information!", 1.5);
      } else {
        message.success("Đăng nhập thành công!", 1.5);
        return router.push("/account");
      }
    } catch (error) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const list_login_third_services = [
    {
      img_link: "/images/Facebook.png",
      action: () => handleActionNotSupport(),
      key: "facebook",
    },
    {
      img_link: "/images/Google.png",
      action: () => handleLoginWithGoogle(),
      key: "google",
    },
    {
      img_link: "/images/GitHub.png",
      action: () => handleActionNotSupport(),
      key: "github",
    },
  ];

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="container login-container flex flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-extrabold">wordaholic</h1>
        <div className="my-5">
          <img src="/images/logo_with_line_text.png" alt="logo" />
        </div>
        <p className="sub-title">Playing games and study</p>

        <form onSubmit={handleLoginWithEmailPassword} className="my-4 w-10/12">
          <div className="input-field relative">
            <input
              type="text"
              required
              placeholder="Email"
              className="font-semibold text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MdOutlineMail className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="font-semibold text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <GrSecure className="absolute left-3 w-6 h-6 opacity-30" />
            <span
              className="absolute right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <button
            type="submit"
            className="my-5 btn-action-login-register text-center text-xl cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log in"}
          </button>

          {error && <p className="text-red-500 text-center my-2">{error}</p>}

          <p className="forgot font-semibold text-center">Forgot password?</p>
        </form>

        <p className="text-center text-register text-sm font-semibold">
          {`Don't have an account?`}
          <span
            onClick={() => {
              router.push("/register");
            }}
            style={{ color: "#FF8682" }}
            className="hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
        <div className="line-text font-medium my-7 ">
          <p className="text-sm">Or login with</p>
        </div>

        <div className="method-login-third-services grid grid-cols-3 gap-4">
          {list_login_third_services.map((item) => (
            <div
              key={item.key}
              className="cursor-pointer item flex justify-center items-center"
            >
              <img src={item.img_link} alt={item.key} onClick={item.action} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
