import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'psychologist';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user credentials for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  // Students
  'student@example.com': {
    password: 'student123',
    user: {
      id: 's1',
      email: 'student@example.com',
      role: 'student',
      name: 'Student User'
    }
  },
  'jane.student@university.edu': {
    password: 'password123',
    user: {
      id: 's2',
      email: 'jane.student@university.edu',
      role: 'student',
      name: 'Jane Smith'
    }
  },
  // Psychologists
  'dr.smith@samvaad.com': {
    password: 'psychologist123',
    user: {
      id: 'p1',
      email: 'dr.smith@samvaad.com',
      role: 'psychologist',
      name: 'Dr. Sarah Smith'
    }
  },
  'dr.johnson@samvaad.com': {
    password: 'admin123',
    user: {
      id: 'p2',
      email: 'dr.johnson@samvaad.com',
      role: 'psychologist',
      name: 'Dr. Michael Johnson'
    }
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on mount
  useEffect(() => {
    // Initialize demo student records if they don't exist
    const existingStudents = localStorage.getItem('samvaad_students');
    if (!existingStudents) {
      const demoStudents = [
        {
          name: 'Demo Student 1',
          email: 'demo1@university.edu',
          university: 'du',
          studentId: 'DU2024001',
          phone: '9876543210',
          emergencyContact: 'Parent Name',
          emergencyPhone: '9876543211',
          samvaadId: 'STU123456',
          tempPassword: 'demo123',
          registrationDate: new Date().toISOString(),
          isActive: true
        },
        {
          name: 'Demo Student 2',
          email: 'demo2@university.edu',
          university: 'jnu',
          studentId: 'JNU2024002',
          phone: '9876543212',
          emergencyContact: 'Guardian Name',
          emergencyPhone: '9876543213',
          samvaadId: 'STU789012',
          tempPassword: 'demo456',
          registrationDate: new Date().toISOString(),
          isActive: true
        }
      ];
      localStorage.setItem('samvaad_students', JSON.stringify(demoStudents));
    }

    const storedUser = localStorage.getItem('samvaad_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('samvaad_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (role === 'student') {
      // For students, identifier is SAATHI-ID
      const students = JSON.parse(localStorage.getItem('samvaad_students') || '[]');
      const student = students.find((s: any) =>
        s.samvaadId === identifier.toUpperCase() && s.tempPassword === password
      );

      if (student) {
        const user: User = {
          id: student.samvaadId,
          email: student.email,
          role: 'student',
          name: student.name
        };

        setUser(user);
        localStorage.setItem('samvaad_user', JSON.stringify(user));
        setIsLoading(false);
        return true;
      }
    } else if (role === 'psychologist') {
      // For psychologists, identifier is email
      const userCredentials = mockUsers[identifier.toLowerCase()];

      if (userCredentials &&
          userCredentials.password === password &&
          userCredentials.user.role === role) {

        setUser(userCredentials.user);
        localStorage.setItem('samvaad_user', JSON.stringify(userCredentials.user));
        setIsLoading(false);
        return true;
      }
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('samvaad_user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
