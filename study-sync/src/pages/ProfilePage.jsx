import React, { useState } from 'react';
import { User, Book, Mail, Phone, MapPin, Building, Target, Clock, Users, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const domains = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Programming',
  'Data Structures and Algorithms',
  'Digital Logic Design',
  'Signals and Systems',
  'Thermodynamics',
  'Machine Learning',
  'Control Systems',
  'Fluid Mechanics',
  'Embedded Systems',
  'Electronics and Circuits',
  'Other'
];

const programmingLanguages = ['C', 'C++', 'Python', 'Java', 'JavaScript', 'Ruby', 'Go', 'Other'];

const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    year: '',
    major: '',
    primaryDomain: '',
    otherDomain: '',
    programmingLanguages: [],
    otherProgrammingLanguage: '',
    interests: '',
    goals: '',
    preferredStudyTime: '',
    groupPreference: '',
    bio: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, avatarUrl }),
      });

      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-0 right-0"
            onClick={() => document.getElementById('avatar-upload').click()}
          >
            Edit
          </Button>
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          className="h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>University</Label>
          <Input
            value={formData.university}
            onChange={(e) => handleChange('university', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Year of Study</Label>
          <Select
            value={formData.year}
            onValueChange={(value) => handleChange('year', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">First Year</SelectItem>
              <SelectItem value="2">Second Year</SelectItem>
              <SelectItem value="3">Third Year</SelectItem>
              <SelectItem value="4">Fourth Year</SelectItem>
              <SelectItem value="5">Fifth Year</SelectItem>
              <SelectItem value="postgrad">Postgraduate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Primary Domain</Label>
        <Select
          value={formData.primaryDomain}
          onValueChange={(value) => handleChange('primaryDomain', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map(domain => (
              <SelectItem key={domain} value={domain}>{domain}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.primaryDomain === 'Programming' && (
        <div className="space-y-4">
          <Label>Programming Languages</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programmingLanguages.map(language => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={formData.programmingLanguages.includes(language)}
                  onCheckedChange={(checked) => {
                    const languages = checked
                      ? [...formData.programmingLanguages, language]
                      : formData.programmingLanguages.filter(lang => lang !== language);
                    handleChange('programmingLanguages', languages);
                  }}
                />
                <label htmlFor={language}>{language}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Preferred Study Time</Label>
        <Select
          value={formData.preferredStudyTime}
          onValueChange={(value) => handleChange('preferredStudyTime', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select preferred time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
            <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
            <SelectItem value="evening">Evening (5 PM - 10 PM)</SelectItem>
            <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Group Size Preference</Label>
        <Select
          value={formData.groupPreference}
          onValueChange={(value) => handleChange('groupPreference', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select group size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (2-3 people)</SelectItem>
            <SelectItem value="medium">Medium (4-6 people)</SelectItem>
            <SelectItem value="large">Large (7+ people)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Academic Goals</Label>
        <Textarea
          value={formData.goals}
          onChange={(e) => handleChange('goals', e.target.value)}
          placeholder="What are your main academic goals?"
          className="h-24"
        />
      </div>

      <div className="space-y-2">
        <Label>Interests & Hobbies</Label>
        <Textarea
          value={formData.interests}
          onChange={(e) => handleChange('interests', e.target.value)}
          placeholder="Share your interests and hobbies"
          className="h-24"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="border-none shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">Let's help you find the perfect study partners</p>
          </CardHeader>

          <CardContent>
            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`flex items-center ${stepNumber !== 3 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber !== 3 && (
                      <div
                        className={`h-1 flex-1 ${
                          step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Personal Info</span>
                <span>Academic Details</span>
                <span>Preferences</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    className="ml-auto"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;