import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../lib/api";
// import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const navigate = useNavigate();

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // api call
  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload) => {
      const response = await api.post("auth/login", payload);
      return response;
    },
    onSuccess: (response) => {
      console.log("response", response);
      if (response.status === 201) {
        toast.success("User Login Succefully");
        localStorage.setItem("token", response?.data?.access_token);
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        navigate("/event");
      }
    },
    onError: (errors) => {
      console.log("error", errors);
      toast.error(errors?.response?.data?.message || errors?.message);
    },
  });

  // function
  const onSubmit = (data) => {
    mutate(data);
  };

  const handleCheckBox = (e) => {
    console.log("value", e.target.checked);
  };

  return (
    <div className="h-screen w-ful flex items-center justify-center items-center">
      <div className="w-108 flex flex-col gap-4 ">
        <h1>
          Login to <span className="text-orange-600">Evo</span>
          <span className="text-orange-500 italic">Event</span>
        </h1>
        <p className="text-2xl font-light">
          Welcome to evento please enter your login details below
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          role="form"
        >
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm text-left">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm text-left">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* <Checkbox
              id="terms"
              onCheckedChange={handleCheckBox}
              className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
            /> */}
            <input
              type="checkbox"
              className="h-3.5 w-3.5"
              onChange={handleCheckBox}
            />

            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>

          <Button type="submit" className="w-full bg-[#FD5900]">
            Log In
          </Button>
        </form>
        <div className="flex justify-between">
          <p className="underline">Forget the passward ?</p>
          <Link className="underline cursor-pointer" to={"/register"}>
            Sing Up ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
