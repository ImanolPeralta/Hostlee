import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../data/models/user.model.js';
import { verifyPassword } from '../utils.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Login con email + password
passport.use('local', new localStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });

            const isValid = verifyPassword(password, user.password);
            if(!isValid) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Extractor de cookie
const cookieExtractor = (req) => {
    if (req && req.cookies) {
        return req.cookies['token'] || null;
    }
};

// Estrategia JWT (current user)
passport.use('current', new JwtStrategy(
    {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET
    },
    async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }
));

export default passport;