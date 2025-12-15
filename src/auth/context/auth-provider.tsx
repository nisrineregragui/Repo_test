import type { UserLoginDto, UserResponseDto } from 'src/types/client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { setSession, isValidToken } from 'src/services/auth-service';

import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize state from local storage
    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken);
                    // Ideally fetching user profile here if the token doesn't contain all info
                    // const user = await getUser(accessToken);
                    // setUser(user);

                    // For now, parsing from token or keeping it simple if token has payload
                    // Assuming we stored user in localStorage or decode it
                    // Minimal: Just marked as authenticated. 
                    // To do it properly: decode token or fetch /me
                    // Let's decode or fetch.
                    // Assuming we can't easily fetch without new endpoint, let's decode.
                    const payload = JSON.parse(atob(accessToken.split('.')[1]));
                    setUser({
                        UtilisateurID: payload.sub,
                        NomUtilisateur: payload.username,
                        Role: payload.role
                    });

                } else {
                    setSession(null);
                }
            } catch (error) {
                console.error(error);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    const login = useCallback(async (data: UserLoginDto) => {
        const { login: serviceLogin } = await import('src/services/auth-service');
        const { user: newUser } = await serviceLogin(data);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        setSession(null);
        setUser(null);
    }, []);

    const authenticated = !!user;

    const value = useMemo(
        () => ({
            user,
            loading,
            authenticated,
            login,
            logout,
        }),
        [user, loading, authenticated, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
