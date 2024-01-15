import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/shared/Loader";

import { SignInValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
const SignInForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Queries

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        throw new Error("Invalid email or password.");
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        throw new Error("Authentication check failed. Please try again.");
      }
    } catch (error) {
      // Customize this part based on the structure of your error object
      let errorMessage = "Sign in failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      toast({ title: errorMessage });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img
          src="/assets/images/logo.svg"
          alt="logo"
          className="w-100 h-auto"
        />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Welcome back!</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2 text-center">
          Access your personalized dashboard.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="flex items-center">
                  <FormControl className="flex items-center justify-between">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="ml-2 px-3 py-1 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex center gap-2">
                <Loader />
                Signing you in...
              </div>
            ) : (
              "Log In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            New here?{" "}
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign Up Now!
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
