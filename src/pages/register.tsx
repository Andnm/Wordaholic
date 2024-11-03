"use client";

import { ROLE_CUSTOMER } from "@utils/constants";
import { emailRegex, isValidEmail } from "@utils/helpers";
import { Form, message } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { handleActionNotSupport } from "@utils/global";
import { IoPerson } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const RegisterPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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

  const handleRegister = async () => {
    setError("");

    if (!email || !password || !name || !confirmPassword) {
      setError("Please fill in email and password input!");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email is not valid!");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password does not match!");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // const responseRegister = await customer.registerByCustomer(
      //   name,
      //   email,
      //   password
      // );

      // if (responseRegister) {
      //   message.success("Đăng ký thành công!", 1.5);

      //   const responseSignin = await signIn("cus_credentials", {
      //     redirect: false,
      //     email: email,
      //     password: password,
      //   });

      //   if (!responseSignin?.error) {
      //     return router.push("/account");
      //   }
      // }
    } catch (err: any) {
      console.error("Error creating account:", err);
      message.error(err!.response?.data?.message);
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
      <div className="container login-container register-container  flex flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-extrabold">wordaholic</h1>
        <div className="my-5 logo-container">
          <img src="/images/logo_with_line_text.png" alt="logo" />
        </div>
        <p className="sub-title">Register</p>

        <form onSubmit={handleRegister} className="my-4 w-10/12">
          <div className="input-field relative">
            <input
              type="text"
              required
              placeholder="Fullname"
              className="font-semibold text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <IoPerson className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
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

          <div className="input-field relative mt-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              className="font-semibold text-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <GrSecure className="absolute left-3 w-6 h-6 opacity-30" />
            <span
              className="absolute right-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <button
            type="submit"
            className="my-5 btn-action-login-register text-center text-xl cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Handling..." : "Sign up"}
          </button>

          {error && <p className="text-red-500 text-center my-2">{error}</p>}
        </form>

        <p className="text-center text-register text-sm font-semibold">
          Have an account?{" "}
          <span
            onClick={() => {
              router.push("/login");
            }}
            style={{ color: "#FF8682" }}
            className="hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
        <div className="line-text font-medium my-7">
          <p className="text-sm">Or register with</p>
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

export default RegisterPage;
