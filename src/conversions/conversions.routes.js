import { Router } from "express";
import { convertData } from "./conversions.controller.js";

const router = Router()

router.post('/', convertData)

export default router