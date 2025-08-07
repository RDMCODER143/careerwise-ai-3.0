import { Star, Quote, GraduationCap, Building2 } from "lucide-react";

const TestimonialCard = ({ name, role, company, content, rating, type, delay = 0 }) => {
  return (
    <div 
      className="p-6 bg-card rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-4">
        {type === 'student' ? (
          <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mr-4">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mr-4">
            <Building2 className="w-6 h-6 text-secondary-foreground" />
          </div>
        )}
        <div>
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{role} at {company}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
        ))}
      </div>
      
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-muted-foreground/20" />
        <p className="text-muted-foreground leading-relaxed pl-6">{content}</p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "CareerWise's AI analysis helped me identify gaps in my resume and suggested specific skills to learn. I landed my dream job at Google within 3 months!",
      rating: 5,
      type: "student",
      delay: 0
    },
    {
      name: "Michael Rodriguez",
      role: "HR Director",
      company: "Microsoft",
      content: "The AI screening feature saves us 80% of the time we used to spend on initial candidate reviews. The quality of matches is exceptional.",
      rating: 5,
      type: "employer",
      delay: 200
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "Netflix",
      content: "The personalized career path recommendations were spot-on. CareerWise guided me from marketing to data science with a clear learning roadmap.",
      rating: 5,
      type: "student",
      delay: 400
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            What Our <span className="bg-gradient-hero bg-clip-text text-transparent">Users</span> Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from professionals who've transformed their careers with CareerWise's AI-powered platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 p-6 bg-gradient-card rounded-2xl shadow-card">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gradient-hero rounded-full border-2 border-card"></div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Join 50,000+ professionals</p>
              <p className="text-sm text-muted-foreground">Who trust CareerWise for their career growth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;