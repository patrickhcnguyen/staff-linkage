
import { Trophy, Star, Clock, Users, Award, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Achievements = () => {
  const earnedAchievements = [
    { 
      id: 1, 
      title: "5-Star Service",
      description: "Received 10 five-star reviews",
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      date: "Feb 2024",
      points: 100,
      backgroundColor: "bg-yellow-50"
    },
    { 
      id: 2, 
      title: "Event Expert",
      description: "Completed 50 events",
      icon: <Trophy className="h-8 w-8 text-purple-400" />,
      date: "Jan 2024",
      points: 200,
      backgroundColor: "bg-purple-50"
    },
    { 
      id: 3, 
      title: "Quick Responder",
      description: "Responded to 100 job requests",
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      date: "Dec 2023",
      points: 150,
      backgroundColor: "bg-blue-50"
    }
  ];

  const availableAchievements = [
    {
      id: 4,
      title: "Team Player",
      description: "Work with 20 different event organizers",
      icon: <Users className="h-8 w-8 text-green-400" />,
      progress: 15,
      total: 20,
      points: 250,
      backgroundColor: "bg-green-50"
    },
    {
      id: 5,
      title: "Venue Master",
      description: "Work at 10 different venues",
      icon: <Award className="h-8 w-8 text-pink-400" />,
      progress: 7,
      total: 10,
      points: 300,
      backgroundColor: "bg-pink-50"
    },
    {
      id: 6,
      title: "Perfect Month",
      description: "Complete 30 events in one month",
      icon: <Target className="h-8 w-8 text-indigo-400" />,
      progress: 22,
      total: 30,
      points: 500,
      backgroundColor: "bg-indigo-50"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-muted-foreground mt-1">Track your progress and earn rewards</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">450 points earned</span>
        </div>
      </div>

      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="earned">Earned Achievements</TabsTrigger>
          <TabsTrigger value="available">Available Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="earned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedAchievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden">
                <CardContent className={`p-6 ${achievement.backgroundColor}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {achievement.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>{achievement.points} points</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-3">Earned {achievement.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAchievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden">
                <CardContent className={`p-6 ${achievement.backgroundColor}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {achievement.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    <div className="w-full space-y-2">
                      <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{achievement.progress} / {achievement.total}</span>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>{achievement.points} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;
