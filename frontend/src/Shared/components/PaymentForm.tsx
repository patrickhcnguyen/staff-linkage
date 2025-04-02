
import { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/Shared/components/ui/button";
import { toast } from "sonner";

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // For demonstration, we're just simulating a payment success
      // In a real implementation, you would:
      // 1. Create a payment intent on your server
      // 2. Send card details to Stripe
      // 3. Confirm the payment
      
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        throw error;
      }

      // Here you would typically send the paymentMethod.id to your server
      // and create a subscription with Stripe's API
      
      toast.success("Payment processed successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      onError(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Total Amount: $200.00</h3>
          <p className="text-sm text-muted-foreground">
            Monthly subscription for Pro membership
          </p>
        </div>

        <div className="bg-white p-4 rounded-md border">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay $200.00"}
      </Button>
    </form>
  );
}
