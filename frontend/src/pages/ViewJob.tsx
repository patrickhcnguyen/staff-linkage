
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, DollarSign, Clock, Star, Users, CheckCircle2, XCircle, MessageSquare, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface Applicant {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  jobsCompleted: number;
  positions: string[];
  hourlyRate: number;
  status: "pending" | "booked" | "rejected";
  availability: string[];
  email: string;
  phone: string;
  coverMessage: string; // Added this field
}

const ViewJob = () => {
  const { id } = useParams();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [bookingNotes, setBookingNotes] = useState("");

  // Mock data for demonstration
  const jobDetails = {
    title: "Event Host",
    location: "Grand Plaza Hotel",
    date: "March 15, 2024",
    time: "2:00 PM - 10:00 PM",
    hourlyRate: "$25",
    numberOfPositions: 3,
    description: "We're looking for professional event hosts for our upcoming corporate gala.",
    requiredPositions: ["Event Host", "Floor Manager"],
  };

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "Sarah Wilson",
      avatar: "/placeholder.svg",
      rating: 4.8,
      jobsCompleted: 45,
      positions: ["Event Host", "Floor Manager"],
      hourlyRate: 25,
      status: "pending",
      availability: ["March 15, 2024"],
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 123-4567",
      coverMessage: "I have extensive experience in managing high-end corporate events and would love to be part of this gala. My background in both event hosting and floor management makes me an ideal candidate for this role."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      rating: 4.9,
      jobsCompleted: 62,
      positions: ["Event Host"],
      hourlyRate: 28,
      status: "booked",
      availability: ["March 15, 2024", "March 16, 2024"],
      email: "michael.chen@example.com",
      phone: "+1 (555) 234-5678",
      coverMessage: "With my track record of successful events and passion for creating memorable experiences, I believe I would be a great addition to your team for this corporate gala."
    },
  ];

  const handleBook = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsBookingDialogOpen(true);
  };

  const confirmBooking = () => {
    if (!selectedApplicant) return;
    
    // Here you would typically make an API call to update the booking status
    toast.success(`Successfully booked ${selectedApplicant.name} for the event!`);
    setIsBookingDialogOpen(false);
    setBookingNotes("");
  };

  const handleReject = (applicant: Applicant) => {
    // Here you would typically make an API call to update the application status
    toast.success(`Application from ${applicant.name} has been rejected`);
  };

  const handleContact = (type: 'message' | 'email' | 'phone', applicant: Applicant) => {
    switch (type) {
      case 'message':
        // Navigate to messages page or open message dialog
        toast.success(`Opening chat with ${applicant.name}`);
        break;
      case 'email':
        window.location.href = `mailto:${applicant.email}`;
        break;
      case 'phone':
        window.location.href = `tel:${applicant.phone}`;
        break;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{jobDetails.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {jobDetails.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {jobDetails.date}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {jobDetails.time}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {jobDetails.hourlyRate}/hr
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                {jobDetails.numberOfPositions} positions
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Required Positions</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails.requiredPositions.map((position) => (
                <Badge key={position} variant="secondary">
                  {position}
                </Badge>
              ))}
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">{jobDetails.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Applicants Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Applicants</h2>
          <div className="space-y-4">
            {applicants.filter(a => a.status === "pending").map((applicant) => (
              <Card key={applicant.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={applicant.avatar} />
                      <AvatarFallback>{applicant.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{applicant.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{applicant.rating}</span>
                        <span>•</span>
                        <span>{applicant.jobsCompleted} jobs completed</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {applicant.positions.map((position) => (
                          <Badge key={position} variant="outline">
                            {position}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        {applicant.coverMessage}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact('message', applicant)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact('email', applicant)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact('phone', applicant)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleBook(applicant)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Book
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleReject(applicant)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booked Staff Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Booked Staff</h2>
          <div className="space-y-4">
            {applicants.filter(a => a.status === "booked").map((applicant) => (
              <Card key={applicant.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={applicant.avatar} />
                      <AvatarFallback>{applicant.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{applicant.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{applicant.rating}</span>
                        <span>•</span>
                        <span>{applicant.jobsCompleted} jobs completed</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {applicant.positions.map((position) => (
                          <Badge key={position} variant="outline">
                            {position}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact('message', applicant)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact('email', applicant)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContact('phone', applicant)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedApplicant?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Event Details</Label>
              <div className="text-sm text-muted-foreground mt-1">
                <p>{jobDetails.title} at {jobDetails.location}</p>
                <p>{jobDetails.date}, {jobDetails.time}</p>
                <p>Rate: {jobDetails.hourlyRate}/hr</p>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Booking Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any specific instructions or notes for the staff member..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewJob;
