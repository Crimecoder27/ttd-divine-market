import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  vendor: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isAuthentic?: boolean;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  category,
  vendor,
  rating,
  reviews,
  inStock,
  isAuthentic = true
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    // Here you would typically dispatch to cart context or call cart API
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-elegant transition-smooth border border-border overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isAuthentic && (
            <Badge className="bg-primary text-primary-foreground">
              TTD Authentic
            </Badge>
          )}
          {originalPrice && originalPrice > price && (
            <Badge variant="secondary" className="bg-destructive text-destructive-foreground">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 hover:bg-background transition-smooth ${
            isLiked ? "text-destructive" : "text-muted-foreground"
          }`}
          onClick={handleToggleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        {/* Quick Add to Cart */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            {isAddingToCart ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>

        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-smooth">
          {name}
        </h3>

        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-1 mb-2">
          {renderStars(rating)}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          by <span className="font-medium text-primary">{vendor}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {!inStock && (
            <Badge variant="outline" className="text-destructive border-destructive">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || isAddingToCart}
          className="w-full"
          variant={inStock ? "default" : "outline"}
        >
          {isAddingToCart ? (
            "Adding to Cart..."
          ) : inStock ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          ) : (
            "Notify When Available"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;