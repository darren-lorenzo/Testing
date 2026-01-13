exports.createService = async (req, res) => {
    try {
        const Service = global.Services
        const service = await Service.findOne({ where: { name: req.body.name } });
        if (service) {
            return res.status(400).json({ message: "already exists" });
        }
        const newService = await Service.create(req.body);
        res.status(201).json(newService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Service' });
    }
}

exports.deleteService = async (req, res) => {
    try {
        const Service = global.Services
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
        await service.destroy();
        return res.status(200).json({ message: "Service supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Service' });
    }
}

exports.updateService = async (req, res) => {
    const ServiceId = req.params.id;
    const updateData = req.body;
    
    try {
        const Service = global.Services
        const service = await Service.findByPk(ServiceId); 
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        await service.update(updateData); 
        res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error('Error updating Service:', error);
        res.status(500).json({ message: 'Error updating Service', error: error.message });
    }
}

exports.getService = async (req, res) => {
    try {
        const Service = global.Services
        const service = await Service.findAll();
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Service' });
    }
}

exports.getServiceById = async (req, res) => {
    try {
        const Service = global.Services
        const service = await Service.findByPk(req.params.id);
        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error founding Service' });
    }
}
