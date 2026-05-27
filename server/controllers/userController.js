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
                username: true,
                email:true,
                profilePic:true,
                status:true,
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
        const { search } = req.query;
        let whereClause = {
            id: { not: req.user.id }
        };

        if (search && search.trim() !== "") {
            whereClause.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }

        const user = await prisma.user.findMany({
            where: whereClause,
            select:{
                id:true,
                name:true,
                username: true,
                email:true,
                profilePic:true,
                status:true
            }
        })

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, username, profilePic, status } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "Username is required" });
        }

        // Sanitize username
        const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, "");

        // Validate alphanumeric/underscore username structure
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
            return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
        }

        // Check uniqueness of username among other users
        const userWithSameUsername = await prisma.user.findFirst({
            where: {
                username: cleanUsername,
                id: {
                    not: req.user.id
                }
            }
        });

        if (userWithSameUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                name: name.trim(),
                username: cleanUsername,
                profilePic,
                status: status || "Available"
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                profilePic: true,
                status: true,
                createdAt: true
            }
        });

        // Broadcast profile update event via socket
        const io = req.app.get("io");
        if (io) {
            io.emit("userProfileUpdated", updatedUser);
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports={getProfile,getUsers,updateProfile}