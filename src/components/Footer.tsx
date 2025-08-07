import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold">CareerWise</span>
            </div>
            <p className="text-background/70 leading-relaxed mb-6">
              AI-powered career guidance platform helping students and employers 
              connect through intelligent matching and personalized insights.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-background/70 hover:text-background transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-background/70 hover:text-background transition-colors">How It Works</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Success Stories</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">About Us</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Careers</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Blog</a></li>
                  <li><a href="#contact" className="text-background/70 hover:text-background transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-background/70 mb-4">
              Get the latest career insights and platform updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button className="bg-gradient-hero hover:opacity-90 px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2024 CareerWise. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-background/60 text-sm">
              <Mail className="w-4 h-4" />
              <span>support@careerwise.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;