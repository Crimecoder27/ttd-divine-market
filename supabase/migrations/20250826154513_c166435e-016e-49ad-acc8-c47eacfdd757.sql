-- Create vendors table for shop registration
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  
  -- Address fields
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  
  -- Location details
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  landmark TEXT,
  area TEXT,
  
  -- Business details
  established_year INTEGER,
  employee_count INTEGER,
  business_hours JSONB, -- Store opening/closing times for each day
  delivery_available BOOLEAN DEFAULT false,
  delivery_radius INTEGER, -- in kilometers
  
  -- Verification and status
  is_verified BOOLEAN DEFAULT false,
  verification_document_url TEXT,
  business_license TEXT,
  gst_number TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Create vendor images table for shop photos
CREATE TABLE public.vendor_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('shop_front', 'interior', 'product', 'certificate', 'other')),
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for vendors
CREATE POLICY "Users can view all verified vendors" 
ON public.vendors 
FOR SELECT 
USING (is_verified = true);

CREATE POLICY "Users can create their own vendor profile" 
ON public.vendors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor profile" 
ON public.vendors 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for vendor images
CREATE POLICY "Anyone can view images of verified vendors"
ON public.vendor_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_images.vendor_id 
    AND vendors.is_verified = true
  )
);

CREATE POLICY "Vendors can manage their own images"
ON public.vendor_images
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_images.vendor_id 
    AND vendors.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_images.vendor_id 
    AND vendors.user_id = auth.uid()
  )
);

-- Create storage bucket for vendor images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-images', 'vendor-images', true);

-- Storage policies for vendor images
CREATE POLICY "Authenticated users can upload vendor images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-images');

CREATE POLICY "Vendor images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vendor-images');

CREATE POLICY "Users can update their own vendor images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-images');

CREATE POLICY "Users can delete their own vendor images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-images');

-- Create trigger for updating timestamps
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();