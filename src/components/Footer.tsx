import { Church, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Church className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">BUCU Fellowship</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              A Christ-centered fellowship for all students at Bugema University, 
              committed to transforming lives through worship, discipleship, and service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/forms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Forms & Registration
                </Link>
              </li>
              <li>
                <Link to="/prayer-requests" className="text-muted-foreground hover:text-foreground transition-colors">
                  Prayer Requests
                </Link>
              </li>
              <li>
                <Link to="/tithes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tithes & Offerings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:bucufellowship5@gmail.com" 
                  className="hover:text-foreground transition-colors"
                >
                  bucufellowship5@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a 
                  href="tel:+256700491755" 
                  className="hover:text-foreground transition-colors"
                >
                  +256 700 491 755
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Bugema University, Uganda</span>
              </div>
            </div>
          </div>

          {/* Church Website */}
          <div className="space-y-4">
            <h4 className="font-semibold">Church Website</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a 
                href="https://bucu-fellowship.web.app" 
                className="hover:text-foreground transition-colors"
              >
                bucufellowship.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}