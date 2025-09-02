import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Try to determine the intended role from the current path
    const pathRole = location.pathname.startsWith('/psychologist') ? 'psychologist' : 'student';
    return <Navigate to={`/login/${pathRole}`} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate interface based on user's role
    const redirectPath = user.role === 'student' ? '/student' : '/psychologist';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

// Helper components for specific roles
export const StudentProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['student']}>
    {children}
  </ProtectedRoute>
);

export const PsychologistProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['psychologist']}>
    {children}
  </ProtectedRoute>
);
