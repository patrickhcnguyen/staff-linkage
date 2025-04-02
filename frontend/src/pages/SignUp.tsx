
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Shared/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Shared/components/ui/form";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { toast } from "sonner";
import { Briefcase, User, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [role, setRole] = useState<"company" | "staff">("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Log the attempt for debugging
      console.log("Attempting to sign up with:", values.email, "as", role);
      
      const { data, error } = await signUp(values.email, values.password, {
        data: {
          phone: values.phone,
          role: role,  // Important: Store the selected role in user metadata
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Failed to create account. Please try again.");
        return;
      }
      
      console.log("Signup response:", data);
      
      // If we have a user, success
      if (data.user) {
        toast.success("Account created! Please check your email for verification.");
        
        // Redirect based on role
        if (role === "company") {
          navigate("/company-onboarding");
        } else {
          navigate("/staff-onboarding");
        }
      } else {
        // Something unexpected in the response
        toast.error("Unexpected response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create an Account</h1>
        <p className="text-muted-foreground">
          Choose your account type and fill in your details below
        </p>
      </div>

      <Tabs defaultValue="company" onValueChange={(value) => setRole(value as "company" | "staff")}>
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Staff
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className="text-muted-foreground text-sm mb-6">
            Create a company account to post jobs and find event staff
          </div>
        </TabsContent>
        <TabsContent value="staff">
          <div className="text-muted-foreground text-sm mb-6">
            Create a staff account to find event opportunities and connect with companies
          </div>
        </TabsContent>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Create a password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </Tabs>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
