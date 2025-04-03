import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilters } from "@/Shared/components/talent/SearchFilters";
import { TalentCard } from "@/Shared/components/talent/TalentCard";
import { TalentProfileSheet } from "@/Shared/components/talent/TalentProfileSheet";
import { calculateDistance } from "@/Shared/utils/distance";
import { TalentBase } from "@/types/talent";

const talents: TalentBase[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/placeholder.svg",
    photos: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    location: "Los Angeles, CA",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    rating: 4.8,
    reviewCount: 56,
    specialties: ["Bartender", "Server", "Event Host"],
    yearsExperience: 5,
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
    availability: ["Weekends", "Evenings"],
    bio: "Experienced hospitality professional with a passion for creating memorable guest experiences. Specialized in high-end events and corporate functions.",
    jobsWorked: [
      {
        id: 1,
        title: "Lead Bartender",
        company: "Luxury Hotel & Resort",
        date: "Jan 2024"
      },
      {
        id: 2,
        title: "Event Host",
        company: "Corporate Events Co.",
        date: "Dec 2023"
      }
    ],
    reviews: [
      {
        id: 1,
        author: "John Smith",
        rating: 5,
        comment: "Sarah was fantastic! Very professional and kept the drinks flowing all night.",
        date: "Jan 15, 2024"
      },
      {
        id: 2,
        author: "Emily Brown",
        rating: 4.5,
        comment: "Great personality and really helped make our event special.",
        date: "Dec 28, 2023"
      }
    ],
    certifications: [
      {
        id: 1,
        name: "Professional Bartending Certificate",
        issuedBy: "Bartenders Association",
        date: "2020"
      },
      {
        id: 2,
        name: "Food Safety Certification",
        issuedBy: "ServSafe",
        date: "2023"
      }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/placeholder.svg",
    photos: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    location: "San Francisco, CA",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    rating: 4.9,
    reviewCount: 42,
    specialties: ["Sommelier", "Bar Manager", "Wine Expert"],
    yearsExperience: 8,
    email: "mike.c@example.com",
    phone: "(555) 987-6543",
    availability: ["Weekdays", "Mornings"],
    bio: "Certified sommelier with extensive knowledge of wine pairings and cellar management. Passionate about creating unique wine experiences for guests.",
    jobsWorked: [
      {
        id: 1,
        title: "Head Sommelier",
        company: "Fine Dining Restaurant",
        date: "Jan 2024"
      },
      {
        id: 2,
        title: "Wine Consultant",
        company: "Private Events",
        date: "Dec 2023"
      }
    ],
    reviews: [
      {
        id: 1,
        author: "Sarah Wilson",
        rating: 5,
        comment: "Michael's wine selections were perfect for our wedding. His knowledge is incredible!",
        date: "Jan 20, 2024"
      },
      {
        id: 2,
        author: "David Lee",
        rating: 5,
        comment: "Outstanding service and expertise. Made our wine tasting event memorable.",
        date: "Dec 15, 2023"
      }
    ],
    certifications: [
      {
        id: 1,
        name: "Advanced Sommelier Certification",
        issuedBy: "Court of Master Sommeliers",
        date: "2019"
      },
      {
        id: 2,
        name: "Wine & Spirit Education Trust Level 3",
        issuedBy: "WSET",
        date: "2021"
      }
    ]
  }
];

const TalentDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [radius, setRadius] = useState("50");
  const [userCoordinates, setUserCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentBase | null>(null);
  const navigate = useNavigate();

  const handleLocationSearch = async (value: string) => {
    setLocationSearch(value);
    if (value.length > 3) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=pk.eyJ1IjoiZXZlcnNoaWZ0IiwiYSI6ImNtNTYyOTZzNTNiNzAycnBwMzRsM2wwcWQifQ.L6x2ZJ--id6c60ZfJ3hogQ&types=place,address&country=US`
        );
        const data = await response.json();
        if (data.features && data.features[0]) {
          const [lng, lat] = data.features[0].center;
          setUserCoordinates({ lat, lng });
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    } else if (value.length === 0) {
      setUserCoordinates(null);
    }
  };

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = 
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );

    let matchesLocation = true;
    if (userCoordinates && locationSearch) {
      const distance = calculateDistance(
        userCoordinates.lat,
        userCoordinates.lng,
        talent.coordinates.lat,
        talent.coordinates.lng
      );
      matchesLocation = distance <= parseInt(radius);
    }

    return matchesSearch && matchesLocation;
  });

  const handleMessage = (talentId: number) => {
    navigate(`/messages?contact=${talentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationSearch={locationSearch}
          handleLocationSearch={handleLocationSearch}
          radius={radius}
          setRadius={setRadius}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <TalentCard
              key={talent.id}
              talent={talent}
              onClick={() => setSelectedTalent(talent)}
            />
          ))}
        </div>

        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No talent profiles found matching your search criteria
            </p>
          </div>
        )}
      </div>

      <TalentProfileSheet
        talent={selectedTalent}
        onClose={() => setSelectedTalent(null)}
        onMessage={handleMessage}
      />
    </div>
  );
};

export default TalentDirectory;
