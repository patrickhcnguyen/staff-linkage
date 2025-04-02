
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Award, 
  CheckCircle, 
  Search, 
  Clock, 
  Shield,
  Briefcase
} from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We're on a mission to transform how event staff and event companies connect,
          creating a seamless platform that benefits both sides of the event industry.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4">
              Founded by industry veterans who experienced the challenges of event staffing firsthand,
              our platform was built to solve the persistent problems in connecting qualified staff with
              quality event opportunities.
            </p>
            <p>
              We identified that event companies struggled to find reliable staff while talented event professionals
              had difficulty finding consistent work that matched their skills and availability. Our platform bridges
              this gap, creating value for the entire industry.
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
              We're dedicated to elevating the event industry by connecting the right talent with the right 
              opportunities at the right time.
            </p>
            <p>
              We believe that when event professionals thrive, events excel. Our platform creates 
              transparency, efficiency, and reliability for both staff and companies, resulting in 
              better events and more satisfied clients.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="text-primary" /> For Event Staff
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Create a professional profile showcasing your experience, skills, and certifications</span>
              </li>
              <li className="flex gap-3">
                <Search className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Browse and apply to event opportunities that match your skills and availability</span>
              </li>
              <li className="flex gap-3">
                <Calendar className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Manage your schedule and track upcoming bookings in one place</span>
              </li>
              <li className="flex gap-3">
                <MessageSquare className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Communicate directly with event companies through our secure messaging system</span>
              </li>
              <li className="flex gap-3">
                <Award className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Build your reputation with reviews and achievements that boost your profile</span>
              </li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="text-primary" /> For Event Companies
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Create a company profile to showcase your events and company culture</span>
              </li>
              <li className="flex gap-3">
                <Search className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Post job opportunities and find qualified staff quickly and efficiently</span>
              </li>
              <li className="flex gap-3">
                <Users className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Browse our talent directory to find the perfect staff for your events</span>
              </li>
              <li className="flex gap-3">
                <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Simplify scheduling and staff management for all your events</span>
              </li>
              <li className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                <span>Verify credentials and review work history before making hiring decisions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="bg-muted rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Our Platform</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-5 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">Quality Connections</h3>
            <p>We focus on meaningful matches between staff and companies, not just quantity.</p>
          </div>
          
          <div className="bg-card p-5 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">Transparent Process</h3>
            <p>Clear communication, expectations, and reviews for all parties involved.</p>
          </div>
          
          <div className="bg-card p-5 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">Industry Expertise</h3>
            <p>Built by event professionals who understand the unique challenges of the industry.</p>
          </div>
          
          <div className="bg-card p-5 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">Versatile Opportunities</h3>
            <p>From corporate events to festivals, weddings to conferences, we cover it all.</p>
          </div>
          
          <div className="bg-card p-5 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">Career Growth</h3>
            <p>Staff can build their profiles, gain experience, and advance their event careers.</p>
          </div>
          
          <div className="bg-card p-5 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">Reliable Talent</h3>
            <p>Companies can find pre-vetted, qualified staff with verified experience.</p>
          </div>
        </div>
      </section>
      
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join our growing community of event professionals and companies creating exceptional events together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="btn bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90">
            Sign Up Today
          </Link>
          <Link to="/event-staff-directory" className="btn bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-medium hover:bg-secondary/90">
            Browse Companies
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
