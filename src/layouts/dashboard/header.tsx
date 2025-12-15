import { Stack, useTheme } from '@mui/material';

import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type HeaderProps = {
    onOpenNav: () => void;
};

export function Header({ onOpenNav }: HeaderProps) {
    const theme = useTheme();

    return (
        <HeaderSection
            slotProps={{
                container: { maxWidth: false },
            }}
            sx={{
                '& .MuiContainer-root': {
                    px: { xs: 2.5, lg: 5 },
                },
            }}
            slots={{
                leftArea: (
                    <>
                        <MenuButton
                            onClick={onOpenNav}
                            sx={{
                                mr: 1,
                                ml: -1,
                                [theme.breakpoints.up('lg')]: {
                                    display: 'none',
                                },
                            }}
                        />
                        <Searchbar />
                    </>
                ),
                rightArea: (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <NotificationsPopover />
                        <AccountPopover />
                    </Stack>
                ),
            }}
        />
    );
}
