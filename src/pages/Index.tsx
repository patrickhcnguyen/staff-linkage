
import { Link } from 'react-router-dom';
import { User, Briefcase, MessageSquare, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Connect with Top Event Staff
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              The premier platform for event staffing agencies and professionals to connect, collaborate, and create exceptional events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary text-lg">
                Get Started
              </Link>
              <Link to="/event-staff-directory" className="btn btn-secondary text-lg">
                Event Staff Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<User className="w-8 h-8 text-accent" />}
              title="Professional Profiles"
              description="Create detailed profiles showcasing your experience and certifications."
            />
            <FeatureCard
              icon={<Briefcase className="w-8 h-8 text-accent" />}
              title="Job Listings"
              description="Post and find event staffing opportunities in your area."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-accent" />}
              title="Direct Messaging"
              description="Communicate seamlessly with agencies and staff members."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-accent" />}
              title="Availability Management"
              description="Manage your schedule and availability in real-time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Event Staffing?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of professionals and agencies already using our platform.
            </p>
            <Link to="/signup" className="btn bg-accent text-white hover:opacity-90 text-lg">
              Join Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="card p-6 animate-slide-up">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;

