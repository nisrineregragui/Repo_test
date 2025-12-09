import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { _workspaces } from 'src/_mock';

import { Main } from './main'; // Re-trigger resolution
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
    const theme = useTheme();

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

            <Main>{children}</Main>
        </Box>
    );
}
