const prisma = require("../prisma/client")
const bcrypt = require('bcrypt')
const jwt=require("jsonwebtoken")

const register=async (req,res) => {
    try {
        const {name,email,password}=req.body
        const userExists = await prisma.user.findUnique({
            where:{email}
        })

        if(userExists){
            return res.status(400).json({
                message:"user already exists"
            })
        }

        const hashedPassword =await bcrypt.hash(password,10)
        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        })
        const {password:pass,...safeUser}=user

        res.status(201).json({
            message:"user created",
            user:safeUser
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const login=async (req,res) => {
    try {
        const {email,password}=req.body
        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        const {password:pass,...safeUser}=user

        res.status(200).json({
            message:"Login successful",
            token,
            user:safeUser
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

module.exports={register,login}