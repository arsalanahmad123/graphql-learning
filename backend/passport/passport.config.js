import passport from "passport";

import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"
import { GraphQLLocalStrategy } from "graphql-passport";


export const configurePassport = async() => {
    passport.serializeUser((user,done) => {
        console.log("Serializing user")
        done(null,user.id)
    })

    passport.deserializeUser(async(id,done) => {
        try {
            console.log("Deserializing user")
            const user = await User.findById(id)
            done(null,user)
        } catch (error) {
            done(error)
        }
    })

    passport.use(new GraphQLLocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({username})
            if(!user){
                throw new Error("Invalid username or password");
            }

            const isValid = await bcrypt.compare(password,user.password)
            if(!isValid){
                throw new Error("Invalid username or password");
            }

            console.log("Signing in user...")

            return done(null,user)

        } catch (error) {
            return done(error);
        }
    }))
}