import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import axios from "axios"
import apiService from "@/services/AxiosInstence"
import { jwtDecode } from "jwt-decode"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    
    console.log('User data:', auth.user);
    if (auth.user) {
      navigate('/dashboard')
    }
  }, [auth.user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Making actual API call to backend
      const response = await apiService.post('/auth/login', { username, password }) as { status:number, msg:string , token: string , user: { firstName: string, lastName: string } };
      console.log('Login response:', response);
      
      if(!response.token) {
        console.error('No token found in response'); 
      }
      else{
      const userData = { username, token: response.token, firstName: response.user.firstName , lastName: response.user.lastName };
      console.log('Logged User data:', userData);
      
      const decodeData = jwtDecode(response.token);
      console.log('Decoded token data:', decodeData);
      
      auth.login(userData);
      

      
      const Swal = (await import('sweetalert2')).default
      
      Swal.fire({
        title: 'Success!',
        text: 'You have successfully logged in',
        icon: 'success',
        confirmButtonText: 'Continue to Dashboard',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to dashboard or home page
          window.location.href = '/dashboard'
        }
      })
      
      // Reset form
      setUsername("")
      setPassword("")
    }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Failed to log in. Please check your credentials.';
      
      if (axios.isAxiosError(error) && error.response) {
        // Extract error message from the response
        errorMessage = error.response.data.message || errorMessage;
        setError(errorMessage);
      }
      
      // Import SweetAlert dynamically for error
      const Swal = (await import('sweetalert2')).default
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        timer: 5000,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
        timerProgressBar: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}