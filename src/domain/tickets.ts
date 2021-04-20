import dbMaster from "../../db/db";
import {getDb} from '../domain/dbManager';
import * as helpers from "../utils/helpers";
import * as csvToJson from 'csvtojson';

const USER_FIELDS = ['FirmaID', 'UserName', 'Active'];

export async function loginUser(UserName: string, Password: string) {

    let findUser = await dbMaster.select(USER_FIELDS).from('tblUser').where({
        UserName,
        Password
    }).andWhere({Active: true}).first();
    if (findUser) {
        const db = getDb(findUser.FirmaID);
        let selectedUser = await db.mk('tblTaskTimClenovi').select('tblTaskTimClenovi.TaskTimID', 'tblRabotnici.Ime', 'tblRabotnici.Prezime', 'tblRabotnici.UserName', 'tblRabotnici.Password', 'tblTaskTim.MagacinID', 'tblTaskTim.TaskTimOpis')
            .join('tblRabotnici', 'tblTaskTimClenovi.RabotnikID', '=', 'tblRabotnici.Sifra')
            .join('tblTaskTim', 'tblTaskTimClenovi.TaskTimID', '=', 'tblTaskTim.TaskTimID')
            .where({UserName: UserName, Password: Password}).first();
        selectedUser.Ime = selectedUser.Ime.trim() + " " + selectedUser.Prezime.trim();
        selectedUser.FirmaID = findUser.FirmaID;
        delete selectedUser.Prezime;
        delete selectedUser.UserName;
        delete selectedUser.Password;
        return selectedUser;
    } else {
        throw new Error("This user is not registered/or active!");
    }
}
