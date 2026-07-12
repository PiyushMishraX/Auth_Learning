import userModel from "../models/user.model.js"
import crypto from "crypto" // inbuilt in the nodejs similar t bcrypt used for encryption etc
import jwt from "jsonwebtoken"  // need jwt secret to decrypt the token to verify if it is genrate by our server or not
import config from "../config/config.js"
import sessionModel from "../models/session.model.js"

// export async function register(req, res) {

//     const { username, email, password} = req.body

//     const isAlreadtRegistered = await userModel.findOne({
//         $or: [
//             { username },
//             { email }
//         ]
//     })

//     if(isAlreadtRegistered){
//         res.status(409).json({
//             message: "Username or email already exists"
//         })
//     }

//     //  creating password hash // crypto
//     const hashedPassword = crypto.createHash("sha256").update(password).digest("hex") 
//     //  it performs a SHA-256 cryptographic hash on the provided password string and returns the result as a hexadecimal string. // sha-256 is algorithm creating hash of a fixed-length ( 256 bit is current standard )

//     const user = await userModel.create({
//         username,
//         email,
//         password: hashedPassword
//     })
//     // till this line the user data is saved in databse 
//     // now server will send token to user // using ( jsonwebtoken )


//     const token = jwt.sign({
//         id: user._id,
//     }, config.JWT_SECRET, 
//         {
//             // expiresIn: "1h"
//             expiresIn: "1d" // even one day is considered too lnog for a token to expire
//         }
//     )
//     // 201 when some resource is server side ( db value ) is created after user request
//     res.status(201).json({
//         message: "User registered successfully",
//         user: {
//             username: user.username,
//             email: user.email,
//         },
//         token
//     })
    

    
// }

// export async function getMe(req, res) {
//     const token = req.headers.authorization.split(" ")[ 1 ]

//     if(!token){
//         return res.status(401).json({
//             message: "Unauthorized"
//         })
//     }

//     const decoded = jwt.verify(token, config.JWT_SECRET) // have the decoded data from the token
//     // console.log(decoded);

//     const user = await userModel.findById(decoded.id)
//     // console.log(user);

//     res.status(200).json({
//         message: "User featched successfully",
//         user:{
//             username: user.username,
//             email: user.email
//         }
//     })
    
    
// }



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

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex") 


    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    
    const refreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, 
        {
            expiresIn: "7d" 
        }
    )

    // first refreshToken then session then accessToken

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers[ "user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id, // if session id is needed afterwards it can be used 
    }, config.JWT_SECRET, 
        {
            expiresIn: "15m" 
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,// client side js can not read the cookies data
        secure:true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 6 * 1000 // 7 days
    })

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        // token: accessToken
        accessToken
    })
    

    
}

export async function login(req, res){
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(401).json({
            message: "invalid email or password"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    const isPasswordValid = hashedPassword === user.password

    if(!isPasswordValid){
        return res.status(401).json({
            message: "invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, 
        {
            expiresIn: "7d"
        }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers[ "user-agent" ]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, 
        {
            expiresIn: "15m"
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        accessToken,
    })

            

}

export async function getMe(req, res) {
    const token = req.headers.authorization.split(" ")[ 1 ]

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) 
    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "User featched successfully",
        user:{
            username: user.username,
            email: user.email
        }
    })
    
    
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            message: "refresh token not found"
        })
    }

    // if refresh token found than genrate new access token
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false // the accessToken generation only happen when the session is not revoked else the accessToken won't be generated
    })

    if(!session){ // runs the refreshToken not exists or the session is revoked ( revoke is true / logout)
        return res.status(401).json({
            message: "Invalid refresh token"
        })

    }

    // it better to send more details of user other than id in the token - this will be good practice
    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, 
       {
        expiresIn: "15m"
       }
    )

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, 
        {
            expiresIn: "7d"
        } 
    )

    const newRefreshTokenHash = crypto.createHash("sha256").update("newRefreshToken").digest("hex")

    session.refreshTokenHash = newRefreshToken
    await session.save()

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken // send so it can be stored and used
    })
}

export async function logout(req, res) {

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke: false
    })

    if(!session){
        return res.status(400).json({
            message: "Invalid refresh token"
        })
    }

    session.revoked = true
    await session.save()

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "Logged out successfully"
    })
    
}

export async function logoutAll(req, res) {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        user: decoded._id, // find all session of that use with revoke false and set them true
        revoked:false
    }, { 
        revoked: true
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "Logged out from all devices successfully"
    })
    
}