import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Shared/components/ui/button";
import { Input } from "@/Shared/components/ui/input";
import { Label } from "@/Shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Shared/components/ui/avatar";
import { Badge } from "@/Shared/components/ui/badge";
import { Progress } from "@/Shared/components/ui/progress";
import { Plus, Pencil, Camera, ImagePlus, X, Star, Facebook, Twitter, Instagram, Linkedin, MapPin, FileText, FileUp, Eye, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Shared/components/ui/dialog";
import { ScrollArea } from "@/Shared/components/ui/scroll-area";
import { Checkbox } from "@/Shared/components/ui/checkbox";
import { Separator } from "@/Shared/components/ui/separator";
import { DialogFooter } from "@/Shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Shared/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/Shared/components/ui/radio-group";
import { useToast } from "@/Shared/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile, uploadAvatar, UserProfile } from "@/services/userService";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@/styles/features/map/mapbox-geocoder.css';
import { supabase } from '@/lib/supabase';

const skillsCategories = [
  {
    name: "Hospitality & Guest Services",
    skills: ["Event Host/Hostess", "Usher", "Registration Staff", "Concierge Staff", "Guest List Coordinator", "Coat Check Attendant"]
  },
  {
    name: "Bartenders & Catering Staff",
    skills: ["Bartender", "Mixologist", "Cocktail Server", "Banquet Server", "Catering Staff", "Food Runner", "Busser", "Barback", "Event Chef"]
  },
  {
    name: "Promotional & Brand Activation",
    skills: ["Brand Ambassador", "Promotional Model", "Product Demonstrator", "Trade Show Booth Staff", "Sampling Staff", "Street Team Member", "Mascot Performer", "Flyer Distributor"]
  },
  {
    name: "Corporate & Conference Events",
    skills: ["Conference Host", "Panel Moderator", "Greeter", "Badge Scanner", "Convention Staff", "Interpreter/Translator", "Event Coordinator"]
  },
  {
    name: "Technical & Production",
    skills: ["Audio-Visual Technician", "Lighting Technician", "Stagehand", "Event Setup & Breakdown Crew", "IT Support Staff", "Sound Engineer", "Live Streaming Technician"]
  },
  {
    name: "Security & Crowd Control",
    skills: ["Event Security Guard", "Bouncer", "Crowd Control Staff", "ID Checker", "Emergency Response Team Member"]
  },
  {
    name: "Entertainment & Performance",
    skills: ["DJ", "Live Band/Musician", "Dancer", "Emcee/Host", "Magician", "Comedian", "Circus Performer"]
  },
  {
    name: "Logistics & Support",
    skills: ["Runner", "Parking Attendant", "Driver/Chauffeur", "VIP Concierge", "Delivery Personnel", "First Aid/Medical Staff"]
  }
];

const positions = [
  {
    category: "Event Management",
    roles: [
      "Event Coordinator",
      "Event Manager",
      "Event Supervisor",
      "Floor Manager",
      "Venue Coordinator",
      "Site Manager",
      "Event Director",
      "Production Coordinator"
    ]
  },
  {
    category: "Service Staff",
    roles: [
      "Server",
      "Lead Server",
      "Food Runner",
      "Busser",
      "Host/Hostess",
      "Maitre d'",
      "Banquet Captain",
      "Dining Room Manager"
    ]
  },
  {
    category: "Bar Staff",
    roles: [
      "Bartender",
      "Lead Bartender",
      "Bar Manager",
      "Mixologist",
      "Bar Back",
      "Beverage Director",
      "Wine Steward",
      "Sommelier"
    ]
  },
  {
    category: "Culinary Staff",
    roles: [
      "Chef",
      "Sous Chef",
      "Line Cook",
      "Prep Cook",
      "Pastry Chef",
      "Kitchen Manager",
      "Catering Chef",
      "Food Stylist"
    ]
  },
  {
    category: "Brand Ambassadors",
    roles: [
      "Brand Ambassador",
      "Product Demonstrator",
      "Promotional Model",
      "Trade Show Representative",
      "Sampling Specialist",
      "Marketing Event Staff",
      "Guest Relations Specialist",
      "VIP Coordinator"
    ]
  },
  {
    category: "Entertainment",
    roles: [
      "DJ",
      "MC/Host",
      "Live Performer",
      "Musician",
      "Dancer",
      "Entertainer",
      "Stage Manager",
      "Performance Director"
    ]
  },
  {
    category: "Technical Staff",
    roles: [
      "AV Technician",
      "Sound Engineer",
      "Lighting Technician",
      "Stage Hand",
      "Production Assistant",
      "Technical Director",
      "Video Operator",
      "Multimedia Specialist"
    ]
  },
  {
    category: "Support Staff",
    roles: [
      "Security Guard",
      "Coat Check Attendant",
      "Ticket Taker",
      "Registration Staff",
      "Information Desk Staff",
      "Crowd Control",
      "Cleaning Staff",
      "Set-up/Tear-down Crew"
    ]
  }
];

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    user_id: "",
    first_name: "",
    last_name: "",
    avatar_url: "/placeholder.svg",
    email: "",
    phone: "",
    address: "",
    skills: [],
    // experience: [],
    // education: [],
    created_at: "",
    updated_at: "",
    // rating: 0,
    experience_years: 0,
    experience_months: 0,
    height_feet: 0,
    height_inches: 0,
    birth_date: "",
    // role: "",
    gender: "prefer-not-to-say",
    // certifications: [],
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",     
    // gallery_images: [],
    resume_url: "",
    travel_nationally: false,
    travel_duration: "",
    notifications_enabled: false,
    terms_accepted: false,
    is_onboarded: false,
    // resume_name: "",
    // positions: [],
    // jobs_count: 0,
    // reviews_count: 0
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(Array(9).fill(""));
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [resume, setResume] = useState<{ name: string; url: string } | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isPositionsDialogOpen, setIsPositionsDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (profileData) {
          setProfile(profileData as UserProfile);
          setProfileImage(profileData.avatar_url || "/placeholder.svg");
          setSkills(profileData.skills || []);
          setGalleryImages(profileData.gallery_images || Array(9).fill(""));
          
          if (profileData.resume_url) {
            setResume({
              name: profileData.resume_name || "resume.pdf",
              url: profileData.resume_url
            });
          }
          
          setSelectedPositions(profileData.positions || []);
          setJobsCount(profileData.jobs_count || 0);
          setReviewsCount(profileData.reviews_count || 0);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (!geocoderRef.current && geocoderContainerRef.current) {
      if (geocoderContainerRef.current.firstChild) {
        geocoderContainerRef.current.innerHTML = '';
      }

      mapboxgl.accessToken = 'pk.eyJ1IjoiZXZlcnNoaWZ0IiwiYSI6ImNtNTYyOTZzNTNiNzAycnBwMzRsM2wwcWQifQ.L6x2ZJ--id6c60ZfJ3hogQ';
      
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'address',
        countries: 'US',
        placeholder: '🔍 Search for your address...',
        marker: false,
        clearOnBlur: false
      });

      geocoder.addTo(geocoderContainerRef.current);
      
      geocoder.on('result', (e: any) => {
        const { place_name, center } = e.result;
        const addressComponents = place_name.split(',').map((part: string) => part.trim());
        
        const street = addressComponents[0];
        const city = addressComponents[1];
        const stateZip = addressComponents[2].split(' ');
        const state = stateZip[0];
        const zipCode = stateZip[1];

        setProfile(prev => prev ? {
          ...prev,
          address: street
        } : null);
      });

      if (profile?.address) {
        geocoder.setInput(profile.address);
      }

      geocoderRef.current = geocoder;
    }

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
      }
    };
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const avatarUrl = await uploadAvatar(user.id, file);
        if (!avatarUrl) throw new Error('Failed to upload avatar');

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        setProfileImage(avatarUrl);
        
        toast({
          title: "Success",
          description: "Profile image updated successfully"
        });
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      }
    }
  };

  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newGalleryImages = [...galleryImages];
          newGalleryImages[index] = reader.result as string;
          setGalleryImages(newGalleryImages);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Error",
          description: "Failed to process the image",
          variant: "destructive"
        });
      }
    }
  };

  const handleCertificationImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCertifications = [...profile?.certifications || []];
        newCertifications[index] = { 
          ...newCertifications[index], 
          image: reader.result as string 
        };
        setProfile(prev => prev ? {
          ...prev,
          certifications: newCertifications
        } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCertification = () => {
    setProfile(prev => prev ? {
      ...prev,
      certifications: [...prev.certifications, { 
        name: "New Certification", 
        type: "certification", 
        isEditing: true 
      }]
    } : null);
  };

  const updateCertification = (index: number, newName: string) => {
    setProfile(prev => prev ? {
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, name: newName, isEditing: false } : cert
      )
    } : null);
  };

  const toggleEdit = (index: number) => {
    setEditingCertIndex(editingCertIndex === index ? null : index);
  };

  const handleSkillsSubmit = async () => {
    if (!user) return;
    
    const updatedSkills = [...new Set([...skills, ...selectedSkills])];
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: updatedSkills })
        .eq('user_id', user.id);

      if (error) throw error;

      setSkills(updatedSkills);
      setSelectedSkills([]);
      setIsSkillsDialogOpen(false);

      toast({
        title: "Success",
        description: "Skills updated successfully"
      });
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        title: "Error",
        description: "Failed to update skills",
        variant: "destructive"
      });
    }
  };

  const removeSkill = async (skillToRemove: string) => {
    if (!user) return;
    
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: updatedSkills })
        .eq('user_id', user.id);

      if (error) throw error;

      setSkills(updatedSkills);
      
      toast({
        title: "Success",
        description: "Skill removed successfully"
      });
    } catch (error) {
      console.error("Error removing skill:", error);
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive"
      });
    }
  };

  const handleProfileUpdate = async (field: keyof UserProfile, value: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        [field]: value
      }));

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const existingPhotos = galleryImages.filter(img => img !== "");
  const remainingSlots = 9 - existingPhotos.length;

  const deletePhoto = (indexToDelete: number) => {
    const newGalleryImages = galleryImages.filter((_, index) => {
      const photoIndex = galleryImages.indexOf(existingPhotos[indexToDelete]);
      return index !== photoIndex;
    });
    setGalleryImages(newGalleryImages);
  };

  const handleSocialMediaChange = async (platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter', value: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [platform]: value })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        [platform]: value
      } : null);

      toast({
        title: "Success",
        description: `${platform} updated successfully`
      });
    } catch (error) {
      console.error(`Error updating ${platform}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${platform}`,
        variant: "destructive"
      });
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setResume({
          name: file.name,
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeResume = () => {
    setResume(null);
  };

  const handlePositionsSubmit = () => {
    setIsPositionsDialogOpen(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          // bio: profile.bio,
          address: profile.address,
          avatar_url: profile.avatar_url,
          skills: profile.skills,
          // experience: profile.experience,
          // education: profile.education,
          // rating: profile.rating,
          experience_years: profile.experience_years,
          experience_months: profile.experience_months,
          height_feet: profile.height_feet,
          height_inches: profile.height_inches,
          birth_date: profile.birth_date,
          // role: profile.role,
          gender: profile.gender,
          // certifications: profile.certifications,
          // facebook: profile.facebook,
          // twitter: profile.twitter,
          // instagram: profile.instagram,
          // linkedin: profile.linkedin,
          // gallery_images: profile.gallery_images,
          resume_url: profile.resume_url,
          // resume_name: profile.resume_name,
          // positions: profile.positions
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile changes"
      });
    }
  };

  const profileItems = {
    avatar: !!profileImage && profileImage !== "/placeholder.svg",
    name: !!profile?.first_name && !!profile?.last_name,
    // role: !!profile?.role,
    bio: false,
    skills: skills.length > 0,
    contact: !!profile?.email && !!profile?.phone,
    location: !!profile?.address,
    // certifications: profile?.certifications?.length > 0,
    gallery: galleryImages.some(img => img !== ""),
    resume: !!resume,
    social: !!(profile?.facebook_url || profile?.instagram_url || profile?.linkedin_url),
  };

  const completedItems = Object.values(profileItems).filter(Boolean).length;
  const totalItems = Object.values(profileItems).length;
  const completionProgress = (completedItems / totalItems) * 100;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Profile Details
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
                      <AvatarImage src={profileImage} />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="profile-image" 
                      className="absolute bottom-6 right-0 h-10 w-10 flex items-center justify-center bg-background border-2 border-border rounded-full cursor-pointer hover:bg-secondary transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="w-full space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-center mb-1">{profile?.first_name} {profile?.last_name}</h3>
                      {/* <div className="flex items-center justify-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= profile?.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : star <= Math.ceil(profile?.rating)
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({profile?.rating})
                        </span>
                      </div> */}
                      {/* <p className="text-muted-foreground text-center">{profile?.role}</p> */}
                      <p className="text-sm text-muted-foreground text-center mt-1">
                        {profile?.experience_years} years in industry
                      </p>
                      
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{profile?.address}</span>
                      </div>

                      {/* <div className="flex justify-center gap-4 mt-2">
                        {[
                          { platform: 'facebook', url: profile?.facebook_url, Icon: Facebook },
                          { platform: 'instagram', url: profile?.instagram_url, Icon: Instagram },
                          { platform: 'linkedin', url: profile?.linkedin_url, Icon: Linkedin }
                        ].map(({ platform, url, Icon }) => url ? (
                          <a 
                            key={platform}
                            href={`https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        ) : null)}
                      </div> */}
                    </div>

                    <div className="pt-4 space-y-2">
                      <div>
                        <Label className="text-muted-foreground text-sm">Email</Label>
                        <p className="text-sm">{profile?.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Phone</Label>
                        <p className="text-sm">{profile?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-success" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionProgress} className="h-1.5 mb-2" />
              <p className="text-xs text-muted-foreground mb-2">
                {completedItems} out of {totalItems} items completed
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
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Jobs Worked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-4xl font-bold text-primary">{jobsCount}</span>
                  <span className="text-sm text-muted-foreground mt-1">Total Bookings</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-4xl font-bold text-primary">{reviewsCount}</span>
                  <span className="text-sm text-muted-foreground mt-1">Total Reviews</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  {/* <span className="text-4xl font-bold text-primary">{profile?.certifications?.length}</span> */}
                  <span className="text-sm text-muted-foreground mt-1">Total Certifications</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Skills
                <Button variant="outline" size="sm" onClick={() => setIsSkillsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm group">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Certifications
                <Button variant="outline" size="sm" onClick={addCertification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile?.certifications?.map((cert, index) => (
                  <div key={index} className="flex flex-col items-center p-4 border rounded-lg relative group">
                    <div className="relative w-16 h-16 mb-2">
                      {cert.image ? (
                        <img 
                          src={cert.image} 
                          alt={cert.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center">
                          <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <label 
                        htmlFor={`cert-image-${index}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          id={`cert-image-${index}`}
                          accept="image/*"
                          onChange={(e) => handleCertificationImageUpload(e, index)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {editingCertIndex === index ? (
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(index, e.target.value)}
                        onBlur={() => setEditingCertIndex(null)}
                        autoFocus
                        className="text-sm text-center"
                      />
                    ) : (
                      <div onClick={() => toggleEdit(index)}>
                        <span className="text-sm font-medium text-center">{cert.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Positions
                <Button variant="outline" size="sm" onClick={() => setIsPositionsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedPositions.map((position, index) => (
                  <Badge key={index} variant="secondary" className="text-sm group">
                    {position}
                    <button
                      onClick={() => setSelectedPositions(prev => prev.filter(p => p !== position))}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedPositions.length === 0 && (
                  <p className="text-sm text-muted-foreground">No positions selected</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Photo Gallery
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingGallery(!isEditingGallery)}
                >
                  {isEditingGallery ? 'Done' : <Pencil className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {existingPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {existingPhotos.map((image, index) => (
                    <div 
                      key={index}
                      className="aspect-square relative group border rounded-md overflow-hidden"
                    >
                      <img 
                        src={image} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isEditingGallery && (
                        <button
                          onClick={() => deletePhoto(index)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditingGallery && remainingSlots > 0 && (
                    <button 
                      onClick={() => setIsGalleryDialogOpen(true)}
                      className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md hover:border-muted-foreground/50 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-sm text-muted-foreground">Add Photo</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4 py-6">
                  <p className="text-muted-foreground">No photos uploaded yet</p>
                  <Button variant="outline" onClick={() => setIsGalleryDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              {resume ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[180px]">
                          {resume.name}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeResume}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(resume.url, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="rounded-lg border-2 border-dashed p-8 text-center">
                    <label
                      htmlFor="resume-upload"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <FileUp className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Upload your resume</p>
                        <p className="text-xs text-muted-foreground">PDF up to 5MB</p>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Select PDF
                      </Button>
                    </label>
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button type="submit" onClick={saveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profile?.first_name}
                  onChange={(e) => handleProfileUpdate('first_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profile?.last_name}
                  onChange={(e) => handleProfileUpdate('last_name', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile?.phone}
                  onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile?.role}
                  onChange={(e) => handleProfileUpdate('role', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="experience_years">Years in Industry</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={profile?.experience_years}
                  onChange={(e) => handleProfileUpdate('experience_years', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="experience_months">Months in Industry</Label>
                <Input
                  id="experience_months"
                  type="number"
                  value={profile?.experience_months}
                  onChange={(e) => handleProfileUpdate('experience_months', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile?.gender}
                  onValueChange={(value) => handleProfileUpdate('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Complete Address</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    if (geocoderRef.current) {
                      geocoderRef.current.clear();
                    }
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="border rounded-md p-4 space-y-3 bg-secondary/20">
                <div 
                  ref={geocoderContainerRef}
                  className="geocoder-container w-full"
                />
                <div className="space-y-1">
                  <p className="text-xs font-medium flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Current Address:
                  </p>
                  {profile?.address ? (
                    <>
                      <p className="text-sm">
                        {profile.address}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Search and select your address above
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Only city and state will be visible on your public profile
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Label>Social Media</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Facebook className="h-4 w-4" />
                    <Label htmlFor="facebook" className="text-xs">Facebook</Label>
                  </div>
                  <Input
                    id="facebook"
                    value={profile?.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="facebook.com/username"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Twitter className="h-4 w-4" />
                    <Label htmlFor="twitter" className="text-xs">Twitter</Label>
                  </div>
                  <Input
                    id="twitter"
                    value={profile?.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="twitter.com/username"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Instagram className="h-4 w-4" />
                    <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                  </div>
                  <Input
                    id="instagram"
                    value={profile?.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="instagram.com/username"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Linkedin className="h-4 w-4" />
                    <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                  </div>
                  <Input
                    id="linkedin"
                    value={profile?.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditingInfo(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSkillsDialogOpen} onOpenChange={setIsSkillsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Skills</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-8">
              {skillsCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="text-md font-medium mb-3 text-primary">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-3 bg-secondary/50 rounded-lg p-4">
                    {category.skills.map((skill) => (
                      <div
                        key={skill}
                        className="relative flex items-start space-x-2 bg-background rounded-md p-3 shadow-sm transition-all hover:shadow-md"
                      >
                        <Checkbox
                          id={skill}
                          className="mt-1"
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSkills([...selectedSkills, skill]);
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                        />
                        <label
                          htmlFor={skill}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsSkillsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSkillsSubmit}>
              Add Selected Skills
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPositionsDialogOpen} onOpenChange={setIsPositionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Positions</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-8">
              {positions.map((category) => (
                <div key={category.category}>
                  <h4 className="text-md font-medium mb-3 text-primary">{category.category}</h4>
                  <div className="grid grid-cols-2 gap-3 bg-secondary/50 rounded-lg p-4">
                    {category.roles.map((role) => (
                      <div
                        key={role}
                        className="relative flex items-start space-x-2 bg-background rounded-md p-3 shadow-sm transition-all hover:shadow-md"
                      >
                        <Checkbox
                          id={role}
                          className="mt-1"
                          checked={selectedPositions.includes(role)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPositions(prev => [...prev, role]);
                            } else {
                              setSelectedPositions(prev => prev.filter(p => p !== role));
                            }
                          }}
                        />
                        <label
                          htmlFor={role}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPositionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePositionsSubmit}>
              Save Positions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div 
              className="aspect-square relative border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden hover:border-muted-foreground/50 transition-colors"
            >
              <label 
                htmlFor="new-gallery-image"
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              >
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload photo</span>
                <input
                  type="file"
                  id="new-gallery-image"
                  accept="image/*"
                  onChange={(e) => {
                    if (remainingSlots > 0) {
                      const nextIndex = galleryImages.findIndex(img => img === "");
                      handleGalleryImageUpload(e, nextIndex);
                      setIsGalleryDialogOpen(false);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {remainingSlots} {remainingSlots === 1 ? 'slot' : 'slots'} remaining
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
