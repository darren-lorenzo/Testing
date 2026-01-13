exports.createAction = async (req, res) => {
    try {
        const Action = global.Actions
        const action = await Action.findOne({ where: { name: req.body.name } });
        if (action) {
            return res.status(400).json({ message: "already exists" });
        }
        const newAction = await Action.create(req.body);
        res.status(201).json(newAction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Action' });
    }
}

exports.deleteAction = async (req, res) => {
    try {
        const Action = global.Actions
        const action = await Action.findByPk(req.params.id);
        if (!action) {
            return res.status(404).json({ message: "Action non trouvé" });
        }
        await action.destroy();
        return res.status(200).json({ message: "Action supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Action' });
    }
}

exports.updateAction = async (req, res) => {
    const ActionId = req.params.id;
    const updateData = req.body;
    
    try {
        const Action = global.Actions
        const action = await Action.findByPk(ActionId); 
        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }
        await action.update(updateData); 
        res.status(200).json({ message: 'Action updated successfully', action });
    } catch (error) {
        console.error('Error updating Action:', error);
        res.status(500).json({ message: 'Error updating Action', error: error.message });
    }
}

exports.getAction = async (req, res) => {
    try {
        const Action = global.Actions
        const action = await Action.findAll();
        res.status(200).json(action);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Action' });
    }
}

exports.getActionById = async (req, res) => {
    try {
        const Action = global.Actions
        const action = await Action.findByPk(req.params.id);
        res.status(201).json(action);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error founding Action' });
    }
}

exports.getActionByName = async (req, res) => {
    try {
        const name = req.params.name;
        const Action = global.Actions
        const action = await Action.findOne({ where: { name } });

        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.json(action);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
