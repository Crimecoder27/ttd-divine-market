import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Grid, List } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Sample product data
const sampleProducts = [
  {
    id: "1",
    name: "Sacred Rudraksha Mala",
    description: "Authentic 108 bead Rudraksha mala for meditation and spiritual practice",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    category: "Devotional Items",
    vendor: "Divine Beads Co.",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isAuthentic: true
  },
  {
    id: "2",
    name: "Tirupati Laddu (Box of 12)",
    description: "Fresh and authentic Tirupati laddus directly from TTD kitchen",
    price: 450,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    category: "Prasadam",
    vendor: "TTD Official Store",
    rating: 5.0,
    reviews: 89,
    inStock: true,
    isAuthentic: true
  },
  {
    id: "3",
    name: "Brass Temple Bell",
    description: "Handcrafted brass temple bell with beautiful engravings",
    price: 899,
    originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1609845205347-67c1b9e9d3e7?w=400",
    category: "Handicrafts",
    vendor: "Traditional Crafts",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    isAuthentic: true
  },
  {
    id: "4",
    name: "Silk Dhoti with Gold Border",
    description: "Premium silk dhoti with traditional gold border work",
    price: 2499,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400",
    category: "Clothing",
    vendor: "Silk Heritage",
    rating: 4.7,
    reviews: 43,
    inStock: false,
    isAuthentic: true
  },
  {
    id: "5",
    name: "Miniature Venkateswara Idol",
    description: "Beautiful miniature idol of Lord Venkateswara in brass",
    price: 1599,
    image: "https://images.unsplash.com/photo-1597131922203-9e9e8f6fbf3e?w=400",
    category: "Souvenirs",
    vendor: "Divine Idols",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    isAuthentic: true
  },
  {
    id: "6",
    name: "Sandalwood Incense Sticks",
    description: "Pure sandalwood incense sticks for prayer and meditation",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1571580402230-8ab4f8c1bbab?w=400",
    category: "Devotional Items",
    vendor: "Mysore Sandalwood",
    rating: 4.6,
    reviews: 201,
    inStock: true,
    isAuthentic: true
  }
];

const categories = ["All", "Devotional Items", "Prasadam", "Handicrafts", "Clothing", "Souvenirs"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" }
];

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseInt(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-ttd-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            TTD Authentic Products
          </h1>
          <p className="text-muted-foreground">
            Discover sacred items, prasadam, handicrafts and more from trusted TTD vendors
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded transition-smooth ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setPriceRange({ min: "", max: "" });
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {sortedProducts.length} of {sampleProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setPriceRange({ min: "", max: "" });
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;