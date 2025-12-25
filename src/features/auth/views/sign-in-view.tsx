"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type signInSchemaInput = z.infer<typeof signInSchema>;

export const SignInView = () => {
  const router = useRouter();
  const form = useForm<signInSchemaInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: signInSchemaInput) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async () => {
          const session = await authClient.getSession();
          const role = (session.data?.user as any).role;

          console.log("User role:", role);

          // Redirect berdasarkan Role
          if (role === "OWNER" || role === "MANAGER") {
            router.push("/dashboard");
          } else if (role === "CASHIER") {
            router.push("/pos");
          } else if (role === "KITCHEN") {
            router.push("/kitchen");
          } else {
            router.push("/"); // Customer
          }
        },
      }
    );
  };

  return (
    <Card className="w-87.5">
      <CardHeader>
        <CardTitle>Kopi Jenaka</CardTitle>
        <CardDescription>Masuk untuk mengelola outlet</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full items-center gap-4"
          >
            <div className="flex flex-col space-y-1.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                )}
              />
            </div>
            <Button type="submit">Sign In</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
