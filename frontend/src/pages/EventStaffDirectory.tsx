
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, Star } from "lucide-react";

const EventStaffDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.locations.some(location => 
      location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCompanyClick = (companyId) => {
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
                    <AvatarImage src={company.logo} alt={company.name} />
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
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-muted-foreground">
                        ({company.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/3">
                  <p className="text-sm text-muted-foreground">
                    {company.description}
                  </p>
                </div>

                <div className="md:w-1/3">
                  <div className="text-sm font-medium mb-2">Locations:</div>
                  <div className="flex flex-wrap gap-2">
                    {company.locations.map((location) => (
                      <div
                        key={location}
                        className="flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded-md"
                      >
                        <MapPin className="h-3 w-3" />
                        {location}
                      </div>
                    ))}
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
