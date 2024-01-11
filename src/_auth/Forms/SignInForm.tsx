import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpValidation as SignInValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
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
    console.log("We are in");
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    console.log({ session });

    if (!session) {
      return toast({ title: "Sign in failed. Please try again." });
    }

    const isLoggedIn = await checkAuthUser();
    console.log({ isLoggedIn });

    if (isLoggedIn) {
      form.reset();
      console.log("Navigating");
      navigate("/");
    } else {
      return toast({ title: "Sign in failed. Please try again." });
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
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log into your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2 text-center">
          Welcome back.
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
                Setting Up Your World...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
