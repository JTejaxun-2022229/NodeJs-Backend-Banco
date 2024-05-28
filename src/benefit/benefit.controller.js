import { response, request } from "express";
import Benefit from "./benefit.routes.js";

export const createBenefit = async (req, res) => {

    try {

        const { nameBenefit, descriptionBenefit, stock, price } = req.body;

        const benefit = new Benefit({ nameBenefit, descriptionBenefit, stock, price });

        const newBenefit = await benefit.save();

        res.status(201).json(newBenefit);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
}