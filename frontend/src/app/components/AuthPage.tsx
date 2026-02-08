import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BASE_URL,
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api";
import { authStatus, toggleLoginDialog } from "@/store/slice/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { register } from "module";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}
interface LoginFormData {
  email: string;
  password: string;
}
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

interface ForgotPasswordFormData {
  email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
  const [currentTab, setCurrentTab] = useState<
    "login" | "signup" | "forgot-password"
  >("login");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  //using react hook form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm<LoginFormData>();
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signupError },
  } = useForm<SignUpFormData>();
  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordError },
  } = useForm<ForgotPasswordFormData>();

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmitSignUp = async (data: SignUpFormData) => {
    // handle signup logic here
    setSignupLoading(true);
    try {
      const { email, password, name } = data;
      const result = await register({ email, password, name }).unwrap();
      //console.log("Registration successful:", result);
      if (result.success) {
        toast.success(
          "Registration verification link sent! Please verify your email before logging in."
        );
        dispatch(toggleLoginDialog());
        dispatch(authStatus());
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Email already registered.");
    } finally {
      setSignupLoading(false);
    }
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    // handle login logic here
    setLoginLoading(true);
    try {
      const result = await login(data).unwrap();
      console.log("Login successful:", result);
      if (result.success) {
        toast.success("User logged in successfully.");
        dispatch(toggleLoginDialog());
        dispatch(authStatus());
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Email or password is incorrect.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      router.push(`${BASE_URL}/api/auth/google`);
      dispatch(authStatus());
      dispatch(toggleLoginDialog());
      setTimeout(() => {
        toast.success("Google login successful.");
        setIsLoginOpen(false);
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmitForgotPassword = async (data: ForgotPasswordFormData) => {
    // handle login logic here
    setForgotPasswordLoading(true);

    try {
      const result = await forgotPassword(data.email).unwrap();
      if (result.success) {
        toast.success("Password Reset Link Sent Successfully.");
        setForgotPasswordSuccess(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed To Send Password Reset Link.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-poppins font-black text-white mt-4 mb-4">
            Welcome to Book Shop
          </DialogTitle>
          <DialogDescription className="text-center text-gray-100 text-lg font-poppins font-semibold">
            Please login or sign up to continue.
          </DialogDescription>
          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              setCurrentTab(value as "login" | "signup" | "forgot-password")
            }
          >
            <TabsList className="grid w-full grid-cols-3 mb-4 mt-4">
              <TabsTrigger value="login" className="font-poppins text-md font-semibold">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="font-poppins text-md font-semibold">
                Sign Up
              </TabsTrigger>
              <TabsTrigger value="forgot-password" className="font-poppins text-md font-semibold">
                Reset password
              </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* login part */}
                <TabsContent value="login" className="space-y-4">
                  <form
                    className="space-y-4"
                    onSubmit={handleLoginSubmit(onSubmitLogin)}
                  >
                    <div className="relative text-white mb-4">
                      <Input
                        {...registerLogin("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        placeholder="Email"
                        className="pl-10 placeholder:text-white font-poppins border-0 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                      />
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                        size={20}
                      />
                    </div>
                    {loginError.email && (
                      <p className="text-indigo-300 text-sm">
                        {loginError.email.message}
                      </p>
                    )}
                    <div className="relative text-white mb-4">
                      <Input
                        {...registerLogin("password", {
                          required: "Password is required",
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 placeholder:text-white font-poppins border-0 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                      />
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                        size={20}
                      />
                      {showPassword ? (
                        <EyeOff
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                          size={20}
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                          size={20}
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {loginError.password && (
                      <p className="text-indigo-300 text-sm font-poppins">
                        {loginError.password.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full font-bold cursor-pointer"
                    >
                      {loginLoading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                  <div className="flex items-center my-4">
                    <div className="h-px flex-1 bg-white/30"></div>
                    <span className="mx-4 text-white font-poppins">or</span>
                    <div className="h-px flex-1 bg-white/30"></div>
                  </div>
                  <Button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center font-poppins justify-center gap-2 bg-white text-gray-700 border border-gray-300 font-bold hover:bg-white/70 hover:border-none transition duration-300"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Continue with Google
                      </>
                    ) : (
                      <>
                        <Image
                          src="/icons/google.svg"
                          alt="google"
                          width={20}
                          height={20}
                        />
                        Continue with Google
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* signup part */}
                <TabsContent value="signup" className="space-y-4">
                  <form
                    onSubmit={handleSignUpSubmit(onSubmitSignUp)}
                    className="space-y-4 "
                  >
                    <div className="relative text-white mb-4">
                      <Input
                        {...registerSignUp("name", {
                          required: "Name is required",
                        })}
                        type="text"
                        placeholder="Name"
                        className="pl-10 placeholder:text-white font-poppins border-0 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                      />
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                        size={20}
                      />
                    </div>
                    {signupError.name && (
                      <p className="text-red-500 text-sm">
                        {signupError.name.message}
                      </p>
                    )}

                    <div className="relative text-white mb-4">
                      <Input
                        {...registerSignUp("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        placeholder="Email"
                        className="pl-10 placeholder:text-white font-poppins border-0 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                      />
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                        size={20}
                      />
                    </div>
                    {signupError.email && (
                      <p className="text-red-500 text-sm">
                        {signupError.email.message}
                      </p>
                    )}

                    <div className="relative text-white mb-4">
                      <Input
                        {...registerSignUp("password", {
                          required: "Password is required",
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 placeholder:text-white font-poppins border-0 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                      />
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                        size={20}
                      />
                      {showPassword ? (
                        <EyeOff
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                          size={20}
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                          size={20}
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {signupError.password && (
                      <p className="text-indigo-300 text-sm">
                        {signupError.password.message}
                      </p>
                    )}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="py-4 mr-2 accent-indigo-400 font-poppins"
                        {...registerSignUp("agreeTerms", {
                          required: "You must agree to the terms & conditions",
                        })}
                      />
                      <label className="text-gray-300 text-[14px] font-poppins">
                        I agree to the{" "}
                        <a
                          href="/terms-of-use"
                          className="underline hover:text-indigo-300"
                        >
                          terms & conditions
                        </a>
                      </label>
                    </div>
                    {signupError.agreeTerms && (
                      <p className="text-indigo-300 text-sm">
                        {signupError.agreeTerms.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full font-bold cursor-pointer"
                    >
                      {signupLoading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* forgot password part */}
                <TabsContent value="forgot-password" className="space-y-4">
                  {!forgotPasswordSuccess ? (
                    <form
                      className="space-y-4"
                      onSubmit={handleForgotPasswordSubmit(
                        onSubmitForgotPassword
                      )}
                    >
                      <div className="relative text-white mb-4">
                        <Input
                          {...registerForgotPassword("email", {
                            required: "Email is required",
                          })}
                          type="email"
                          placeholder="Email"
                          className="pl-10 placeholder:text-white border-0 focus-visible:ring-indigo-300 focus-visible:ring-offset-0"
                        />
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                          size={20}
                        />
                      </div>
                      {forgotPasswordError.email && (
                        <p className="text-indigo-300 text-sm">
                          {forgotPasswordError.email.message}
                        </p>
                      )}
                      <Button type="submit" className="w-full font-bold">
                        {forgotPasswordLoading ? (
                          <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                          "Send Password Reset Link"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                      >
                        <CheckCircle2 className="text-green-400 mt-2 w-16 h-16 mx-auto" />
                        <h3 className="text-xl font-semibold text-white">
                          Password reset link sent!
                        </h3>
                        <p className="text-sm text-gray-300">
                          There will be a link to reset your password sent to
                          your email & follow the steps to complete the
                          process.
                        </p>
                        <Button
                          onClick={() => setForgotPasswordSuccess(false)}
                          className="w-full cursor-pointer"
                        >
                          Send Another Link
                        </Button>
                      </motion.div>
                    </>
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
          <p className="text-center text-sm text-gray-300 mt-2">
            By clicking "Send Password Reset Link", you agree to our {""}
            <Link
              href="../terms-of-use"
              className="text-indigo-300 hover:underline"
            >
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="../privacy-policy"
              className="text-indigo-300 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPage;
