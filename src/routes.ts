import {Application, Router} from "express";
import tickets from "./api/tickets";

// import mvnoserver from "./api/mvno-server";

const setupRoutes = (app: Router) => {
    app.use('/tickets', tickets);
};

export default setupRoutes;
