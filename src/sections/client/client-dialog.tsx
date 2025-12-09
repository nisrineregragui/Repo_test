import type { Client } from 'src/types/client';

import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ----------------------------------------------------------------------

type ClientDialogProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Client>) => void;
    client?: Client | null;
};

const CLIENT_TYPES = [
    { value: 'Particulier', label: 'Particulier' },
    { value: 'Magasin', label: 'Magasin' },
];

export function ClientDialog({ open, onClose, onSubmit, client }: ClientDialogProps) {
    const [formData, setFormData] = useState<Partial<Client>>({
        typeClient: 'Particulier',
        nomContact: '',
        prenomContact: '',
        numTelephone: '',
        email: '',
        adresse: '',
        ville: '',
        nomMagasinPartenaire: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (client) {
            setFormData(client);
        } else {
            setFormData({
                typeClient: 'Particulier',
                nomContact: '',
                prenomContact: '',
                numTelephone: '',
                email: '',
                adresse: '',
                ville: '',
                nomMagasinPartenaire: '',
            });
        }
        setErrors({});
    }, [client, open]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nomContact) newErrors.nomContact = 'Name is required';
        if (!formData.numTelephone) newErrors.numTelephone = 'Phone is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{client ? 'Edit Client' : 'New Client'}</DialogTitle>

            <DialogContent>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 3, display: 'block' }}>
                    Details
                </Typography>

                <TextField
                    select
                    fullWidth
                    label="Type Client"
                    name="typeClient"
                    value={formData.typeClient}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                >
                    {CLIENT_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    required
                    label="Nom"
                    name="nomContact"
                    value={formData.nomContact || ''}
                    onChange={handleChange}
                    error={!!errors.nomContact}
                    helperText={errors.nomContact}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    label="Prénom"
                    name="prenomContact"
                    value={formData.prenomContact || ''}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    required
                    label="Téléphone"
                    name="numTelephone"
                    value={formData.numTelephone || ''}
                    onChange={handleChange}
                    error={!!errors.numTelephone}
                    helperText={errors.numTelephone}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    label="Adresse"
                    name="adresse"
                    value={formData.adresse || ''}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    label="Ville"
                    name="ville"
                    value={formData.ville || ''}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="inherit">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
