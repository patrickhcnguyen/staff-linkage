
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Eye, 
  MessageSquare, 
  XCircle 
} from "lucide-react";
import { JobApplication } from "@/services/jobService";

interface ApplicationsTableProps {
  applications: JobApplication[];
  onViewDetails: (application: JobApplication) => void;
  onUpdateStatus: (applicationId: string, status: JobApplication['status']) => void;
  onSendMessage: (application: JobApplication) => void;
}

const ApplicationsTable = ({ 
  applications, 
  onViewDetails, 
  onUpdateStatus,
  onSendMessage
}: ApplicationsTableProps) => {
  
  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case "Applied":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Applied</Badge>;
      case "Reviewing":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Reviewing</Badge>;
      case "Accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={application.user_profile?.avatar_url || ''} 
                        alt={application.user_profile?.full_name || 'User'} 
                      />
                      <AvatarFallback>
                        {application.user_profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {application.user_profile?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {application.user_profile?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {application.job?.title || 'Unknown Job'}
                </TableCell>
                <TableCell>{formatDate(application.created_at)}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewDetails(application)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSendMessage(application)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1">
                          Status <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(application.id, 'Reviewing')}
                          className="gap-2"
                        >
                          <Clock className="h-4 w-4" /> Reviewing
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(application.id, 'Accepted')}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(application.id, 'Rejected')}
                          className="gap-2"
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;

