import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../data/models/user.model.js';
import { hashPassword } from '../utils.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

//Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const exists = await User.findOne( { email });
        if (exists) return res.status(400).json({ message: 'Email ya registrado' });

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        res.json( { status: 'success', user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login de usuario
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || 'Error de login' });

        const payload = { id: user._id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        res.json({ status: 'success', message: 'Login exitoso' });
    }) (req, res, next);
});

// Ruta current

router.get('/current',
    passport.authenticate('current', { session: false }),
    (req, res) => {
        res.json({ status: 'success', user: req.user });
    }
);

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ status: 'success', message: 'Sesión cerrada' });
});

export default router;