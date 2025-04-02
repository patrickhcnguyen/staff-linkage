import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Calendar, DollarSign, Clock, Award, Shield } from 'lucide-react';

const StaffInfo = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Image Overlay */}
        <section className="relative mb-16">
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
            <img 
              src="/lovable-uploads/1fdb622d-4c0a-40b0-9ce0-8ede2d046de5.png" 
              alt="Event staff team" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Join Our Network of Event Staff Professionals</h1>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-center">
                Find flexible event work opportunities, connect with top companies, and build your career in the events industry.
              </p>
              <Link to="/signup">
                <Button size="lg" className="text-lg">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Join As Staff?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Calendar className="h-10 w-10 text-accent" />}
              title="Flexible Work"
              description="Choose when and where you work. Set your own schedule and availability."
            />
            <BenefitCard 
              icon={<DollarSign className="h-10 w-10 text-accent" />}
              title="Competitive Pay"
              description="Get paid what you're worth with transparent job listings and rates."
            />
            <BenefitCard 
              icon={<Star className="h-10 w-10 text-accent" />}
              title="Build Your Profile"
              description="Showcase your experience and earn reviews to stand out to employers."
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="space-y-8">
            <StepCard 
              number="1"
              title="Create Your Profile"
              description="Showcase your skills, experience, and availability to attract the right opportunities."
            />
            <StepCard 
              number="2"
              title="Browse Available Jobs"
              description="Search and filter jobs based on location, date, pay rate, and event type."
            />
            <StepCard 
              number="3"
              title="Apply With One Click"
              description="Express interest in opportunities with a simple application process."
            />
            <StepCard 
              number="4"
              title="Get Hired & Work"
              description="Receive job offers, confirm details, and work events on your schedule."
            />
            <StepCard 
              number="5"
              title="Build Your Reputation"
              description="Earn reviews and build your profile to qualify for more exclusive opportunities."
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Pricing Plans</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <PricingCard
              title="Basic"
              price="Free"
              description="Perfect for occasional event work"
              features={[
                "Create a profile",
                "Unlimited job applications",
                "All search filters",
                "Job alerts"
              ]}
              recommended={false}
            />
            <PricingCard
              title="Professional"
              price="$9.99/month"
              description="For full-fledged professionals"
              features={[
                "Everything in Basic",
                "Priority application visibility",
                "Featured profile listing",
                "Advanced search filters",
                "Premium support"
              ]}
              recommended={true}
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-secondary p-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Event Job?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of event professionals connecting with top companies.
          </p>
          <Link to="/signup">
            <Button size="lg" className="mr-4">Sign Up Now</Button>
          </Link>
          <Link to="/event-staff-directory">
            <Button variant="outline" size="lg">Browse Companies</Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

// Supporting Components
const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex items-start gap-4 p-6 rounded-lg border">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features,
  recommended
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[];
  recommended: boolean;
}) => (
  <Card className={`flex flex-col ${recommended ? 'border-accent shadow-lg' : ''}`}>
    {recommended && (
      <div className="bg-accent text-white py-1 px-4 text-sm font-medium text-center">
        Most Popular
      </div>
    )}
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="text-3xl font-bold mb-6">{price}</div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Link to="/signup" className="w-full">
        <Button variant={recommended ? "default" : "outline"} className="w-full">
          Sign Up
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default StaffInfo;
