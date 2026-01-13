exports.createUser = async (req, res) => {
    try {
        const User = global.User;
        const user = await User.findOne({ where: { name: req.body.name } });
        if (user) {
            return res.status(400).json({ message: "already exists" });
        }
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating User' });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const User = global.User;
        const user = await User.findAll();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching User' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const User = global.User;
        const user = await User.findByPk(req.params.id);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error founding User' });
    }
};

exports.UpdateUser = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;
    
    try {
        const User = global.User;
        const user = await User.findByPk(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update(updateData); 
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const User = global.User;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        await user.destroy();
        return res.status(200).json({ message: "Utilisateur supprimé avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting User' });
    }
};