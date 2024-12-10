import { Response } from "express";
import { Controller, Get, Res } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller() 
export class AppController {
    constructor(private readonly appService:AppService) {}

    @Get()
    getView(@Res() res:Response) {
        // this should be rendered views/index.hbs file on the browser, also pass the data
        return res.render('index', this.appService.geData());
    }
}