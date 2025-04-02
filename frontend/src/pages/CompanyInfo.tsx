
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Users, Search, Calendar, DollarSign, ShieldCheck, Clock, Zap } from 'lucide-react';

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

const TestimonialCard = ({ quote, author, company }: { quote: string; author: string; company: string }) => (
  <div className="p-6 rounded-lg border">
    <p className="text-lg italic mb-4">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{company}</p>
    </div>
  </div>
);

const CompanyInfo = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Image Overlay */}
        <section className="relative mb-16">
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
            <img 
              src="/lovable-uploads/93952e35-b239-46ce-a26f-1713ccbf6b58.png" 
              alt="Event staff team" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Find Reliable Event Staff in Minutes</h1>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-center">
                Hire pre-vetted event professionals, reduce no-shows, and deliver exceptional events with our staffing platform.
              </p>
              <Link to="/signup">
                <Button size="lg" className="text-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Users className="h-10 w-10 text-accent" />}
              title="Quality Talent"
              description="Access our network of vetted, experienced event staff professionals."
            />
            <BenefitCard 
              icon={<Zap className="h-10 w-10 text-accent" />}
              title="Fast Hiring"
              description="Post a job and get qualified applicants within hours, not days."
            />
            <BenefitCard 
              icon={<ShieldCheck className="h-10 w-10 text-accent" />}
              title="Reliable Service"
              description="Staff with verified ratings, reviews, and work history."
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="space-y-8">
            <StepCard 
              number="1"
              title="Create Your Company Profile"
              description="Showcase your business and the types of events you manage to attract the right talent."
            />
            <StepCard 
              number="2"
              title="Post a Job"
              description="Specify your requirements, shift details, skills needed, and compensation."
            />
            <StepCard 
              number="3"
              title="Review Applicants"
              description="Browse profiles, ratings, and experience of interested staff members."
            />
            <StepCard 
              number="4"
              title="Select Your Team"
              description="Choose the best candidates and confirm their availability."
            />
            <StepCard 
              number="5"
              title="Manage Your Event"
              description="Communicate with your team, share details, and track attendance."
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
              description="For occasional events and small businesses"
              features={[
                "Company profile",
                "First job posting free",
                "Additional job posts at $5 per job",
                "Event staff directory listing",
                "Limited support"
              ]}
              recommended={false}
            />
            <PricingCard
              title="Business"
              price="$299/month"
              description="For growing event companies"
              features={[
                "Everything in Basic",
                "Unlimited job postings",
                "Featured company listing",
                "Talent search",
                "Priority support"
              ]}
              recommended={true}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="We've reduced our staff no-show rate from 15% to under 2% since using this platform. The quality of talent is exceptional."
              author="Sarah Johnson"
              company="Premier Events Co."
            />
            <TestimonialCard
              quote="The time it takes us to staff an event has gone from days to just hours. It's completely transformed our business operations."
              author="Michael Chen"
              company="Urban Experiences"
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-secondary p-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Event Staffing?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of event companies already using our platform to find reliable staff.
          </p>
          <Link to="/signup">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default CompanyInfo;
