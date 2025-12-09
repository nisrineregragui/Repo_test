import type { Client } from 'src/types/client';

export async function getClients(params: {
    typeClient?: string;
    ville?: string;
    search?: string;
    email?: string;
} = {}): Promise<Client[]> {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`https://localhost:7163/api/Client?${query}`);
    if (!response.ok) {
        throw new Error('Failed to fetch clients');
    }
    return response.json();
}

export async function createClient(data: Partial<Client>): Promise<Client> {
    const response = await fetch('https://localhost:7163/api/Client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create client: ${errorBody}`);
    }

    return response.json();
}

export async function updateClient(id: string, data: Partial<Client>): Promise<void> {
    const response = await fetch(`https://localhost:7163/api/Client/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update client: ${errorBody}`);
    }
}

export async function deleteClient(id: string): Promise<void> {
    const response = await fetch(`https://localhost:7163/api/Client/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to delete client: ${errorBody}`);
    }
}
