import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Admin from "./admin.model.js";

export const postAdmin = async (req, res) => {
    const { email, password } = req.body;
    const admin = new Admin({ email, password });

    try {
        const salt = bcryptjs.genSaltSync();
        admin.password = bcryptjs.hashSync(password, salt);

        await admin.save();

        res.status(201).json({
            admin
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getAdmin = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        const [total, admins] = await Promise.all([
            Admin.countDocuments(query),
            Admin.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            admins
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


export const getAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findOne({ _id: id });

        res.status(200).json({
            admin
        });
    } catch (error) {
        console.error('Error fetching admin by ID:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


export const getAdminEmail = async (req, res) => {
    const { correo } = req.params; 

    try {
        const admin = await Admin.findOne({ email: correo }); 

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json({
            role: admin.role,
            idAdmin: admin._id
        });
    } catch (error) {
        console.error('Error fetching Admin by email:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


export const putAdmin = async (req, res = response) => {
    const { id } = req.params;
    const { password, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: 'Updated Admin!!',
            admin: updatedAdmin
        });
    } catch (error) {
        console.error('Error updating Admin:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            msg: 'Admin successfully removed',
            admin,
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};