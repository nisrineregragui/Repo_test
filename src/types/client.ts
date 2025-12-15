export interface Client {
    clientID: string;
    typeClient: string;
    nomContact: string;
    prenomContact?: string;
    numTelephone: string;
    email?: string;
    adresse?: string;
    ville?: string;
    nomMagasinPartenaire?: string;
}

export interface UserDto {
    NomUtilisateur: string;
    MotDePasse: string;
    Role: string;
}

export interface UserLoginDto {
    NomUtilisateur: string;
    MotDePasse: string;
}

export interface UserResponseDto {
    UtilisateurID: string;
    NomUtilisateur: string;
    Role: string;
}
