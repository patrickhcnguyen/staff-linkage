
import { Star, Calendar, MapPin, DollarSign, User, Search, X, ChevronUp, ChevronDown, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  rating: number;
  reviews: number;
  payRate: number;
  payPeriod: "Hour" | "Day";
  startDate: string;
  endDate: string;
  location: string;
  distance?: number;
  peopleNeeded: number;
  featured?: boolean;
}

const skillsCategories = [
  {
    name: "Hospitality & Guest Services",
    skills: ["Event Host/Hostess", "Usher", "Registration Staff", "Concierge Staff", "Guest List Coordinator", "Coat Check Attendant"]
  },
  {
    name: "Bartenders & Catering Staff",
    skills: ["Bartender", "Mixologist", "Cocktail Server", "Banquet Server", "Catering Staff", "Food Runner", "Busser", "Barback", "Event Chef"]
  },
  {
    name: "Promotional & Brand Activation",
    skills: ["Brand Ambassador", "Promotional Model", "Product Demonstrator", "Trade Show Booth Staff", "Sampling Staff", "Street Team Member", "Mascot Performer", "Flyer Distributor"]
  },
  {
    name: "Corporate & Conference Events",
    skills: ["Conference Host", "Panel Moderator", "Greeter", "Badge Scanner", "Convention Staff", "Interpreter/Translator", "Event Coordinator"]
  },
  {
    name: "Technical & Production",
    skills: ["Audio-Visual Technician", "Lighting Technician", "Stagehand", "Event Setup & Breakdown Crew", "IT Support Staff", "Sound Engineer", "Live Streaming Technician"]
  },
  {
    name: "Security & Crowd Control",
    skills: ["Event Security Guard", "Bouncer", "Crowd Control Staff", "ID Checker", "Emergency Response Team Member"]
  },
  {
    name: "Entertainment & Performance",
    skills: ["DJ", "Live Band/Musician", "Dancer", "Emcee/Host", "Magician", "Comedian", "Circus Performer"]
  },
  {
    name: "Logistics & Support",
    skills: ["Runner", "Parking Attendant", "Driver/Chauffeur", "VIP Concierge", "Delivery Personnel", "First Aid/Medical Staff"]
  }
];

const JobCard = ({ job }: { job: Job }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmitInterest = () => {
    console.log("Submitting interest for job:", job.id, "with message:", message);
    
    toast({
      title: "Application Submitted!",
      description: "Your message has been sent to the company.",
    });
    
    setMessage("");
    setIsDialogOpen(false);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={job.companyLogo} alt={job.companyName} />
              <AvatarFallback>{job.companyName[0]}</AvatarFallback>
            </Avatar>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{job.title}</h3>
                <span className="text-sm text-muted-foreground">· {job.companyName}</span>
                {job.featured && (
                  <Badge variant="secondary" className="rounded-full">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <div className="flex">{renderStars(job.rating)}</div>
                <span className="text-sm text-muted-foreground">
                  {job.rating} Overall
                </span>
                <span className="text-sm text-muted-foreground">
                  · {job.reviews} Reviews
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(job.startDate)}
                    {job.startDate !== job.endDate && 
                      ` - ${formatDate(job.endDate)}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{job.peopleNeeded}</span>
                </div>

                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {job.payRate.toFixed(2)} / {job.payPeriod}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {job.distance 
                      ? `${job.distance} miles - ${job.location}`
                      : job.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/jobs/${job.id}`)}>
              View Details
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>I'm Interested</Button>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Express Interest in Role</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-[280px,1fr] gap-6 py-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" alt={user?.email} />
                      <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user?.email}</h3>
                      <p className="text-sm text-muted-foreground">Event Staff</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground">
                Your profile information will be shared with {job.companyName} when you submit your application.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Write a message to {job.companyName}</p>
              <Textarea
                placeholder="Explain why you would be a great fit for this role..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-48"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!message.trim()}
              onClick={handleSubmitInterest}
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SearchBar = ({ 
  address, 
  setAddress, 
  companyName, 
  setCompanyName,
  distance,
  setDistance,
  skills,
  setSkills,
  dateRange,
  setDateRange,
  onSearch,
  onClear
}: {
  address: string;
  setAddress: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  distance: number;
  setDistance: (value: number) => void;
  skills: string[];
  setSkills: (value: string[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
  onSearch: () => void;
  onClear: () => void;
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = address || companyName || distance !== 50 || skills.length > 0 || dateRange?.from;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto,auto,auto,auto]">
        <Input
          placeholder="Search by any address - default home address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          placeholder="Search By Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-[240px]",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
            sideOffset={4}
          >
            <div className="bg-background border rounded-lg shadow-lg">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-sm whitespace-nowrap">Within</span>
          <Slider
            value={[distance]}
            onValueChange={(value) => setDistance(value[0])}
            min={0}
            max={2500}
            step={10}
            className="flex-1"
          />
          <span className="text-sm whitespace-nowrap">{distance} miles</span>
        </div>
        {hasActiveFilters && (
          <Button onClick={onClear} variant="outline">Clear</Button>
        )}
        <Button onClick={onSearch} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Advanced filters
                <Badge variant="secondary" className="ml-2 rounded-full">
                  {skills.length || "0"}
                </Badge>
                {isAdvancedOpen ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-6 rounded-lg border p-4">
                <div className="space-y-4">
                  {skillsCategories.map((category) => (
                    <div key={category.name}>
                      <h4 className="text-sm font-medium mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.skills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill}
                              checked={skills.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSkills([...skills, skill]);
                                } else {
                                  setSkills(skills.filter((s) => s !== skill));
                                }
                              }}
                            />
                            <label
                              htmlFor={skill}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-muted-foreground"
              onClick={onClear}
            >
              Clear filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const AvailableJobs = () => {
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [distance, setDistance] = useState(50);
  const [skills, setSkills] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Here you would normally fetch jobs from an API
    setJobs([]);
    setFilteredJobs([]);
  }, []);

  const handleSearch = () => {
    // In a real app, this would filter based on API calls or local filtering
    setFilteredJobs(jobs);
  };

  const handleClear = () => {
    setAddress("");
    setCompanyName("");
    setDistance(50);
    setSkills([]);
    setDateRange(undefined);
    setFilteredJobs(jobs);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <SearchBar
          address={address}
          setAddress={setAddress}
          companyName={companyName}
          setCompanyName={setCompanyName}
          distance={distance}
          setDistance={setDistance}
          skills={skills}
          setSkills={setSkills}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Available Jobs</h1>
        <span className="text-sm text-muted-foreground">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </span>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p>Loading jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableJobs;
