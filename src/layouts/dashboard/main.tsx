
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: BoxProps) {
    const theme = useTheme();

    return (
        <Box
            component="main"
            className={layoutClasses.main}
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    );
}
