import {Response, Router} from 'express';
import {UserRequest} from '../model/types';
import * as user from '../domain/ticketing';
import * as helpers from '../utils/helpers';
import {auth, validatePrivilegies} from '../utils/helpers';
import {CUser, Roles} from "../model/class";
import to from "await-to-js";
import {check, validationResult} from 'express-validator';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import moment = require("moment");
import * as express from 'express';
import db from "../../db/db";

const app: express.Application = express();

app.use('/api/menuimages', express.static(process.env.REPOSITORY_FOOD_IMAGES));

const router = Router();
// router.use(fileUpload());

router.post('/login', [check('UserName').notEmpty(), check('Password').notEmpty()], async (req: UserRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const [err, exists]: [any, CUser] = await to(user.loginUser(req.body.UserName, req.body.Password));
    if (err) {
        res.status(500).json(err);
        return;
    }
    exists.Ime = exists.Ime.trim();
    if (!exists) {
        res.status(401).json({success: false, error: "Bad credentials."});
    } else {
        let token = await helpers.getJwt({
            TaskTimID: exists.TaskTimID,
            MagacinID: exists.MagacinID,
            UserName: exists.Ime
        });
        res.json({exists, token});
    }
});

router.get('/task', auth, async (req: UserRequest, res: Response) => {
    let taskTimID = req.user.TaskTimID;
    let tasks;
    try {
        tasks = await db('tblRabotenNalog')
            .select('DokumentID', 'Broj', 'Datum', 'Izdal', 'Status', 'DatumPocetok', 'DatumZavrsetok', 'PustenOD', 'ZavrsenOD', 'OpisZaRabota', 'PriklucokID', 'OpisNaIzvrsenaRabota', 'PriklucokBroj', 'KDSTipNalog', 'TaskTimID')
            .where({Status: 0, TaskTimID: taskTimID}).orderBy('Datum');
    }catch (e) {
        res.json(e);
    }
    res.json(tasks);
});

router.get('/stock', auth, async (req: UserRequest, res: Response) => {
    let magacinID = req.user.MagacinID;
    let stock;
    try {
        stock = await db('tblMagacinSintetika').select('tblMagacinSintetika.ProizvodSifra', 'Kolicina', 'dboXEnterpriseKDS2013.dbo.tblProizvod.ProizvodIme', 'dboXEnterpriseKDS2013.dbo.tblProizvod.Edmerka')
            .join('dboXEnterpriseKDS2013.dbo.tblProizvod', 'tblMagacinSintetika.ProizvodSifra', '=', 'dboXEnterpriseKDS2013.dbo.tblProizvod.ProizvodSifra').where({MagacinID: magacinID})
            .andWhere('Kolicina', '>', '0')
            .orderBy('dboXEnterpriseKDS2013.dbo.tblProizvod.ProizvodIme');
    } catch (e) {
        res.json(e);
    }
    res.json(stock);
});

router.post('/task-done', auth, async (req: UserRequest, res: Response) => {
    let nalog = req.body;
        try {
        await db('tblRabotenNalog').update({Status: 1, OpisNaIzvrsenaRabota: nalog.OpisNaIzvrsenaRabota}).where({DokumentID: nalog.DokumentID});
    } catch (e) {
        res.json({success: true, message: e});
    }
    res.json({success: true, message: 'Налогот е зачуван.'})
});


export default router;
