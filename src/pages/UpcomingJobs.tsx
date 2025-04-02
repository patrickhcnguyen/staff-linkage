
import { useState, useEffect } from "react";
import { Calendar, MapPin, User, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JobBooking {
  id: string;
  title: string;
  date: string;
  role: string;
  hourly_rate: number;
  location: string;
  start_time: string;
  end_time: string;
  company_name: string;
  company_logo: string | null;
  is_past: boolean | null;
}

const UpcomingJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [cancellingJob, setCancellingJob] = useState(false);

  useEffect(() => {
    const fetchUserJobs = async () => {
      if (!user) {
        toast.error("Please log in to view your bookings");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('job_bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;

        setJobs(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job bookings:', err);
        toast.error("Failed to load bookings");
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleCancelJob = async () => {
    if (!selectedJobId) return;
    
    setCancellingJob(true);
    try {
      const { error } = await supabase
        .from('job_bookings')
        .delete()
        .eq('id', selectedJobId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setJobs(jobs.filter(job => job.id !== selectedJobId));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      console.error('Error cancelling job booking:', err);
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingJob(false);
      setIsConfirmCancelOpen(false);
      setSelectedJobId(null);
    }
  };

  const openCancelConfirm = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation(); // Prevent navigation to job details
    setSelectedJobId(jobId);
    setIsConfirmCancelOpen(true);
  };

  const JobList = ({ jobs }: { jobs: JobBooking[] }) => (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No bookings found</p>
          <p className="text-sm text-muted-foreground mb-6">
            Bookings will appear here when companies book you for events
          </p>
          <Button 
            onClick={() => navigate('/jobs')}
            className="mx-auto"
          >
            Browse Available Jobs
          </Button>
        </div>
      ) : (
        jobs.map((job) => (
          <Card 
            key={job.id} 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.company_logo || ''} alt={job.company_name} />
                  <AvatarFallback>{job.company_name[0]}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    <span className="text-sm text-muted-foreground">· {job.company_name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(job.date)} · {job.start_time} - {job.end_time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{job.role}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-primary font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${job.hourly_rate}/hr</span>
                </div>
                
                {!job.is_past && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
                    onClick={(e) => openCancelConfirm(e, job.id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const upcomingJobs = jobs.filter(job => !job.is_past);
  const pastJobs = jobs.filter(job => job.is_past);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      <p className="text-muted-foreground mb-6">
        View all your confirmed bookings from companies. Bookings are managed by companies and will appear here when you've been booked for an event.
      </p>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <JobList jobs={upcomingJobs} />
        </TabsContent>
        <TabsContent value="past">
          <JobList jobs={pastJobs} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isConfirmCancelOpen} onOpenChange={setIsConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancellingJob}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelJob}
              disabled={cancellingJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancellingJob ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpcomingJobs;
