"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/utils/auth-client";
import { useForm } from "react-hook-form";
import z, { email } from "zod";

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

type signUpSchemaInput = z.infer<typeof signUpSchema>;

export const SignUpView = () => {
  const form = useForm<signUpSchemaInput>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (data: signUpSchemaInput) => {
    authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col space-y-2">
        <CardTitle>Sign Up</CardTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex space-y-4 flex-col"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
              )}
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
