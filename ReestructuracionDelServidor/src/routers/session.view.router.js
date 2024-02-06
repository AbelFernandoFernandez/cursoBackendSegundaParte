import { Router } from "express";
import passport from "passport";
import { getLoginViewController, getRegisterViewController, getProfileViewController } from "../controllers/session.view.controller.js";

const router = Router()

router.get('/', getLoginViewController)

router.get('/register', getRegisterViewController)

router.get('/profile', passport.authenticate('current', { session: false }), getProfileViewController)

export default router