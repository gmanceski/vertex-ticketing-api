require('dotenv').config();
import * as express from 'express';
import setupRoutes from './routes';
import * as path from 'path';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as boolParser from 'express-query-boolean';

const app: express.Application = express();
const timeout = require('connect-timeout');
function haltOnTimedout(req, res, next){
    if (!req.timedout) next();
}
app.use(timeout('1000s'));
app.use(bodyParser.json());

app.use(boolParser());
app.use(cors());
app.use('/api/tickets', express.static(process.env.FRONTEND_CODE));

/* ROUTES */
const router = express.Router();
setupRoutes(router);
app.use('/api', router);
app.use(haltOnTimedout);

app.listen(process.env.WEB_SERVICE_POR || 3000, () => {
    console.log(`Ticketing server initialized and listening on port ${process.env.WEB_SERVICE_POR || 3000}`);
});
