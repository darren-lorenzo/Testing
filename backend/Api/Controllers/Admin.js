exports.createAdmin = async (req, res) => {
    try {
        const Admin = global.Admins
        const adminUser = await Admin.findOne({ where: { name: req.body.name } });
        if (adminUser) {
            return res.status(400).json({ message: "already exists" });
        }
        const newAdmin = await Admin.create(req.body);
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Admin' });
    }
};

exports.getAllAdmin = async (req, res) => {
    try {
        const Admin = global.Admins
        const adminUser = await Admin.findAll();
        res.status(200).json(adminUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Admin' });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const Admin = global.Admins
        const adminUser = await Admin.findByPk(req.params.id);
        res.status(201).json(adminUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error founding Admin' });
    }
};

exports.UpdateAdmin = async (req, res) => {
    const adminUserId = req.params.id;
    const updateData = req.body;
    
    try {
        const Admin = global.Admins
        const adminUser = await Admin.findByPk(adminUserId); 
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await adminUser.update(updateData); 
        res.status(200).json({ message: 'Admin updated successfully', adminUser });
    } catch (error) {
        console.error('Error updating adminUser:', error);
        res.status(500).json({ message: 'Error updating adminUser', error: error.message });
    }
};


exports.deleteAdmin = async (req, res) => {
    try {
        const Admin = global.Admins
        const adminUser = await Admin.findByPk(req.params.id);
        if (!adminUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        await adminUser.destroy();
        return res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Admin' });
    }
};