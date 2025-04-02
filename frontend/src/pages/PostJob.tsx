import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/mapbox-geocoder.css';
import { StripeWrapper } from "@/components/StripeWrapper";
import { PaymentForm } from "@/components/PaymentForm";

const steps = [
  { id: 1, name: "Brand Visibility & Description" },
  { id: 2, name: "Positions & Requirements" },
  { id: 3, name: "Contact Information" },
  { id: 4, name: "Review Details" },
  { id: 5, name: "Payment" },
];

const stepSchemas = {
  1: z.object({
    eventName: z.string().min(2, "Event name must be at least 2 characters"),
    brandRepresented: z.string().min(2, "Brand name must be at least 2 characters"),
    brandVisibility: z.enum(["public", "private"]),
    jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
    jobAddress: z.string().min(5, "Please enter a valid address"),
  }),
  2: z.object({
    positions: z.array(z.object({
      title: z.string().min(2, "Job title is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      numberOfPositions: z.string().min(1, "Number of positions is required"),
      payRate: z.string().min(1, "Pay rate is required"),
      payType: z.enum(["Hour", "Day", "Week"]),
    })).min(1, "At least one position is required"),
    requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  }),
  3: z.object({
    contactName: z.string().min(2, "Contact name must be at least 2 characters"),
    contactPhone: z.string().min(10, "Please enter a valid phone number"),
    contactEmail: z.string().email("Please enter a valid email address"),
  }),
  4: z.object({}).optional(),
  5: z.object({
    cardNumber: z.string().min(16, "Please enter a valid card number"),
    expiryDate: z.string().min(5, "Please enter a valid expiry date"),
    cvc: z.string().min(3, "Please enter a valid CVC"),
  }),
};

const jobPostSchema = z.object({
  eventName: z.string().min(2, "Event name must be at least 2 characters"),
  brandRepresented: z.string().min(2, "Brand name must be at least 2 characters"),
  brandVisibility: z.enum(["public", "private"]),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  jobAddress: z.string().min(5, "Please enter a valid address"),
  isNationalJob: z.boolean().optional(),
  positions: z.array(z.object({
    title: z.string().min(2, "Job title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    numberOfPositions: z.string().min(1, "Number of positions is required"),
    payRate: z.string().min(1, "Pay rate is required"),
    payType: z.enum(["Hour", "Day", "Week"]),
  })).min(1, "At least one position is required"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  contactEmail: z.string().email("Please enter a valid email address"),
});

type JobPostValues = z.infer<typeof jobPostSchema>;

const PostJob = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  const form = useForm<JobPostValues & { 
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  }>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      eventName: "",
      brandRepresented: "",
      brandVisibility: "public",
      jobDescription: "",
      jobAddress: "",
      isNationalJob: false,
      positions: [{
        title: "",
        startDate: "",
        endDate: "",
        numberOfPositions: "",
        payRate: "",
        payType: "Hour"
      }],
      requirements: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (currentStep === 1 && geocoderContainerRef.current && !geocoderRef.current) {
      try {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZXZlcnNoaWZ0IiwiYSI6ImNtNTYyOTZzNTNiNzAycnBwMzRsM2wwcWQifQ.L6x2ZJ--id6c60ZfJ3hogQ';

        geocoderRef.current = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          countries: 'us',
          types: 'address,poi,postcode',
          placeholder: 'Enter job location',
          bbox: [-125.0, 24.396308, -66.93457, 49.384358],
          proximity: {
            longitude: -98.5795,
            latitude: 39.8283
          }
        });

        if (geocoderContainerRef.current) {
          geocoderRef.current.addTo(geocoderContainerRef.current);
        }

        geocoderRef.current.on('result', (event) => {
          if (event?.result?.place_name) {
            form.setValue('jobAddress', event.result.place_name);
          }
        });

        geocoderRef.current.on('error', (error) => {
          console.error('Geocoder error:', error);
          toast.error('Error finding address. Please check your internet connection and try again.');
        });

        geocoderRef.current.on('loading', () => {
          console.log('Loading addresses...');
        });

      } catch (error) {
        console.error('Error initializing geocoder:', error);
        toast.error('Error initializing address search. Please refresh the page and try again.');
      }
    }

    return () => {
      if (geocoderRef.current) {
        try {
          geocoderRef.current.onRemove();
          geocoderRef.current = null;
        } catch (error) {
          console.error('Error cleaning up geocoder:', error);
        }
      }
    };
  }, [currentStep, form]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .geocoder-container {
        position: relative;
        width: 100%;
      }
      .mapboxgl-ctrl-geocoder {
        width: 100%;
        max-width: 100%;
        font-family: inherit;
        box-shadow: none;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
      }
      .mapboxgl-ctrl-geocoder input[type='text'] {
        height: 38px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const addPosition = () => {
    const positions = form.getValues("positions");
    form.setValue("positions", [
      ...positions,
      {
        title: "",
        startDate: "",
        endDate: "",
        numberOfPositions: "",
        payRate: "",
        payType: "Hour"
      },
    ]);
  };

  const removePosition = (index: number) => {
    const positions = form.getValues("positions");
    if (positions.length > 1) {
      form.setValue("positions", positions.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length + images.length > 2) {
        toast.error("You can only upload up to 2 images");
        return;
      }
      setImages([...images, ...Array.from(files)]);
    }
  };

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep as keyof typeof stepSchemas];
    if (!currentSchema) return true;

    const currentFields = form.getValues();
    try {
      await currentSchema.parseAsync(currentFields);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      }
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateSlug = (eventName: string) => {
    const baseSlug = eventName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Add a random 6-character string
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomString}`;
  };

  const onSubmit = async (data: JobPostValues & { 
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  }) => {
    if (currentStep < steps.length - 1) {
      await nextStep();
      return;
    }

    try {
      // Generate unique slug for the job
      const jobSlug = generateSlug(data.eventName);
      
      // Here you would typically:
      // 1. Process the payment
      // 2. Save the job data with the unique slug to your database
      toast.success("Payment processed successfully!");
      console.log("Form submitted with payment:", { 
        ...data, 
        cardNumber: "****" + data.cardNumber.slice(-4),
        cvc: "***",
        jobSlug
      });
      
      // Navigate to the new job URL
      navigate(`/jobs/${jobSlug}`);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/company-dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Post a New Job</h1>
        <p className="text-muted-foreground">
          Create a new job posting for your event.
        </p>
      </div>

      <div className="mb-12 space-y-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter event name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandRepresented"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Represented *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter brand name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandVisibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Visibility *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="public" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Everyone can see
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="private" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Private (only hired workers see)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Address *</FormLabel>
                    <FormControl>
                      <div ref={geocoderContainerRef} className="geocoder-container" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isNationalJob"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">National Job</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the job role and responsibilities"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                {form.watch("positions").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Job {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePosition(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`positions.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Brand Ambassador" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`positions.${index}.numberOfPositions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel># Positions *</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1" placeholder="Enter number needed" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`positions.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date *</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`positions.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date *</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`positions.${index}.payRate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay Rate *</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="0" placeholder="Enter amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`positions.${index}.payType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay Type</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full h-10 px-3 rounded-md border"
                              >
                                <option value="Hour">Hour</option>
                                <option value="Day">Day</option>
                                <option value="Week">Week</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPosition}
                  className="w-full"
                >
                  + Add another position
                </Button>
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Requirements *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="List any required skills, experience, or qualifications"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>On-Site Contact Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter contact name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone *</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter email address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Review Your Job Posting</h2>
                <p className="text-muted-foreground">
                  Please review all details before submitting
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Brand & Event Details</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event Name:</span>
                      <span className="font-medium">{form.getValues("eventName")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand Represented:</span>
                      <span className="font-medium">{form.getValues("brandRepresented")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand Visibility:</span>
                      <span className="font-medium capitalize">{form.getValues("brandVisibility")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Location:</span>
                      <span className="font-medium">{form.getValues("jobAddress")}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Job Description:</span>
                      <p className="mt-1 font-medium">{form.getValues("jobDescription")}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Positions & Requirements</h3>
                  <div className="space-y-4">
                    {form.getValues("positions").map((position, index) => (
                      <div key={index} className="bg-background p-4 rounded-md space-y-2">
                        <h4 className="font-medium">Position {index + 1}</h4>
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Title:</span>
                            <span>{position.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Date:</span>
                            <span>{position.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">End Date:</span>
                            <span>{position.endDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Number of Positions:</span>
                            <span>{position.numberOfPositions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pay Rate:</span>
                            <span>${position.payRate}/{position.payType}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div>
                      <span className="text-muted-foreground">Requirements:</span>
                      <p className="mt-1 font-medium">{form.getValues("requirements")}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact Name:</span>
                      <span className="font-medium">{form.getValues("contactName")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{form.getValues("contactPhone")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{form.getValues("contactEmail")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Payment</h2>
                <p className="text-muted-foreground">
                  Complete your payment to post your job
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <StripeWrapper>
                  <PaymentForm 
                    onSuccess={() => {
                      toast.success("Job posted successfully!");
                      navigate("/company-dashboard");
                    }}
                    onError={(error) => {
                      toast.error(error);
                    }}
                  />
                </StripeWrapper>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={currentStep === steps.length ? form.handleSubmit(onSubmit) : nextStep}
            >
              {currentStep === steps.length ? "Submit" : "Next"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostJob;
