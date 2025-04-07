import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const basicInfoSchema = z.object({
    name: z.string().min(2, "First name must be at least 2 characters"), // 
    type: z.string().min(2, "Please enter the type of company you are"), // 
    street: z.string().min(5, "Please enter a valid address"),
    city: z.string().min(5, "Please enter a valid city"),
    state: z.string().min(5, "Please enter a valid state"),
    zipCode: z.string().min(5, "Please enter in a valid zip code"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"), //
    email: z.string().email("Please enter a valid email address"), //
    description: z.string().min(10, "Please enter in what your companies does"), //
    founded: z.string().optional(), 
    numberOfEmployees: z.string(),
    website: z.string().optional(), //
    companyPhoto: z
        .instanceof(FileList)
        .refine(
            (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
            'Max image size is 5MB'
        )
        .refine(
            (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional()
        .nullable(),
});

const socialMediaSchema = z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
});

export type BasicCompanyInfoValues = z.infer<typeof basicInfoSchema>;
export type SocialMediaValues = z.infer<typeof socialMediaSchema>;

export const useCompanyOnboardingForm = () => {
  const basicInfoForm = useForm<BasicCompanyInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
        name: "",
        type: "",
        street: "",
        city: "",
        zipCode: "",
        phone: "", 
        email: "", 
        description: "",
        founded: "",
        numberOfEmployees: "",
        website: "",
        companyPhoto: null
    },
  });

  const socialMediaForm = useForm<SocialMediaValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
    },
  });
    return {
        basicInfoForm,
        socialMediaForm,
    };
};
