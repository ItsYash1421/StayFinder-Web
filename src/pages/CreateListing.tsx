import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { listingsAPI } from '../api/api';
import { uploadMultipleImages } from '../utils/imageUpload';

const AMENITY_SUGGESTIONS = [
  'WiFi', 'Air Conditioning', 'Heating', 'Kitchen', 'Washer', 'Dryer',
  'TV', 'Pool', 'Gym', 'Parking', 'Elevator', 'Security', 'Doorman',
  'Pets Allowed', 'Smoking Allowed', 'Wheelchair Accessible'
];

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    images: [] as File[],
    pricePerNight: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [] as string[],
    availableStart: '',
    availableEnd: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    const requiredFields = ['title', 'description', 'address', 'city', 'state', 'country', 'pricePerNight', 'bedrooms', 'bathrooms', 'maxGuests', 'availableStart', 'availableEnd'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Numeric fields
    const numericFields = ['pricePerNight', 'bedrooms', 'bathrooms', 'maxGuests'];
    numericFields.forEach(field => {
      const value = Number(formData[field as keyof typeof formData]);
      if (isNaN(value) || value <= 0) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`;
      }
    });

    // Date validation
    if (formData.availableStart && formData.availableEnd) {
      const startDate = new Date(formData.availableStart);
      const endDate = new Date(formData.availableEnd);
      if (startDate >= endDate) {
        newErrors.availableEnd = 'End date must be after start date';
      }
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: files }));
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Update preview URLs
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
  };

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    handleInputChange('amenities', newAmenities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload images first
      const imageUrls = await uploadMultipleImages(formData.images);

      // Create listing with uploaded image URLs
      const listingData = {
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          coordinates: {
            type: 'Point',
            coordinates: [0, 0] // Default coordinates, will be updated by geocoding
          }
        },
        price: Number(formData.pricePerNight),
        pricePerNight: Number(formData.pricePerNight),
        type: 'apartment', // Default type
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        maxGuests: Number(formData.maxGuests),
        images: imageUrls,
        amenities: formData.amenities,
        availableFrom: formData.availableStart,
        availableDates: [{
          start: formData.availableStart,
          end: formData.availableEnd || formData.availableStart // If no end date, use start date
        }]
      };

      await listingsAPI.createListing(listingData);
      showToast('Listing created successfully', 'success');
      navigate('/host/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create listing';
      setErrors(prev => ({ ...prev, submit: errorMessage }));
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Listing</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.state ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => handleInputChange('country', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.country ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Images</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
              </div>
            </div>

            {/* Pricing and Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Pricing and Details</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Night *</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={formData.pricePerNight}
                      onChange={e => handleInputChange('pricePerNight', e.target.value)}
                      className={`block w-full pl-7 pr-12 rounded-md ${
                        errors.pricePerNight ? 'border-red-300' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  {errors.pricePerNight && <p className="mt-1 text-sm text-red-600">{errors.pricePerNight}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms *</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={e => handleInputChange('bedrooms', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.bedrooms ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms *</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={e => handleInputChange('bathrooms', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.bathrooms ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Guests *</label>
                  <input
                    type="number"
                    value={formData.maxGuests}
                    onChange={e => handleInputChange('maxGuests', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.maxGuests ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.maxGuests && <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p>}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Availability</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available From *</label>
                  <input
                    type="date"
                    value={formData.availableStart}
                    onChange={e => handleInputChange('availableStart', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.availableStart ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.availableStart && <p className="mt-1 text-sm text-red-600">{errors.availableStart}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available To *</label>
                  <input
                    type="date"
                    value={formData.availableEnd}
                    onChange={e => handleInputChange('availableEnd', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.availableEnd ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                  {errors.availableEnd && <p className="mt-1 text-sm text-red-600">{errors.availableEnd}</p>}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {AMENITY_SUGGESTIONS.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing; 