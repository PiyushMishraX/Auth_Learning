import userModel from "../models/user.model"
import crypto from "crypto" // inbuilt in the nodejs similar t bcrypt used for encryption etc

async function register(req, res) {

    const { username, email, password} = req.body

    const isAlreadtRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(isAlreadtRegistered){
        res.status.json(409).json({
            message: "Username or email already exists"
        })
    }

    //  creating password hash // crypto
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex") 
    //  it performs a SHA-256 cryptographic hash on the provided password string and returns the result as a hexadecimal string. // sha-256 is algorithm creating hash of a fixed-length ( 256 bit is current standard )

    
}
