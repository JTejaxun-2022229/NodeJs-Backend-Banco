import { response, request } from "express";
import Favorite from "./favorite.model.js";

export const postFavorite = async (req, res) => {
    const { idUser, noAccount, DPI, alias } = req.body;
    const favorite = new Favorite({ idUser, noAccount, DPI, alias });

    try {
        await favorite.save();

        res.status(201).json({
            favorite
        });
    } catch (error) {
        console.error('Error creating favorite:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getFavorites = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        const [total, favorites] = await Promise.all([
            Favorite.countDocuments(query),
            Favorite.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            favorites
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getFavoriteById = async (req, res) => {
    const { id } = req.params;

    try {
        const favorite = await Favorite.findOne({ _id: id });

        res.status(200).json({
            favorite
        });
    } catch (error) {
        console.error('Error fetching favorite by ID:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getFavoriteByDPI = async (req, res) => {
    const { DPI } = req.params;

    try {
        const favorite = await Favorite.findOne({ DPI });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json({
            favorite
        });
    } catch (error) {
        console.error('Error fetching favorite by DPI:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const putFavorite = async (req, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const updatedFavorite = await Favorite.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: 'Updated favorite!',
            favorite: updatedFavorite
        });
    } catch (error) {
        console.error('Error updating favorite:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteFavorite = async (req, res) => {
    const { id } = req.params;

    try {
        const favorite = await Favorite.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            msg: 'Favorite successfully removed',
            favorite,
        });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};