
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

// Replace with your publishable key
const stripePromise = loadStripe('pk_live_51QOQ3XRtsPLTJk4OjaTFYU0KHa8iAd3JrDxevGukDmDsxehoUrkzEjq0Khg1ayXesG8FfEz8BL74VwPvD0h59PFI00vStYrSKm');

export function StripeWrapper({ children }: { children: ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
