export class CUser {
    FirmaID: string;
    TaskTimID: number;
    MagacinID: number;
    TaskTimOznaka: string;
    Ime: string;
}

export enum Roles {
    SuperAdmin,
    Admin,
    PartnerAdmin,
    PartnerUser
}
