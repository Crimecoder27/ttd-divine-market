import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Users, Shield, Star, Truck, Heart, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-marketplace.jpg";

// Sample featured products
const featuredProducts = [
  {
    id: "1",
    name: "Sacred Rudraksha Mala",
    description: "Authentic 108 bead Rudraksha mala for meditation",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    category: "Devotional Items",
    vendor: "Divine Beads Co.",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: "2",
    name: "Tirupati Laddu (Box of 12)",
    description: "Fresh authentic Tirupati laddus from TTD",
    price: 450,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    category: "Prasadam",
    vendor: "TTD Official Store",
    rating: 5.0,
    reviews: 89,
    inStock: true,
  },
  {
    id: "3",
    name: "Brass Temple Bell",
    description: "Handcrafted brass temple bell with engravings",
    price: 899,
    originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1609845205347-67c1b9e9d3e7?w=400",
    category: "Handicrafts",
    vendor: "Traditional Crafts",
    rating: 4.5,
    reviews: 67,
    inStock: true,
  },
];

const categories = [
  { name: "Devotional Items", icon: "🪔", count: "150+" },
  { name: "Prasadam", icon: "🍯", count: "50+" },
  { name: "Handicrafts", icon: "🎨", count: "200+" },
  { name: "Clothing", icon: "👘", count: "80+" },
  { name: "Souvenirs", icon: "🏺", count: "120+" },
];

const stats = [
  { icon: Users, label: "Trusted Vendors", value: "500+" },
  { icon: ShoppingBag, label: "Products", value: "10,000+" },
  { icon: Star, label: "Customer Rating", value: "4.9/5" },
  { icon: Truck, label: "Orders Delivered", value: "50,000+" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="TTD Marketplace" 
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center text-white">
            <Badge className="mb-6 bg-primary text-primary-foreground animate-fade-in">
              TTD Authentic Products
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-slide-up stagger-1">
              Divine Shopping
              <br />
              <span className="hero-gradient bg-clip-text text-transparent">
                Sacred Experience
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up stagger-2">
              Connect with authentic TTD vendors and discover sacred products, 
              blessed prasadam, and spiritual treasures from Tirumala
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in stagger-3">
              <Button 
                size="lg" 
                onClick={() => navigate("/shop")}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover-float pulse-glow"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/vendor/register")}
                className="bg-white/10 border-white text-white hover:bg-white hover:text-foreground hover-float"
              >
                Become a Vendor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-ttd-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4 hover:scale-110 transition-bounce pulse-glow">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
              Explore our diverse collection of authentic TTD products across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-elegant transition-smooth border border-border hover-glow animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate("/shop")}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-bounce">{category.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
                Featured Products
              </h2>
              <p className="text-muted-foreground animate-slide-up stagger-1">
                Handpicked authentic products from our trusted vendors
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/shop")}
              className="hidden sm:flex hover-float animate-fade-in stagger-2"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:hidden">
            <Button onClick={() => navigate("/shop")} className="hover-float animate-fade-in stagger-4">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
              Why Choose TTD Marketplace?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
              Experience the divine through our carefully curated marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-bounce-in stagger-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-6 group-hover:shadow-glow transition-smooth hover:scale-110 transition-bounce">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">TTD Authentic</h3>
              <p className="text-muted-foreground">
                Every product is verified and authenticated by TTD standards, ensuring spiritual purity and quality.
              </p>
            </div>
            
            <div className="text-center group animate-bounce-in stagger-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full mb-6 group-hover:shadow-glow transition-smooth hover:scale-110 transition-bounce">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Made with Devotion</h3>
              <p className="text-muted-foreground">
                Our vendors craft each item with love and devotion, bringing you closer to the divine.
              </p>
            </div>
            
            <div className="text-center group animate-bounce-in stagger-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full mb-6 group-hover:shadow-glow transition-smooth hover:scale-110 transition-bounce">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Trusted Community</h3>
              <p className="text-muted-foreground">
                Join thousands of devotees who trust our marketplace for their spiritual needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
            Ready to Start Your Spiritual Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 animate-slide-up stagger-1">
            Join our marketplace and discover authentic spiritual products from trusted TTD vendors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in stagger-2">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/shop")}
              className="bg-white text-primary hover:bg-white/90 hover-float"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/vendor/register")}
              className="border-white text-white hover:bg-white hover:text-primary hover-float"
            >
              Become a Vendor
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
