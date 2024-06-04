import { response, request } from "express";
import Benefit from "./benefit.model.js";

export const createBenefit = async (req, res) => {

    try {

        const { nameBenefit, descriptionBenefit, stock, price } = req.body;

        const benefit = new Benefit({ nameBenefit, descriptionBenefit, stock, price });

        const newBenefit = await benefit.save();

        res.status(201).json(newBenefit);
    } catch (error) {

        res.status(500).json({ error: 'Error when created a new benefit' });
    }
}

export const getBenefits = async (req, res) => {

    try {

        const { nameBenefit, price, status } = req.query;

        const filter = {};
        if (nameBenefit) filter.nameBenefit = { $regex: nameBenefit, $option: 'i' };
        if (price) filter.price = { $regex: price, $option: 'i' };
        if (status !== undefined) filter.status = status;

        const benefits = await Benefit.find(filter);

        const total = benefits.length;

        res.status(200).json({ total, benefits })
    } catch (error) {

        res.status(500).json({ error: 'Error getting benefits' })
        console.log(error)
    }
}

export const getBenefitById = async (req, res) => {

    try {

        const { id } = req.params;

        const benefit = await Benefit.findById(id);

        if (!benefit) {

            res.status(404).json({ error: 'Benefit not found' })
        }

        res.status(200).json(benefit)
    } catch (error) {

        res.status(500).json({ error: 'Error getting benefit details' })
    }
}

export const updateBenefit = async (req, res) => {

    try {

        const { id } = req.params;

        const { nameBenefit, descriptionBenefit, stock, price, image } = req.body;

        const updatedFields = { nameBenefit, descriptionBenefit, stock, price, image };

        const updatedBenefit = await Benefit.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedBenefit) {

            return res.status(404).json({ message: 'Benefit not found' });
        }

        res.status(200).json(updatedBenefit);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

export const deleteBenefit = async (req, res) => {

    try {

        const { id } = req.params;

        const benefit = await Benefit.findByIdAndUpdate(id, { status: false });

        res.status(200).json({ msg: 'Benefit has been disable', benefit })
    } catch (error) {

        res.status(500).json({ error: 'Error when deleting benefit' })
    }
}