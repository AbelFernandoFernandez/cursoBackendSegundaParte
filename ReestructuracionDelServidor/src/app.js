import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from "passport";
import initializePassport from './config/passport.config.js';
import messageModel from "./dao/models/message.model.js";
import { __dirname } from "./utils.js";
import dotenv from "dotenv";
import appRouter from "./routers/index.js";

dotenv.config()

const hbs = handlebars.create({});

// Define un ayudante personalizado para acceder a propiedades del prototipo
hbs.handlebars.registerHelper('getPrototypeProperty', function(user, propertyName) {
    return user[propertyName];
});


const MONGO_URI = process.env.MONGO_URI
export const PORT = process.env.PORT
const MONGO_DB_NAME = process.env.MONGO_DB_NAME

const app = express();


app.engine('handlebars', handlebars.engine({
    allowProtoPropertiesByDefault: true
}));
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(__dirname+"/public"));

app.use(appRouter)

try{
    await mongoose.connect(MONGO_URI,{
        dbName: MONGO_DB_NAME,
        useUnifiedTopology : true
    })
    const httpServer = app.listen(PORT, ()=> console.log(`Server up on port ${PORT}`)) 

    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log(`New Client Connected`)
        socket.on('productList', (data) => {
            if (data) {
                io.emit('updateProducts', data);
                console.log('Datos enviados al cliente:', data);
            } else {
                console.error('Los datos de productos están vacíos o nulos');
            }
        })
        socket.on('message', async (data) => {
            try {
                const message = new messageModel({
                    user: data.user,
                    message: data.message
                });
        
                await message.save();
                const messages = await messageModel.find()
                io.emit('logs', messages);
            } catch (err) {
                console.error('Error al guardar el mensaje:', err);
            }
        });
        
    })
}catch(err){
    console.log(err.message)
}