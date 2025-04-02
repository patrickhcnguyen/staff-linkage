
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  MapPin, 
  Star, 
  User, 
  MessageCircle, 
  X, 
  Clock, 
  Building2, 
  Calendar,
  Award
} from "lucide-react";
import { TalentBase } from "@/types/talent";

interface TalentProfileSheetProps {
  talent: TalentBase | null;
  onClose: () => void;
  onMessage: (id: number) => void;
}

export const TalentProfileSheet = ({ talent, onClose, onMessage }: TalentProfileSheetProps) => {
  if (!talent) return null;

  return (
    <Sheet open={talent !== null} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[500px]">
        <SheetHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <SheetTitle>Talent Profile</SheetTitle>
            <SheetClose className="rounded-full hover:bg-secondary p-2">
              <X className="h-4 w-4" />
            </SheetClose>
          </div>
          <Button 
            className="w-full"
            onClick={() => onMessage(talent.id)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-6 py-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={talent.image} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h3 className="text-xl font-semibold">{talent.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {talent.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">{talent.rating}</span>
                  <span className="text-muted-foreground">
                    ({talent.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Photo Gallery */}
            {talent.photos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Photo Gallery</h4>
                <div className="grid grid-cols-2 gap-2">
                  {talent.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={photo} 
                          alt={`${talent.name}'s work`} 
                          className="rounded-md object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <h4 className="font-medium">Experience</h4>
              <div className="p-3 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground">Experience</div>
                <div className="text-lg font-semibold">{talent.yearsExperience} years</div>
              </div>
            </div>

            {/* Jobs Worked */}
            {talent.jobsWorked.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Recent Jobs</h4>
                <div className="space-y-3">
                  {talent.jobsWorked.map(job => (
                    <div key={job.id} className="p-3 bg-secondary rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{job.title}</h5>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            {job.company}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {job.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {talent.reviews.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Reviews</h4>
                <div className="space-y-3">
                  {talent.reviews.map(review => (
                    <div key={review.id} className="p-3 bg-secondary rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-sm">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {talent.certifications.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Certifications</h4>
                <div className="space-y-3">
                  {talent.certifications.map(cert => (
                    <div key={cert.id} className="p-3 bg-secondary rounded-lg">
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <h5 className="font-medium">{cert.name}</h5>
                          <div className="text-sm text-muted-foreground">
                            {cert.issuedBy}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Issued {cert.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="space-y-2">
              <h4 className="font-medium">About</h4>
              <p className="text-muted-foreground">{talent.bio}</p>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <h4 className="font-medium">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {talent.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <h4 className="font-medium">Availability</h4>
              <div className="flex flex-wrap gap-2">
                {talent.availability.map((time) => (
                  <Badge key={time} variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
