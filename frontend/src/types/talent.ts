
export type TalentBase = {
  id: number;
  name: string;
  image: string;
  photos: string[];
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  specialties: string[];
  yearsExperience: number;
  email: string;
  phone: string;
  availability: string[];
  bio: string;
  jobsWorked: {
    id: number;
    title: string;
    company: string;
    date: string;
  }[];
  reviews: {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  certifications: {
    id: number;
    name: string;
    issuedBy: string;
    date: string;
  }[];
}
