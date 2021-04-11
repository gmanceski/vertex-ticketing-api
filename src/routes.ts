import {Application, Router} from "express";
import user from "./api/ticketing";

// import mvnoserver from "./api/mvno-server";

const setupRoutes = (app: Router) => {
    app.use('/ticketing', user);
};

export default setupRoutes;
