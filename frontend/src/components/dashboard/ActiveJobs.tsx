
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { JobListing } from "@/services/jobService";

interface ActiveJobsProps {
  jobs: JobListing[];
}

const ActiveJobs = ({ jobs }: ActiveJobsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Active Job Postings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div 
                key={job.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer"
                onClick={() => navigate(`/view-job/${job.id}`)}
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.pay_rate}</span>
                    <span>•</span>
                    <span>{new Date(job.posted_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{job.applicants_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Applicants</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/company-applications');
                    }}
                  >
                    View Applications
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">You don't have any active job postings yet.</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/post-job')}
          >
            Post New Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveJobs;
