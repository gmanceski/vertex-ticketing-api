export class CUser {
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
