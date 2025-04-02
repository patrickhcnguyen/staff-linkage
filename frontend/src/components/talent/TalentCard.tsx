
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, User } from "lucide-react";
import { TalentBase } from "@/types/talent";

interface TalentCardProps {
  talent: TalentBase;
  onClick: () => void;
}

export const TalentCard = ({ talent, onClick }: TalentCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={talent.image} alt={talent.name} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{talent.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              {talent.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="font-medium">{talent.rating}</span>
          <span className="text-muted-foreground">
            ({talent.reviewCount} reviews)
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm font-medium">Specialties:</div>
          <div className="flex flex-wrap gap-2">
            {talent.specialties.map((specialty) => (
              <div
                key={specialty}
                className="text-sm bg-secondary px-2 py-1 rounded-md"
              >
                {specialty}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {talent.yearsExperience} years of experience
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
