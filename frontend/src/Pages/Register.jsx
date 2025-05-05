import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../lib/api";

const Register = () => {
  const navigate = useNavigate();

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // api call
  const { mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (payload) => {
      const response = await api.post("users/register", payload);
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success("User Created Succefully");
        navigate("/login");
      }
    },
    onError: (errors) => {
      toast.error(errors?.response?.data?.message || errors?.message);
    },
  });

  // function
  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-108 flex flex-col gap-4">
        <h1>
          Register in to <span className="text-orange-600">Evo</span>
          <span className="text-orange-500 italic">Event</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name field */}
          <div>
            <Label htmlFor="name" className="mb-2">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm text-left">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email field */}
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

          {/* Password field */}
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

          {/* Confirm Password field */}
          <div>
            <Label htmlFor="confirmPassward" className="mb-2">
              Confirm Password
            </Label>
            <Input
              id="confirmPassward"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassward", {
                required: "Confirm Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassward && (
              <p className="text-red-500 text-sm text-left">
                {errors.confirmPassward.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-[#FD5900]">
            Register
          </Button>
          <div>
            <Link className="underline decoration-1" to={"/login"}>
              For LogIn ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
