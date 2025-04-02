
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, Star, Mail, Phone, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompanyById, CompanyProfileDB } from "@/services/companyServiceSupabase";

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<CompanyProfileDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        setError("No company ID provided");
        setLoading(false);
        return;
      }

      try {
        const companyData = await getCompanyById(id);
        if (companyData) {
          setCompany(companyData);
        } else {
          setError("Company not found");
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company information");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">
          {error || "Company not found"}
        </h1>
        <p className="mt-4 text-muted-foreground">
          The company profile you're looking for couldn't be found.
        </p>
      </div>
    );
  }

  // Mock data for reviews and locations
  const reviewCount = 23;
  const rating = 4.7;
  const locations = ["Los Angeles", "New York", "Chicago"].filter((_, i) => i < 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={company.logo_url || "/placeholder.svg"} alt={company.name} />
            <AvatarFallback>
              <Building className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Building className="h-4 w-4" />
                <span>{company.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium text-lg">{rating}</span>
                <span className="text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <Button>Contact Company</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-muted-foreground">{company.description}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{company.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{company.website}</span>
                </div>
              </div>
            </div>

            {locations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Locations</h2>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <div
                      key={location}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
