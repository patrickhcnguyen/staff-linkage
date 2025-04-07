import { Progress } from "@/Shared/components/ui/progress";
import { Button } from "@/Shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Shared/components/ui/avatar";
import { CalendarDays, Trophy, Star, StarOff, Share2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Shared/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useCompanyData } from "@/Shared/hooks/useCompanyData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { company, loading: companyLoading } = useCompanyData();
  const [loading, setLoading] = useState(true);
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (!companyLoading) {
      setLoading(false);
    }
  }, [companyLoading]);

  // Update profile items to match company fields
  const profileItems = {
    logo: company?.logo_url !== "/placeholder.svg",
    name: !!company?.name,
    type: !!company?.type,
    description: !!company?.description,
    contact: !!(company?.email && company?.phone),
    location: !!(company?.street && company?.city && company?.state && company?.zip_code),
    social: !!(company?.facebook || company?.twitter || company?.instagram || company?.linkedin),
    website: !!company?.website
  };

  const completedItems = Object.values(profileItems).filter(Boolean).length;
  const totalItems = Object.values(profileItems).length;
  const completionProgress = (completedItems / totalItems) * 100;

  const handleShare = async () => {
    const shareUrl = window.location.origin + '/review/' + (user?.id || 'user');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rate Profile',
          text: 'Please leave a review',
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half-star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOff key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card 
              className="md:w-64 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/edit-profile')}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={company?.logo_url || "/placeholder.svg"} />
                    <AvatarFallback>{company?.name?.[0] || user?.email?.[0]?.toUpperCase() || "C"}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{company?.name || user?.email}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{company?.type || "Company"}</p>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(0)}
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          Share Profile
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share profile link for reviews</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-success" />
                    Profile Completion
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
            </div>
          </div>
        </div>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/upcoming-jobs')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Upcoming Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming jobs found</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/jobs');
                }}
              >
                Browse Available Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/achievements')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Complete jobs to earn achievements</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
