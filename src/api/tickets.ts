import {Response, Router} from 'express';
import {UserRequest} from '../model/types';
import * as user from '../domain/tickets';
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
import {getDb} from "../domain/dbManager";

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
    if (!exists) {
        res.status(401).json({success: false, error: "Bad credentials."});
    } else {
        exists.Ime = exists.Ime.trim();
        let token = await helpers.getJwt({
            FirmaID: exists.FirmaID,
            TaskTimID: exists.TaskTimID,
            MagacinID: exists.MagacinID,
            UserName: exists.Ime
        });
        res.json({exists, token});
    }
});

router.get('/task', auth, async (req: UserRequest, res: Response) => {
    const db = getDb(req.user.FirmaID);
    let taskTimID = req.user.TaskTimID;
    let tasks;
    try {
        tasks = await db.mk('tblRabotenNalog')
            .select('DokumentID', 'Broj', 'Datum', 'Izdal', 'Status', 'DatumPocetok', 'DatumZavrsetok', 'PustenOD', 'ZavrsenOD', 'OpisZaRabota', 'PriklucokID', 'OpisNaIzvrsenaRabota', 'PriklucokBroj', 'KDSTipNalog', 'TaskTimID')
            .where({Status: 0, TaskTimID: taskTimID}).orderBy('Datum');
    }catch (e) {
        res.json(e);
    }
    res.json(tasks);
});

router.get('/stocks', auth, async (req: UserRequest, res: Response) => {
    const db = getDb(req.user.FirmaID);
    let magacinID = req.user.MagacinID;
    let stocks;
    try {
        stocks = await db.mk('tblMagacinSintetika').select('tblMagacinSintetika.ProizvodSifra', 'Kolicina as KolicinaNaLager',
            db.tblP+'.dbo.tblProizvod.ProizvodIme', db.tblG+'.dbo.tblProizvod.Edmerka', db.tblP+'.dbo.tblProizvod.SoSeriskiBroevi')
            .join(db.tblP+'.dbo.tblProizvod', 'tblMagacinSintetika.ProizvodSifra', '=', db.tblP+'.dbo.tblProizvod.ProizvodSifra').where({MagacinID: magacinID})
            .andWhere('Kolicina', '>', '0')
            .orderBy(db.tblP+'.dbo.tblProizvod.ProizvodIme');

        let st = await Promise.all(stocks.map(async stock => {
            if (stock.SoSeriskiBroevi) {
                stock.Kolicina = 0;
                stock.serialNo = await db.mk('tblSeriskiBroevi').select("SeriskiBroj", "Prodaden").where({ProizvodSifra: stock.ProizvodSifra, TipNaSklad: 1, SkladID: magacinID, Prodaden: false});
            } else {
                stock.Kolicina = 0;
            }
        }));
        // stocks.forEach(stock => {
        //     stock.Kolicina = 0;
        // });

    } catch (e) {
        res.json(e);
        return;
    }
    res.json(stocks);
});

router.post('/task-done', auth, async (req: UserRequest, res: Response) => {
    const db = getDb(req.user.FirmaID);
    let nalog = req.body;
        try {
        await db.mk('tblRabotenNalog').update({Status: 1, OpisNaIzvrsenaRabota: nalog.OpisNaIzvrsenaRabota}).where({DokumentID: nalog.DokumentID});
    } catch (e) {
        res.json({success: true, message: e});
    }
    res.json({success: true, message: 'Налогот е зачуван.'})
});

export default router;
