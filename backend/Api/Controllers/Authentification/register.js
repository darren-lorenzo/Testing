const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const User = global.User;
        if (!User) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing email or password" });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "This user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        return res.status(201).json({
            message: "User created",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
