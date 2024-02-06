import mongoose from "mongoose";

const userCollection = 'users'
const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    age: {type: Number},
    password: {type: String},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "carts"},
    role: {type: String, default: 'user'},
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel