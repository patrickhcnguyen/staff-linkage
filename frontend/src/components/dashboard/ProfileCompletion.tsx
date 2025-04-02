
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building } from "lucide-react";
import { CompanyProfileDB } from "@/services/companyServiceSupabase";

interface ProfileCompletionProps {
  company: CompanyProfileDB;
}

const ProfileCompletion = ({ company }: ProfileCompletionProps) => {
  const profileItems = {
    logo: !!company.logo_url && company.logo_url !== "/placeholder.svg",
    basicInfo: !!company.name && !!company.type,
    description: !!company.description,
    contact: !!company.email && !!company.phone,
    website: !!company.website,
    location: !!company.city && !!company.state,
    socialMedia: !!(company.facebook || company.twitter || company.instagram || company.linkedin),
    payment: false,
    documents: false,
  };

  const completedItems = Object.values(profileItems).filter(Boolean).length;
  const totalItems = Object.values(profileItems).length;
  const completionProgress = (completedItems / totalItems) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Company Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={completionProgress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          {completedItems} out of {totalItems} profile items completed
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(profileItems).map(([key, completed]) => (
            <div 
              key={key} 
              className={`flex items-center gap-2 ${completed ? 'text-success' : 'text-muted-foreground'}`}
            >
              <div className={`w-2 h-2 rounded-full ${completed ? 'bg-success' : 'bg-muted'}`} />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
