-- Create products table for vendor products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- For discounts
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  specifications JSONB, -- Store product specs as JSON
  tags TEXT[], -- Array of tags for search
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  weight DECIMAL(8, 3), -- in kg
  dimensions JSONB, -- {length, width, height} in cm
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(vendor_id, sku)
);

-- Create product images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "Anyone can view active products of verified vendors"
ON public.products
FOR SELECT
USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = products.vendor_id 
    AND vendors.is_verified = true
  )
);

CREATE POLICY "Vendors can manage their own products"
ON public.products
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = products.vendor_id 
    AND vendors.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = products.vendor_id 
    AND vendors.user_id = auth.uid()
  )
);

-- RLS policies for product images
CREATE POLICY "Anyone can view images of active products"
ON public.product_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    JOIN public.vendors ON vendors.id = products.vendor_id
    WHERE products.id = product_images.product_id 
    AND products.is_active = true
    AND vendors.is_verified = true
  )
);

CREATE POLICY "Vendors can manage their own product images"
ON public.product_images
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    JOIN public.vendors ON vendors.id = products.vendor_id
    WHERE products.id = product_images.product_id 
    AND vendors.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products 
    JOIN public.vendors ON vendors.id = products.vendor_id
    WHERE products.id = product_images.product_id 
    AND vendors.user_id = auth.uid()
  )
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Product images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Users can update their own product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Users can delete their own product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Create trigger for updating timestamps
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();