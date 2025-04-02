
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StripeWrapper } from "@/components/StripeWrapper";
import { PaymentForm } from "@/components/PaymentForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, CreditCard, CalendarDays, CheckCircle, Star, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  date: string;
  amount: number;
  type: "subscription" | "job-post";
  status: "succeeded" | "pending" | "failed";
  description: string;
}

const CompanyMembership = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const membership = {
    type: "Basic",
    jobCredits: 0,
    nextBillingDate: "April 15, 2024",
    isActive: true
  };

  const payments: Payment[] = [
    {
      id: "pay_1234",
      date: "March 1, 2024",
      amount: 5,
      type: "job-post",
      status: "succeeded",
      description: "Job Post - Event Host Position"
    },
    {
      id: "pay_1235",
      date: "March 5, 2024",
      amount: 5,
      type: "job-post",
      status: "succeeded",
      description: "Job Post - Bartender Position"
    }
  ];

  const handleUpgradeSuccess = () => {
    toast.success("Successfully upgraded to Pro membership!");
    setShowPaymentDialog(false);
    setIsUpgrading(false);
  };

  const handlePaymentError = (error: string) => {
    toast.error("Payment failed: " + error);
    setIsUpgrading(false);
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Subscription cancelled successfully. Will remain active until billing period ends.");
      setShowCancelDialog(false);
    } catch (error) {
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your current membership details</CardDescription>
                </div>
                <Badge variant={membership.type === "Business" ? "default" : "secondary"}>
                  {membership.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Next billing date: {membership.nextBillingDate}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Job posting credits: {membership.jobCredits}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                Status: {membership.isActive ? "Active" : "Inactive"}
              </div>
              {membership.type === "Business" && (
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Subscription
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Business Plan
                  </CardTitle>
                  <CardDescription>Unlock unlimited potential</CardDescription>
                </div>
                <Badge variant="default">$299/month</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Unlimited job postings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Featured company listing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Talent search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Priority support
                </li>
              </ul>
              <Button 
                className="w-full"
                disabled={membership.type === "Business" || isUpgrading}
                onClick={() => {
                  setIsUpgrading(true);
                  setShowPaymentDialog(true);
                }}
              >
                {membership.type === "Business" ? "Current Plan" : "Upgrade to Business"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Plan Features</CardTitle>
            <CardDescription>Free plan with pay-as-you-go options</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Company profile
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                First job posting free
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Additional job posts at $5 per job
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Event staff directory listing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Limited support
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payments and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {payment.type === "subscription" ? (
                            <Star className="h-4 w-4 text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {payment.date}
                        </div>
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "succeeded" ? "default" : "destructive"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Business</DialogTitle>
            <DialogDescription>
              You're about to upgrade to Business membership. You will be charged $299/month.
            </DialogDescription>
          </DialogHeader>
          <StripeWrapper>
            <PaymentForm
              onSuccess={handleUpgradeSuccess}
              onError={handlePaymentError}
            />
          </StripeWrapper>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Business Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your Business subscription? You'll still have access to Business features until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyMembership;
