import { Heart, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="hero-gradient text-primary-foreground px-3 py-1 rounded-lg font-bold text-lg">
                TTD
              </div>
              <span className="ml-2 text-xl font-bold text-foreground">
                Vendor Marketplace
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting devotees worldwide with authentic TTD products from trusted local vendors. 
              Experience the divine through our carefully curated spiritual marketplace.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span>Made with devotion for spiritual seekers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/shop" className="block text-muted-foreground hover:text-primary transition-smooth">
                Shop All Products
              </a>
              <a href="/categories" className="block text-muted-foreground hover:text-primary transition-smooth">
                Categories
              </a>
              <a href="/vendors" className="block text-muted-foreground hover:text-primary transition-smooth">
                Our Vendors
              </a>
              <a href="/vendor/register" className="block text-muted-foreground hover:text-primary transition-smooth">
                Become a Vendor
              </a>
              <a href="/about" className="block text-muted-foreground hover:text-primary transition-smooth">
                About Us
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-3 text-primary" />
                <span className="text-sm">Tirumala, Tirupati</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-3 text-primary" />
                <span className="text-sm">+91 123 456 7890</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-3 text-primary" />
                <span className="text-sm">info@ttdmarketplace.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 TTD Vendor Marketplace. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
              Terms of Service
            </a>
            <a href="/support" className="text-muted-foreground hover:text-primary transition-smooth">
              Support
            </a>
          </div>
        </div>

        {/* Powered by */}
        <div className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-primary">TTD Vendor Marketplace</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;