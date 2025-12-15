import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from '../context/auth-context';

// ----------------------------------------------------------------------

type AuthGuardProps = {
    children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
    const { loading, authenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !authenticated) {
            router.push('/sign-in'); // Adjust path if needed
        }
    }, [authenticated, loading, router]);

    if (loading) {
        return null; // Or a loading spinner
    }

    if (!authenticated) {
        return null;
    }

    return <>{children}</>;
}
