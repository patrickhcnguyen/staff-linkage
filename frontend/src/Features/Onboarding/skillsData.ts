export const skillsCategories = [
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
  
  export const skillsList = skillsCategories.flatMap(category => category.skills);
  