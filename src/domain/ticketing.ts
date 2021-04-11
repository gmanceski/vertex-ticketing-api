import db from "../../db/db";
import * as helpers from "../utils/helpers";
import * as csvToJson from 'csvtojson';

export async function loginUser(UserName: string, Password: string) {
    let selectedUser =  await db.select('tblTaskTimClenovi.TaskTimID', 'tblRabotnici.Ime', 'tblRabotnici.Prezime', 'tblRabotnici.UserName', 'tblRabotnici.Password', 'tblTaskTim.MagacinID', 'tblTaskTim.TaskTimOpis')
        .from('tblTaskTimClenovi')
        .join('tblRabotnici', 'tblTaskTimClenovi.RabotnikID', '=', 'tblRabotnici.Sifra')
        .join('tblTaskTim', 'tblTaskTimClenovi.TaskTimID', '=', 'tblTaskTim.TaskTimID')
        .where({UserName: UserName, Password: Password}).first();
    selectedUser.Ime = selectedUser.Ime.trim() + " " + selectedUser.Prezime.trim();
    delete selectedUser.Prezime;
    delete selectedUser.UserName;
    delete selectedUser.Password;
    return selectedUser;
}
