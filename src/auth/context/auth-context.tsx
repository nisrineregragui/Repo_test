import type { UserLoginDto, UserResponseDto } from 'src/types/client';

import { useContext, createContext } from 'react';

// ----------------------------------------------------------------------

export type AuthContextType = {
    user: UserResponseDto | null;
    loading: boolean;
    authenticated: boolean;
    login: (data: UserLoginDto) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
