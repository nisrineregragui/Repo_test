import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { _workspaces } from 'src/_mock';

import { Main } from './main'; // Re-trigger resolution
import { Header } from './header';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
    sx?: SxProps<Theme>;
    children: React.ReactNode;
    header?: {
        sx?: SxProps<Theme>;
    };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
    const [navOpen, setNavOpen] = useState(false);

    const layoutQuery: Breakpoint = 'lg';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', [layoutQuery]: 'row' },
                ...sx,
            }}
        >
            <NavMobile
                data={navData}
                open={navOpen}
                onClose={() => setNavOpen(false)}
                workspaces={_workspaces}
            />

            <NavDesktop
                data={navData}
                layoutQuery={layoutQuery}
                workspaces={_workspaces}
            />

            <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
                <Header onOpenNav={() => setNavOpen(true)} />
                <Main>{children}</Main>
            </Box>
        </Box>
    );
}
