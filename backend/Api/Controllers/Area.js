exports.createArea = async (req, res) => {
    try {
        const Area = global.Workflows
        const area = await Area.findOne({ where: { name: req.body.name } });
        if (area) {
            return res.status(400).json({ message: "already exists" });
        }
        const newAction = await Area.create(req.body);
        res.status(201).json(newAction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Area' });
    }
}
 
exports.deleteArea = async (req, res) => {
    try {
        const Area = global.Workflows
        const area = await Area.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: "Area non trouvé" });
        }
        await area.destroy();
        return res.status(200).json({ message: "Area supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Area' });
    }
}
 
exports.updateArea = async (req, res) => {
    const AreaId = req.params.id;
    const updateData = req.body;
 
    try {
        const Area = global.Workflows
        const area = await Area.findByPk(AreaId);
        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }
        await area.update(updateData);
        res.status(200).json({ message: 'Area updated successfully', area });
    } catch (error) {
        console.error('Error updating Area:', error);
        res.status(500).json({ message: 'Error updating Area', error: error.message });
    }
}
 
exports.getArea = async (req, res) => {
    try {
        const Area = global.Workflows
        const area = await Area.findAll();
        res.status(200).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Area' });
    }
}
 
exports.getAreaById = async (req, res) => {
    try {
        const Area = global.Workflows
        const area = await Area.findByPk(req.params.id);
        res.status(201).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error founding Area' });
    }
}
 
exports.getAreasByService = async (req, res) => {
    try {
        const Area = global.Workflows;
        const service = req.params.service; // ex: "github"
 
        const areas = await Area.findAll({
            where: sequelize.where(
                sequelize.fn(
                    "JSON_CONTAINS",
                    sequelize.col("services"),
                    JSON.stringify([service])
                ),
                1
            )
        });
 
        res.status(200).json(areas);
    } catch (error) {
        console.error("Error fetching workflows by service:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
 
exports.getAreasByUser = async (req, res) => {
    try {
        const Area = global.Workflows
        const areas = await Area.findAll({ where: { user_id: req.params.id } });
        res.status(200).json(areas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error finding Areas' });
    }
};
 