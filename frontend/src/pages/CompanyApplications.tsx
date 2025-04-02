
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Shared/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/Shared/components/ui/dialog";
import { Briefcase, ClipboardList, FileText, MessageSquare } from "lucide-react";
import { useCompanyApplications } from "@/hooks/useCompanyApplications";
import ApplicationsTable from "@/Shared/components/applications/ApplicationsTable";
import { JobApplication } from "@/services/jobService";
import { Avatar, AvatarFallback, AvatarImage } from "@/Shared/components/ui/avatar";
import { Badge } from "@/Shared/components/ui/badge";
import { ScrollArea } from "@/Shared/components/ui/scroll-area";

const CompanyApplications = () => {
  const navigate = useNavigate();
  const { applications, loading, error, updateApplicationStatus } = useCompanyApplications();
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Group applications by status
  const pendingApplications = applications.filter(app => app.status === 'Applied');
  const reviewingApplications = applications.filter(app => app.status === 'Reviewing');
  const acceptedApplications = applications.filter(app => app.status === 'Accepted');
  const rejectedApplications = applications.filter(app => app.status === 'Rejected');

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  const handleSendMessage = (application: JobApplication) => {
    // For now, just navigate to messages page
    // In a real app, you might want to open a specific chat with this applicant
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h3 className="text-xl font-medium mb-4">Error Loading Applications</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Manage and respond to job applications from candidates.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Application Overview
            </CardTitle>
            <CardDescription>
              You have {applications.length} total applications across all your job postings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
                <TabsTrigger value="reviewing">Reviewing ({reviewingApplications.length})</TabsTrigger>
                <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ApplicationsTable 
                  applications={applications}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={updateApplicationStatus}
                  onSendMessage={handleSendMessage}
                />
              </TabsContent>
              
              <TabsContent value="pending">
                <ApplicationsTable 
                  applications={pendingApplications}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={updateApplicationStatus}
                  onSendMessage={handleSendMessage}
                />
              </TabsContent>
              
              <TabsContent value="reviewing">
                <ApplicationsTable 
                  applications={reviewingApplications}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={updateApplicationStatus}
                  onSendMessage={handleSendMessage}
                />
              </TabsContent>
              
              <TabsContent value="accepted">
                <ApplicationsTable 
                  applications={acceptedApplications}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={updateApplicationStatus}
                  onSendMessage={handleSendMessage}
                />
              </TabsContent>
              
              <TabsContent value="rejected">
                <ApplicationsTable 
                  applications={rejectedApplications}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={updateApplicationStatus}
                  onSendMessage={handleSendMessage}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the candidate's information and application message.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage 
                    src={selectedApplication.user_profile?.avatar_url || ''} 
                    alt={selectedApplication.user_profile?.full_name || 'User'} 
                  />
                  <AvatarFallback>
                    {selectedApplication.user_profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedApplication.user_profile?.full_name || 'Unknown User'}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      {selectedApplication.user_profile?.email}
                    </p>
                    {selectedApplication.user_profile?.phone && (
                      <p>
                        {selectedApplication.user_profile.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Applied for: <strong>{selectedApplication.job?.title}</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Status: <Badge variant="outline">{selectedApplication.status}</Badge>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedApplication.user_profile?.skills?.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Application Message</h4>
                <ScrollArea className="h-24 rounded-md border p-2">
                  <p className="text-sm">
                    {selectedApplication.message || 'No message provided'}
                  </p>
                </ScrollArea>
              </div>

              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleSendMessage(selectedApplication)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  {selectedApplication.status !== 'Accepted' && (
                    <Button 
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'Accepted');
                        setDetailsOpen(false);
                      }}
                    >
                      Accept Application
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyApplications;

