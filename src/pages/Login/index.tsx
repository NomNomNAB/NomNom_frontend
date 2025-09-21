import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState<string>(
    location.state ? location.state.email : ""
  );
  const [password, setPassword] = useState<string>(
    location.state ? location.state.password : ""
  );
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials);
      navigate("/");
    } catch (err: any) {
      console.error("❌ Firebase login error:", err);

      // Handle Firebase auth errors
      if (err.code === "auth/user-not-found") {
        setErrors({ email: "No account found with this email" });
      } else if (err.code === "auth/wrong-password") {
        setErrors({ password: "Incorrect password" });
      } else if (err.code === "auth/invalid-email") {
        setErrors({ email: "Invalid email address" });
      } else {
        setErrors({ email: "Login failed. Please try again." });
      }
    }
  };
  return (
    <div className="text-black w-full flex flex-col sm:flex-row items-center justify-center">
      <div className="hidden sm:flex relative w-2/4 h-screen">
        <img
          src="/cooking2.JPG"
          alt="Nom Nom Logo"
          className="w-full h-full object-cover"
        />
        <div className="w-[70%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-3xl font-bold">
        <p className="font-extrabold font-playfair text-primary md:text-5xl text-lg">
          Share Your Story, Share Your Dish
        </p>
        <p className="mt-10 font-worksans font-normal md:text-2xl text-sm px-3">
          Every dish has a story - what's yours? Share your favorite recipes
          with our community of home cooks and inspire others.
        </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center py-20 w-full sm:w-2/4">
        <h2 className="font-lobster text-primary text-3xl sm:text-5xl mb-3">
          Welcome to Nom Nom
        </h2>

        <div className="w-[20rem] flex flex-col gap-4">
          <label
            htmlFor="email"
            className="flex flex-col gap-1 font-medium text-black"
          >
            <span className="text-primary">Email</span>
            <Input
              type="email"
              //label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
            />
          </label>

          <label
            htmlFor="password"
            className="flex flex-col gap-1 font-medium text-black"
          >
            <span className="text-primary">Password</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
            />
          </label>

          <Button
            onClick={handleClick}
            disabled={!email || !password}
            className="bg-primary text-white font-medium py-2 px-12 rounded-[20px] mt-2 cursor-pointer"
          >
            Login
          </Button>

          <div className="flex flex-row gap-2 items-center justify-center">
            <p>Don't have an account?</p>
            <Link to="/sign-up">
              <p className="text-primary font-semibold">Sign Up</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
