import userModel from "../models/user.model.js"
import crypto from "crypto" // inbuilt in the nodejs similar t bcrypt used for encryption etc
import jwt from "jsonwebtoken"  // need jwt secret to decrypt the token to verify if it is genrate by our server or not
import config from "../config/config.js"

export async function register(req, res) {

    const { username, email, password} = req.body

    const isAlreadtRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(isAlreadtRegistered){
        res.status(409).json({
            message: "Username or email already exists"
        })
    }

    //  creating password hash // crypto
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex") 
    //  it performs a SHA-256 cryptographic hash on the provided password string and returns the result as a hexadecimal string. // sha-256 is algorithm creating hash of a fixed-length ( 256 bit is current standard )

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })
    // till this line the user data is saved in databse 
    // now server will send token to user // using ( jsonwebtoken )


    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, 
        {
            // expiresIn: "1h"
            expiresIn: "1d" // even one day is considered too lnog for a token to expire
        }
    )
    // 201 when some resource is server side ( db value ) is created after user request
    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        token
    })
    

    
}

export async function getMe(req, res) {
    const token = req.headers.authorization.split(" ")[ 1 ]


    
}