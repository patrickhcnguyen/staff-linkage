
import { Card, CardContent } from "@/Shared/components/ui/card";
import { Briefcase, Calendar, FileText, Star } from "lucide-react";

interface StatsProps {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  averageRating: number;
}

const CompanyStats = ({ totalJobs, activeJobs, totalApplications, averageRating }: StatsProps) => {
  const statsData = [
    {
      title: "Total Jobs Posted",
      value: totalJobs.toString(),
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Active Jobs",
      value: activeJobs.toString(),
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Total Applications",
      value: totalApplications.toString(),
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Average Rating",
      value: averageRating.toString(),
      icon: <Star className="h-4 w-4 text-yellow-400" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {stat.icon}
              <span className="text-2xl font-semibold">{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyStats;
