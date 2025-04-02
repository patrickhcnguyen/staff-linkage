
import { useState } from "react";
import { Button } from "@/Shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Shared/components/ui/avatar";
import { Card, CardContent } from "@/Shared/components/ui/card";
import { Share2 } from "lucide-react";
import { useToast } from "@/Shared/hooks/use-toast";
import { CompanyProfileDB } from "@/services/companyServiceSupabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Shared/components/ui/dialog";
import { Input } from "@/Shared/components/ui/input";

interface CompanyProfileCardProps {
  company: CompanyProfileDB;
  onEditClick: () => void;
}

const CompanyProfileCard = ({ company, onEditClick }: CompanyProfileCardProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleShareCompany = () => {
    navigator.clipboard.writeText(`https://eventstaff.com/company/${company.id}`);
    toast({
      title: "Success",
      description: "Company profile link copied to clipboard"
    });
    setIsShareDialogOpen(false);
  };

  return (
    <>
      <Card 
        className="md:w-64 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onEditClick}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={company.logo_url} />
              <AvatarFallback>{company.name ? company.name[0] : 'C'}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.type}</p>
            <p className="text-sm text-muted-foreground mb-4">{company.id}</p>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareDialogOpen(true);
              }}
            >
              <Share2 className="h-4 w-4" />
              Share Company
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Company Profile</DialogTitle>
          </DialogHeader>
          <div className="p-4 border rounded-md">
            <p className="text-muted-foreground text-sm mb-2">Company Profile Link:</p>
            <div className="flex items-center gap-2">
              <Input 
                value={`https://eventstaff.com/company/${company.id}`} 
                readOnly
              />
              <Button onClick={handleShareCompany}>
                Copy
              </Button>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyProfileCard;
