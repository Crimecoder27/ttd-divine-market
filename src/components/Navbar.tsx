import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  Heart, 
  Bell, 
  LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3); // Sample cart count
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-background border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <div className="hero-gradient text-primary-foreground px-3 py-1 rounded-lg font-bold text-lg group-hover:scale-105 transition-bounce">
              TTD
            </div>
            <span className="ml-2 text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
              Vendor Marketplace
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate("/")}
              className="text-foreground hover:text-primary transition-smooth relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate("/shop")}
              className="text-foreground hover:text-primary transition-smooth relative group"
            >
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate("/categories")}
              className="text-foreground hover:text-primary transition-smooth relative group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate("/vendors")}
              className="text-foreground hover:text-primary transition-smooth relative group"
            >
              Vendors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-muted rounded-lg px-3 py-2 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search TTD authentic products..."
              className="bg-transparent border-none outline-none flex-1 text-sm"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative hover-float">
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative hover-float">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-1 min-w-5 h-5">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative hover-float group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:animate-bounce" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs pulse-glow">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome back!
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="hover-float"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/login")}
                className="hover-float"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}

            <Button 
              onClick={() => navigate("/vendor/register")}
              className="hidden sm:flex hover-float"
            >
              Become a Vendor
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover-float"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => { navigate("/"); setIsMenuOpen(false); }}
                className="text-left text-foreground hover:text-primary transition-smooth hover:translate-x-2"
              >
                Home
              </button>
              <button 
                onClick={() => { navigate("/shop"); setIsMenuOpen(false); }}
                className="text-left text-foreground hover:text-primary transition-smooth hover:translate-x-2"
              >
                Shop
              </button>
              <button 
                onClick={() => { navigate("/categories"); setIsMenuOpen(false); }}
                className="text-left text-foreground hover:text-primary transition-smooth hover:translate-x-2"
              >
                Categories
              </button>
              <button 
                onClick={() => { navigate("/vendors"); setIsMenuOpen(false); }}
                className="text-left text-foreground hover:text-primary transition-smooth hover:translate-x-2"
              >
                Vendors
              </button>
              <div className="flex items-center bg-muted rounded-lg px-3 py-2 hover:bg-muted/80 transition-smooth">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none flex-1 text-sm"
                />
              </div>
              <Button 
                onClick={() => { navigate("/vendor/register"); setIsMenuOpen(false); }}
                className="w-full hover-float"
              >
                Become a Vendor
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;