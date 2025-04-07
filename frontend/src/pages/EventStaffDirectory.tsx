import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/Shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Shared/components/ui/avatar";
import { MapPin, Building } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Company {
  id: string;
  company_id: string;
  name: string;
  type: string;
  logo_url: string;
  website: string;
  email: string;
  phone: string;
  description: string;
  founded: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  number_of_employees: string;
  created_at: string;
  updated_at: string;
}

const EventStaffDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*');

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${company.city} ${company.state}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompanyClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Event Staff Directory</h1>
          <p className="text-muted-foreground">
            Find and connect with top event staffing companies across the country
          </p>
          <Input
            placeholder="Search by company name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading companies...</p>
            </div>
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div 
                key={company.id}
                className="flex flex-col md:flex-row gap-6 p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white"
                onClick={() => handleCompanyClick(company.id)}
              >
                <div className="flex items-start gap-4 md:w-1/3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={company.logo_url} alt={company.name} />
                    <AvatarFallback>
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="h-4 w-4 mr-1" />
                      {company.type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {company.number_of_employees} employees
                    </div>
                  </div>
                </div>

                <div className="md:w-1/3">
                  <p className="text-sm text-muted-foreground">
                    {company.description}
                  </p>
                </div>

                <div className="md:w-1/3">
                  <div className="text-sm font-medium mb-2">Location:</div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded-md">
                      <MapPin className="h-3 w-3" />
                      {`${company.city}, ${company.state}`}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No companies found matching your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStaffDirectory;
