import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Building,
  MapPin,
  Pencil,
  Plus,
  X,
  Globe,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  FileText,
  Star,
  Users
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  getCompanyProfile, 
  updateCompanyProfile, 
  handleImageUpload, 
  calculateProfileCompletion,
  CompanyProfile
} from "@/services/companyService";
import { useCompanyData } from "@/hooks/useCompanyData";

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingKeyPlayers, setIsEditingKeyPlayers] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  
  const { company, loading: supabaseLoading, error: supabaseError } = useCompanyData();
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: ""
  });
  const [completionProgress, setCompletionProgress] = useState(0);
  const [profileItems, setProfileItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [keyPlayers, setKeyPlayers] = useState<{
    id: number;
    name: string;
    role: string;
    image: string;
    bio: string;
  }[]>([]);

  useEffect(() => {
    if (company && !supabaseLoading) {
      const mappedCompany: CompanyProfile = {
        id: company.id,
        name: company.name || "",
        type: company.type || "",
        logo: company.logo_url || "/placeholder.svg",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        description: company.description || "",
        founded: company.founded || "",
        size: company.size || "",
        address: {
          street: company.street || "",
          city: company.city || "",
          state: company.state || "",
          zipCode: company.zip_code || "",
        },
        socialMedia: {
          facebook: company.facebook || "",
          twitter: company.twitter || "",
          instagram: company.instagram || "",
          linkedin: company.linkedin || "",
        },
        keyPlayers: [],
        galleryImages: Array(9).fill(""),
        completedProfile: true,
      };
      
      setCompanyData(mappedCompany);
      setSocialMedia(mappedCompany.socialMedia);
      setKeyPlayers([]);
      
      const completion = calculateProfileCompletion(mappedCompany);
      setCompletionProgress(completion);
      
      const items = {
        logo: mappedCompany.logo !== "/placeholder.svg",
        basicInfo: !!mappedCompany.name && !!mappedCompany.type,
        description: !!mappedCompany.description,
        contact: !!mappedCompany.email && !!mappedCompany.phone,
        location: !!mappedCompany.address.city && !!mappedCompany.address.state,
        social: Object.values(mappedCompany.socialMedia).some(url => !!url),
        gallery: false,
        website: !!mappedCompany.website
      };
      setProfileItems(items);
      
      setIsLoading(false);
    } else if (!supabaseLoading && !company) {
      const localCompany = getCompanyProfile();
      if (!localCompany || !localCompany.id) {
        navigate('/company-onboarding');
        return;
      }

      setCompanyData(localCompany);
      setGalleryImages(localCompany.galleryImages);
      setSocialMedia(localCompany.socialMedia);
      
      let parsedKeyPlayers = [];
      if (typeof localCompany.keyPlayers === 'string') {
        try {
          parsedKeyPlayers = JSON.parse(localCompany.keyPlayers);
        } catch (e) {
          console.error("Error parsing keyPlayers:", e);
          parsedKeyPlayers = [];
        }
      } else if (Array.isArray(localCompany.keyPlayers)) {
        parsedKeyPlayers = localCompany.keyPlayers;
      }
      
      setKeyPlayers(parsedKeyPlayers);
      
      const completion = calculateProfileCompletion(localCompany);
      setCompletionProgress(completion);
      
      const items = {
        logo: localCompany.logo !== "/placeholder.svg",
        basicInfo: !!localCompany.name && !!localCompany.type,
        description: !!localCompany.description,
        contact: !!localCompany.email && !!localCompany.phone,
        location: !!localCompany.address.city && !!localCompany.address.state,
        social: Object.values(localCompany.socialMedia).some(url => !!url),
        gallery: localCompany.galleryImages.some(img => !!img),
        website: !!localCompany.website
      };
      setProfileItems(items);
      
      setIsLoading(false);
    }
  }, [company, supabaseLoading, navigate]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && companyData) {
      try {
        const base64Logo = await handleImageUpload(file);
        const updatedCompany = updateCompanyProfile({ logo: base64Logo });
        setCompanyData(updatedCompany);
        toast({
          title: "Success",
          description: "Company logo updated successfully!"
        });
      } catch (error) {
        console.error("Error processing logo:", error);
        toast({
          title: "Error",
          description: "Failed to process the image. Please try another.",
          variant: "destructive"
        });
      }
    }
  };

  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file && companyData) {
      try {
        const base64Image = await handleImageUpload(file);
        const newGalleryImages = [...galleryImages];
        newGalleryImages[index] = base64Image;
        setGalleryImages(newGalleryImages);
        
        const updatedCompany = updateCompanyProfile({ galleryImages: newGalleryImages });
        setCompanyData(updatedCompany);
        
        toast({
          title: "Success",
          description: "Gallery image uploaded successfully!"
        });
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Error",
          description: "Failed to process the image. Please try another.",
          variant: "destructive"
        });
      }
    }
  };

  const deletePhoto = (index: number) => {
    if (!companyData) return;
    
    const newGalleryImages = [...galleryImages];
    newGalleryImages[index] = "";
    setGalleryImages(newGalleryImages);
    
    const updatedCompany = updateCompanyProfile({ galleryImages: newGalleryImages });
    setCompanyData(updatedCompany);
    
    toast({
      title: "Success",
      description: "Photo removed from gallery"
    });
  };

  const handleInfoChange = (field: keyof CompanyProfile, value: string) => {
    if (!companyData) return;
    
    const updates = { [field]: value } as Partial<CompanyProfile>;
    const updatedCompany = updateCompanyProfile(updates);
    setCompanyData(updatedCompany);
  };

  const handleAddressChange = (field: string, value: string) => {
    if (!companyData) return;
    
    const updatedAddress = { 
      ...companyData.address, 
      [field]: value 
    };
    
    const updatedCompany = updateCompanyProfile({ address: updatedAddress });
    setCompanyData(updatedCompany);
  };

  const handleSocialMediaChange = (platform: keyof typeof socialMedia, value: string) => {
    if (!companyData) return;
    
    const updatedSocialMedia = { 
      ...companyData.socialMedia, 
      [platform]: value 
    };
    
    setSocialMedia(updatedSocialMedia);
    const updatedCompany = updateCompanyProfile({ socialMedia: updatedSocialMedia });
    setCompanyData(updatedCompany);
  };

  const saveKeyPlayers = (players: any[]) => {
    if (!companyData) return;
    
    setKeyPlayers(players);
    
    const updatedCompany = updateCompanyProfile({ keyPlayers: players });
    setCompanyData(updatedCompany);
    
    toast({
      title: "Success",
      description: "Key players updated successfully!"
    });
    
    setIsEditingKeyPlayers(false);
  };

  const saveDescription = (description: string) => {
    if (!companyData) return;
    
    const updatedCompany = updateCompanyProfile({ description });
    setCompanyData(updatedCompany);
    
    toast({
      title: "Success",
      description: "About section updated successfully!"
    });
    
    setIsEditingAbout(false);
  };

  const saveCompanyInfo = () => {
    if (!companyData) return;
    
    updateCompanyProfile({
      name: companyData.name,
      type: companyData.type,
      address: companyData.address,
      socialMedia: companyData.socialMedia
    });
    
    const completion = calculateProfileCompletion(companyData);
    setCompletionProgress(completion);
    
    toast({
      title: "Success",
      description: "Company information updated successfully!"
    });
    
    setIsEditingInfo(false);
  };

  const saveCompanyDetails = () => {
    if (!companyData) return;
    
    updateCompanyProfile({
      founded: companyData.founded,
      size: companyData.size,
      address: companyData.address
    });
    
    toast({
      title: "Success",
      description: "Company details updated successfully!"
    });
    
    setIsEditingDetails(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <p>Loading profile editor...</p>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h3 className="text-xl font-medium mb-4">No Company Profile</h3>
        <p className="text-muted-foreground mb-6">You haven't created a company profile yet.</p>
        <Button onClick={() => navigate('/company-onboarding')}>
          Create Company Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Company Profile
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingInfo(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-40 w-40 mb-6">
                      <AvatarImage src={companyData.logo} />
                      <AvatarFallback>{companyData.name[0]}</AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="logo-upload" 
                      className="absolute bottom-6 right-0 h-10 w-10 flex items-center justify-center bg-background border-2 border-border rounded-full cursor-pointer hover:bg-secondary transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold mb-1">{companyData.name}</h3>
                      <p className="text-muted-foreground">{companyData.type}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {companyData.address.city || "No location"}, {companyData.address.state || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      {Object.entries(companyData.socialMedia).map(([platform, url]) => {
                        if (!url) return null;
                        
                        let Icon;
                        switch (platform) {
                          case "facebook": Icon = Facebook; break;
                          case "twitter": Icon = Twitter; break;
                          case "instagram": Icon = Instagram; break;
                          case "linkedin": Icon = Linkedin; break;
                          default: return null;
                        }
                        
                        return (
                          <a 
                            key={platform}
                            href={`https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Company Details
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingDetails(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Founded</Label>
                  <p>{companyData.founded || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Company Size</Label>
                  <p>{companyData.size || "Not specified"} employees</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Website</Label>
                  <p className="text-sm">{companyData.website || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-sm">{companyData.email || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="text-sm">{companyData.phone || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Address</Label>
                  <p className="text-sm">
                    {companyData.address.street || "No street address"}<br />
                    {companyData.address.city || "No city"}, {companyData.address.state || ""} {companyData.address.zipCode || ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-success" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionProgress} className="h-1.5 mb-2" />
              <p className="text-xs text-muted-foreground mb-2">
                {Object.values(profileItems).filter(Boolean).length} out of {Object.values(profileItems).length} items completed
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(profileItems).map(([key, completed]) => (
                  <div 
                    key={key} 
                    className={`flex items-center gap-1.5 text-xs ${
                      completed ? 'text-success' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      completed ? 'bg-success' : 'bg-muted'
                    }`} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-2/3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                About Company
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingAbout(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {companyData.description || "No description provided yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Open Jobs
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/post-job')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">You don't have any active job postings yet.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/post-job')}
                >
                  Post Your First Job
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Reviews and Ratings
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <span className="ml-1 font-semibold">-</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">(0 reviews)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Key Players
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingKeyPlayers(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {keyPlayers && keyPlayers.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {keyPlayers.map((player) => (
                    <div key={player.id} className="flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={player.image} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{player.name}</h4>
                        <p className="text-sm text-primary">{player.role}</p>
                        <p className="text-sm text-muted-foreground mt-1">{player.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">No key players added yet.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingKeyPlayers(true)}
                  >
                    Add Key Players
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Photo Gallery
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsGalleryDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  image ? (
                    <div 
                      key={index}
                      className="aspect-square relative group rounded-md overflow-hidden"
                    >
                      <img 
                        src={image} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => deletePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : null
                )).filter(Boolean)}
                
                {galleryImages.filter(img => !!img).length === 0 && (
                  <div className="col-span-3 p-8 text-center border border-dashed rounded-md">
                    <p className="text-muted-foreground mb-4">No gallery photos added yet.</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsGalleryDialogOpen(true)}
                    >
                      Add Your First Photo
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/company-dashboard')}>
              Back to Dashboard
            </Button>
            <Button 
              type="submit"
              onClick={() => {
                toast({
                  title: "Success",
                  description: "All changes saved successfully!"
                });
                navigate('/company-dashboard');
              }}
            >
              Save All Changes
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Company Type</Label>
                <Input
                  id="type"
                  value={companyData.type}
                  onChange={(e) => handleInfoChange('type', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Location</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="City"
                  value={companyData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
                <Input
                  placeholder="State"
                  value={companyData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Label>Social Media</Label>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Facebook className="h-4 w-4" />
                    <Label htmlFor="facebook" className="text-xs">Facebook</Label>
                  </div>
                  <Input
                    id="facebook"
                    value={companyData.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="facebook.com/company"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Twitter className="h-4 w-4" />
                    <Label htmlFor="twitter" className="text-xs">Twitter</Label>
                  </div>
                  <Input
                    id="twitter"
                    value={companyData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="twitter.com/company"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Instagram className="h-4 w-4" />
                    <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                  </div>
                  <Input
                    id="instagram"
                    value={companyData.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="instagram.com/company"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Linkedin className="h-4 w-4" />
                    <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                  </div>
                  <Input
                    id="linkedin"
                    value={companyData.socialMedia.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="linkedin.com/company/name"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveCompanyInfo}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Photo to Gallery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative border-2 border-dashed border-border rounded-md overflow-hidden hover:border-primary/50 transition-colors"
                >
                  {image ? (
                    <div className="relative h-full">
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => deletePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                      <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryImageUpload(e, index)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsGalleryDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingAbout} onOpenChange={setIsEditingAbout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit About Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Company Description</Label>
              <Textarea
                value={companyData.description}
                onChange={(e) => handleInfoChange('description', e.target.value)}
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => saveDescription(companyData.description)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingDetails} onOpenChange={setIsEditingDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Founded Year</Label>
                <Input
                  value={companyData.founded}
                  onChange={(e) => handleInfoChange('founded', e.target.value)}
                />
              </div>
              <div>
                <Label>Company Size</Label>
                <Input
                  value={companyData.size}
                  onChange={(e) => handleInfoChange('size', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Street Address</Label>
              <Input
                value={companyData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={companyData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={companyData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                />
              </div>
              <div>
                <Label>ZIP Code</Label>
                <Input
                  value={companyData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveCompanyDetails}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingKeyPlayers} onOpenChange={setIsEditingKeyPlayers}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Key Players</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {keyPlayers.map((player, index) => (
              <div key={player.id} className="space-y-4 pb-4 border-b last:border-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Key Player {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      const newKeyPlayers = keyPlayers.filter(p => p.id !== player.id);
                      setKeyPlayers(newKeyPlayers);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={player.name}
                      onChange={(e) => {
                        const newKeyPlayers = [...keyPlayers];
                        newKeyPlayers[index] = { ...player, name: e.target.value };
                        setKeyPlayers(newKeyPlayers);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={player.role}
                      onChange={(e) => {
                        const newKeyPlayers = [...keyPlayers];
                        newKeyPlayers[index] = { ...player, role: e.target.value };
                        setKeyPlayers(newKeyPlayers);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Input
                    value={player.bio}
                    onChange={(e) => {
                      const newKeyPlayers = [...keyPlayers];
                      newKeyPlayers[index] = { ...player, bio: e.target.value };
                      setKeyPlayers(newKeyPlayers);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const newKeyPlayers = [
                  ...keyPlayers,
                  {
                    id: Date.now(),
                    name: "",
                    role: "",
                    image: "/placeholder.svg",
                    bio: ""
                  }
                ];
                setKeyPlayers(newKeyPlayers);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Key Player
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => saveKeyPlayers(keyPlayers)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCompanyProfile;
