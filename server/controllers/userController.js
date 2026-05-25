const prisma=require("../prisma/client")

const getProfile=async(req,res)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            },
            select:{
                id:true,
                name:true,
                email:true,
                profilePic:true,
                createdAt:true
            }
        })

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const getUsers=async(req,res)=>{
    try {
        const user = await prisma.user.findMany({
            where:{
                id:{
                    not:req.user.id
                }
            },
            select:{
                id:true,
                name:true,
                email:true,
                profilePic:true
            }
        })

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports={getProfile,getUsers}