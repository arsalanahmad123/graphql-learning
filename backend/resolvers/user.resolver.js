import { users } from '../dummyData/data.js';
import {User} from '../models/user.model.js'
import bcrypt from "bcryptjs"

const userResolver = {
    Mutation: {
        signUp: async(_, {input}, context) => {
            try {
                const {username,name,password,gender} = input;
                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required");
                }

                const existingUser = await User.findOne({username});
                if (existingUser) {
                    throw new Error('User already exists');
                };

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password,salt);

                const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePicture : girlProfilePicture
                });


                await newUser.save();
                await context.login(newUser);

                return newUser

            } catch (error) {
                console.error("Error in signUp",err)
                throw new Error(error.message || "Internal server error");
            }
        },

        sigIn: async(_, {input}, context) => {
            try {
                const {username,password} = input;
                const {user} = await context.authenticate('graphql-local', {username,password});

                await context.login(user);

                return user;

            } catch (error) {
                
            }
        },

        logOut: async(_,__,context) => {
            try {
                await context.logout();
                req.session.destroy((err) => {
                    if (err) throw err;
                })

                res.clearCookie('connect.sid');
                return {message: "Logout successfully"};

            } catch (error) {
                console.error("Error in logOut",err)
                throw new Error(error.message || "Internal server error");
            }
        }

    },
    Query: {

        currentUser: async(_,__,context) => {
          try {
            
            const user = await context.getUser();
            return user;
          } catch (error) {
            console.error("Error in authUser",err)
            throw new Error(error.message || "Internal server error");
          }  
        },
        users: async(_,_,context) => {
            const users = await User.find().lean();
            return users
        },
        user: async(_,{userID}) => {
            try {
                const user = await User.findById(userID).lean();
                if(!user){
                    throw new Error("User not found");
                }
                return user;
            } catch (error) {
                console.error("Error in user",err)
                throw new Error(error.message || "Internal server error");
            }
        },
        
    },
}

export default userResolver;