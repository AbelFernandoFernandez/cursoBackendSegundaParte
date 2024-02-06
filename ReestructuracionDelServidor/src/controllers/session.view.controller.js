export const getLoginViewController = async(req, res) => {
    res.render('sessions/login')
}

export const getRegisterViewController = async(req, res) => {
    res.render('sessions/register')
}

export const getProfileViewController = async(req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).send("No se pudo autenticar al usuario.");
    }
    res.render('sessions/profile',  user );
}