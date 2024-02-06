import { JWT_COOKIE_NAME } from "../utils.js";

export const registerController = async(req, res) => {
    res.redirect('/')
}

export const failRegisterController = (req, res) => res.send({ error: 'Passport register Failed'})

export const loginController = async(req, res) => {
    if(!req.user){
        return res.status(400).send({ status:'error', error:'Invalid credentials'})
    }

    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
}

export const failLoginController = (req, res) => res.send({ error: 'Passport login Failed'})

export const logoutController = (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME).redirect('/');
}

export const githubController = (reqe, res) => {}

export const githubCallBackController = async( req, res) => {
    console.log('Callback: ', req.user )
    req.session.user = req.user
    res.redirect('/products')
}