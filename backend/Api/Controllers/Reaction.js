exports.createReaction = async (req, res) => {
    try {
        const Reaction = global.Reactions
        const reaction = await Reaction.findOne({ where: { name: req.body.name } });
        if (reaction) {
            return res.status(400).json({ message: "already exists" });
        }
        const newReaction = await Reaction.create(req.body);
        res.status(201).json(newReaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Reaction' });
    }
}

exports.deleteReaction = async (req, res) => {
    try {
        const Reaction = global.Reactions
        const reaction = await Reaction.findByPk(req.params.id);
        if (!reaction) {
            return res.status(404).json({ message: "Reaction non trouvé" });
        }
        await reaction.destroy();
        return res.status(200).json({ message: "Reaction supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Reaction' });
    }
}

exports.updateReaction = async (req, res) => {
    const ReactionId = req.params.id;
    const updateData = req.body;
    
    try {
        const Reaction = global.Reactions
        const reaction = await Reaction.findByPk(ReactionId); 
        if (!reaction) {
            return res.status(404).json({ message: 'Reaction not found' });
        }
        await reaction.update(updateData); 
        res.status(200).json({ message: 'Reaction updated successfully', reaction });
    } catch (error) {
        console.error('Error updating Reaction:', error);
        res.status(500).json({ message: 'Error updating Reaction', error: error.message });
    }
}

exports.getReaction = async (req, res) => {
    try {
        const Reaction = global.Reactions
        const reaction = await Reaction.findAll();
        res.status(200).json(reaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Reaction' });
    }
}

exports.getReactionById = async (req, res) => {
    try {
        const Reaction = global.Reactions
        const reaction = await Reaction.findByPk(req.params.id);
        res.status(201).json(reaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error founding Reaction' });
    }
}

exports.getReactionByName = async (req, res) => {
    try {
        const name = req.params.name;
        const Reaction = global.Reactions
        const reaction = await Reaction.findOne({ where: { name } });

        if (!reaction) {
            return res.status(404).json({ message: 'Reaction not found' });
        }

        res.json(reaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
