import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Eye, EyeOff } from 'lucide-react'; 
import apiService from '@/services/AxiosInstence';

// Define types for the form data and errors
interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  terms: string;
  auth: string;
}

interface TouchedFields {
  username: boolean;
  password: boolean;
  confirmPassword: boolean;
  firstName: boolean;
  lastName: boolean;
}

type SignupFormProps = React.HTMLAttributes<HTMLDivElement>

export function SignupForm({ className, ...props }: SignupFormProps) {
  const navigate = useNavigate(); 
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false
  });
  
  // Validation states
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    terms: '',
    auth: ''
  });
  
  const [touched, setTouched] = useState<TouchedFields>({
    username: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false
  });
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    
    if (!touched[id as keyof TouchedFields] && id !== 'agreeToTerms') {
      setTouched(prev => ({
        ...prev,
        [id as keyof TouchedFields]: true
      }));
    }
  };

  // Validate username - updated to require at least 8 characters
  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    if (username.length < 8) return 'Username must be at least 8 characters long';
    if (!/^[a-zA-Z0-9]+$/.test(username)) return 'Username must be alphanumeric';
    return '';
  };

  // Validate first name
  const validateFirstName = (firstName: string): string => {
    if (!firstName) return 'First name is required';
    if (firstName.length < 3) return 'First name must be at least 3 characters long';
    return '';
  };

  // Validate last name
  const validateLastName = (lastName: string): string => {
    if (!lastName) return 'Last name is required';
    if (lastName.length < 3) return 'Last name must be at least 3 characters long';
    return '';
  };

  // Calculate password strength and validate - updated to match backend requirement
  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    
    let strength = 0;
    let feedback = '';
    
    // Check for minimum length
    if (password.length >= 6) strength += 25;
    else feedback = 'Password must be at least 6 characters long';
    
    // Check for lowercase letter
    if (/[a-z]/.test(password)) strength += 25;
    else feedback = feedback || 'Password should contain at least one lowercase letter';
    
    // Check for uppercase letter
    if (/[A-Z]/.test(password)) strength += 25;
    else feedback = feedback || 'Password should contain at least one uppercase letter';
    
    // Check for special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    else feedback = feedback || 'Password should contain at least one special character';
    
    setPasswordStrength(strength);
    return feedback;
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  // Validate all fields on submit
  const validateForm = (): boolean => {
    const usernameError = validateUsername(formData.username);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    const firstNameError = validateFirstName(formData.firstName);
    const lastNameError = validateLastName(formData.lastName);
    const termsError = !formData.agreeToTerms ? 'You must agree to the terms and conditions' : '';
    
    setErrors({
      username: usernameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      firstName: firstNameError,
      lastName: lastNameError,
      terms: termsError,
      auth: ''
    });
    
    return !(usernameError || passwordError || confirmPasswordError || firstNameError || lastNameError || termsError);
  };

  // Run validation on input change if the field has been touched
  useEffect(() => {
    if (touched.username) {
      setErrors(prev => ({
        ...prev,
        username: validateUsername(formData.username)
      }));
    }
    
    if (touched.password) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(formData.password)
      }));
    }
    
    if (touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
      }));
    }

    if (touched.firstName) {
      setErrors(prev => ({
        ...prev,
        firstName: validateFirstName(formData.firstName)
      }));
    }

    if (touched.lastName) {
      setErrors(prev => ({
        ...prev,
        lastName: validateLastName(formData.lastName)
      }));
    }
  }, [formData, touched]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid) {
      try {
        // Make API call to register user using Axios
          apiService.post('/auth/register', {
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          });
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Your account has been created successfully. Redirecting to login page...',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          navigate('/login');
        });
      } catch (error) {
        let errorMessage = 'An error occurred while creating your account';
        
        if (axios.isAxiosError(error) && error.response) {
          // Extract error message from the response
          errorMessage = error.response.data.message || errorMessage;
        }
        
        setErrors(prev => ({
          ...prev,
          auth: errorMessage
        }));
        
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  // Get strength color for password indicator
  const getStrengthColor = (): string => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get strength label
  const getStrengthLabel = (): string => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Username field */}
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                  className={errors.username ? "border-red-500" : ""}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              
              {/* First Name field */}
              <div className="grid gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
                  className={errors.firstName ? "border-red-500" : ""}
                  required
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              
              {/* Last Name field */}
              <div className="grid gap-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                  className={errors.lastName ? "border-red-500" : ""}
                  required
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
              
              {/* Password field */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    required 
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {touched.password && formData.password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Progress value={passwordStrength} className={cn("h-2", getStrengthColor())} />
                      <span className="text-xs ml-2">{getStrengthLabel()}</span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              {/* Confirm Password field */}
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    required 
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Terms Agreement */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreeToTerms" 
                  checked={formData.agreeToTerms}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setFormData(prev => ({ ...prev, agreeToTerms: checked }))
                  }}
                />
                <Label htmlFor="agreeToTerms" className="text-sm font-normal">
                  I agree to the{" "}
                  <a href="#" className="underline underline-offset-4">
                    terms of service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline underline-offset-4">
                    privacy policy
                  </a>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-500 -mt-4">{errors.terms}</p>
              )}
              
              {/* Error message */}
              {errors.auth && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.auth}</AlertDescription>
                </Alert>
              )}
              
              {/* Submit button */}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;