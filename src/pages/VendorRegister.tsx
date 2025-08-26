import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Truck, 
  Upload, 
  FileText,
  Camera,
  Store,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const vendorRegistrationSchema = z.object({
  // Basic Information
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select a business type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  email: z.string().email("Please enter a valid email"),
  website: z.string().url().optional().or(z.literal("")),
  
  // Address Information
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  landmark: z.string().optional(),
  area: z.string().min(2, "Area is required"),
  
  // Business Details
  establishedYear: z.coerce.number().min(1900).max(new Date().getFullYear()).optional(),
  employeeCount: z.coerce.number().min(1).max(1000).optional(),
  deliveryAvailable: z.boolean().default(false),
  deliveryRadius: z.coerce.number().min(1).max(100).optional(),
  
  // Legal Information
  businessLicense: z.string().optional(),
  gstNumber: z.string().optional(),
});

type VendorRegistrationForm = z.infer<typeof vendorRegistrationSchema>;

const businessTypes = [
  "Religious Articles & Accessories",
  "Traditional Handicrafts",
  "Spiritual Books & Literature",
  "Pooja Items & Supplies",
  "Traditional Clothing & Textiles",
  "Ayurvedic & Herbal Products",
  "Temple Jewelry",
  "Incense & Aromatics",
  "Sacred Idols & Sculptures",
  "Traditional Sweets & Prasadam",
  "Other"
];

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function VendorRegister() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("basic");
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{
    url: string;
    type: string;
    file: File;
  }>>([]);

  const form = useForm<VendorRegistrationForm>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      businessType: "",
      deliveryAvailable: false,
      email: user?.email || "",
    },
  });

  const uploadImage = async (file: File, type: string) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${type}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vendor-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vendor-images')
        .getPublicUrl(fileName);

      setUploadedImages(prev => [...prev, { url: data.publicUrl, type, file }]);
      
      toast({
        title: "Image uploaded successfully",
        description: `${type} image has been uploaded.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: VendorRegistrationForm) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register as a vendor.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      // Insert vendor data
      const vendorData = {
        user_id: user.id,
        shop_name: data.shopName,
        business_type: data.businessType,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website: data.website || null,
        street_address: data.streetAddress,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        country: 'India',
        landmark: data.landmark || null,
        area: data.area,
        established_year: data.establishedYear || null,
        employee_count: data.employeeCount || null,
        delivery_available: data.deliveryAvailable,
        delivery_radius: data.deliveryRadius || null,
        business_license: data.businessLicense || null,
        gst_number: data.gstNumber || null,
      };

      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert(vendorData)
        .select()
        .single();

      if (vendorError) throw vendorError;

      // Insert uploaded images
      if (uploadedImages.length > 0 && vendor) {
        const imageData = uploadedImages.map((img, index) => ({
          vendor_id: vendor.id,
          image_url: img.url,
          image_type: img.type,
          display_order: index,
        }));

        const { error: imageError } = await supabase
          .from('vendor_images')
          .insert(imageData);

        if (imageError) throw imageError;
      }

      toast({
        title: "Registration successful!",
        description: "Your vendor application has been submitted for review.",
      });

      navigate("/");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextTab = () => {
    const tabs = ["basic", "address", "business", "images"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ["basic", "address", "business", "images"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              Please log in to register as a vendor
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Become a TTD Vendor
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our marketplace and reach thousands of devotees looking for authentic spiritual products and services.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Images
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Tell us about your shop and business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your shop name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your business, products, and what makes you unique..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 10 characters. Tell potential customers about your business.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="shop@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Address & Location
                    </CardTitle>
                    <CardDescription>
                      Where is your shop located?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your complete street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area/Locality *</FormLabel>
                            <FormControl>
                              <Input placeholder="Area or locality name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nearby Landmark</FormLabel>
                            <FormControl>
                              <Input placeholder="Famous landmark nearby" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="City name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Business Details
                    </CardTitle>
                    <CardDescription>
                      Additional information about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="establishedYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Established Year</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="2020" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employeeCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Employees</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Delivery Options
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="deliveryAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                We offer delivery services
                              </FormLabel>
                              <FormDescription>
                                Check this if you can deliver products to customers
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("deliveryAvailable") && (
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="deliveryRadius"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Radius (km)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="10" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Maximum distance you can deliver (in kilometers)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Legal Information (Optional)
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessLicense"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business License Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter license number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gstNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter GST number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Shop Images & Documents
                    </CardTitle>
                    <CardDescription>
                      Upload images of your shop and products to build trust with customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { type: "shop_front", label: "Shop Front", description: "Exterior view of your shop" },
                        { type: "interior", label: "Shop Interior", description: "Inside view of your shop" },
                        { type: "product", label: "Product Samples", description: "Some of your best products" },
                        { type: "certificate", label: "Certificates", description: "Business licenses or certifications" },
                      ].map((imageType) => (
                        <div key={imageType.type} className="border border-border rounded-lg p-4">
                          <h4 className="font-semibold text-sm mb-2">{imageType.label}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{imageType.description}</p>
                          
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  uploadImage(file, imageType.type);
                                }
                              }}
                              disabled={uploading}
                            />
                            
                            {uploadedImages.filter(img => img.type === imageType.type).map((img, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                {img.file.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Guidelines
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use high-quality images (minimum 800x600 pixels)</li>
                        <li>• Accepted formats: JPG, PNG, WEBP</li>
                        <li>• Maximum file size: 5MB per image</li>
                        <li>• Upload at least shop front and interior images</li>
                        <li>• Clear, well-lit photos work best</li>
                      </ul>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Ready to Submit</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your application will be reviewed within 2-3 business days. 
                            You'll receive an email once approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevTab}
                disabled={currentTab === "basic"}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentTab !== "images" ? (
                <Button
                  type="button"
                  onClick={nextTab}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex items-center gap-2"
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <Footer />
    </div>
  );
}