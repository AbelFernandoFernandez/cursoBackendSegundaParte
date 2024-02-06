import {dirname} from "path";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';
import bcrypy from 'bcrypt';
import dotenv from "dotenv";
import passport from "passport";

dotenv.config()

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
export const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const crateHash = password => bcrypy.hashSync(password, bcrypy.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypy.compareSync(password, user.password)

export const generateToken = (user) => jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })

export const extractCookie = req => (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('erroros/base', { error: 'Debes estar logeado para ver los productos' })
            req.user = user
            next()
        })(req, res, next)
    }
}