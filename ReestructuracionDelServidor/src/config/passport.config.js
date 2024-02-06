import passport from "passport";
import local from 'passport-local';
import passportJWT from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2'
import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { crateHash, isValidPassword, extractCookie, JWT_PRIVATE_KEY, generateToken } from "../utils.js";
import dotenv from "dotenv";

dotenv.config()

const localStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy

const initializePassport = () => {
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField:'email'
    }, async(req, username, password, done) => {
        const{firstName, lastName, email, age } = req.body
        try{
            const user = await userModel.findOne({ email: username})
            if (user) {
                return done(null, false)
            }
            const cartNewUser = await cartModel.create({})
            const newUser = {
                firstName, lastName, email, age, password:crateHash(password), cart: cartNewUser._id,
                role: email === "abel@mail.com" ? "admin" : "user"

            }

            const result = await userModel.create(newUser)
            return done(null, result)

        } catch(err) {
            return done(err)
        }
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async(username, password, done) => {
        try{
            const user = await userModel.findOne({ email: username})
            if (!user) return done(null, false)
            if (!isValidPassword(user, password)) return done(null, false)
            const token = generateToken(user)
            user.token = token
            return done(null, user)
        }catch(err){
            return done(err)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            const user = await userModel.findOne({ email: profile._json.email });
            if (user) {
                return done(null, user);
            }
    
            const newUser = new userModel({
                firstName: profile._json.name,
                lastName: '',
                email: profile._json.email,
                age: '',
                password: ''
            });
    
            await newUser.save(); // Wait for the user to be saved
            return done(null, newUser);
        } catch (err) {
            return done('Error to login with GitHub');
        }
    }));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.use('current', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.user._id)
            if (!user) {
                return done(null, false);
            }
    
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));
    

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport