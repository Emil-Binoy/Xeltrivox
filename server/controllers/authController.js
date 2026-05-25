const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body; // Added username

    // Sanitize input to lowercase so 'Emil' and 'emil' are treated the same
    const cleanUsername = username.toLowerCase().trim();

    // Check if email or username is already taken
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: cleanUsername }],
      },
    });

    if (userExists) {
      const isEmailTaken = userExists.email === email;
      return res.status(400).json({
        message: isEmailTaken
          ? "Email is already registered"
          : "Username is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username: cleanUsername,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { password: pass, ...safeUser } = user;

    res.status(201).json({
      message: "user created",
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Changed 'email' to 'identifier'

    // Look up the user by either email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier.toLowerCase().trim() },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { password: pass, ...safeUser } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
