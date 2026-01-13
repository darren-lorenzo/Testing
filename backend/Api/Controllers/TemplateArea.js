exports.getAllTemplates = async (req, res) => {
    try {
        const AreaTemplate = global.AreaTemplates;
        const templates = await AreaTemplate.findAll();
        res.status(200).json(templates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const AreaTemplate = global.AreaTemplates;
        const template = await AreaTemplate.findByPk(req.params.id);
        
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        
        res.status(200).json(template);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching template' });
    }
};

exports.createWorkflowFromTemplate = async (req, res) => {
    try {
        const AreaTemplate = global.AreaTemplates;
        const Workflow = global.Workflows;
        const User = global.User;
        
        const { templateId, userId, customParams } = req.body;
        
        if (!templateId || !userId) {
            return res.status(400).json({ 
                message: 'Template ID and User ID are required' 
            });
        }
        
        // Vérifier que le template existe
        const template = await AreaTemplate.findByPk(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        
        // Vérifier que l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Fusionner les paramètres du template avec les paramètres personnalisés
        const mergedParams = customParams 
            ? { ...template.Params, ...customParams }
            : template.Params;
        
        // Créer le workflow à partir du template
        const newWorkflow = await Workflow.create({
            user_id: userId,
            name: `${template.name} - ${new Date().toISOString().split('T')[0]}`,
            description: template.description,
            action_id: template.action_id,
            reaction_id: template.reaction_id,
            Params: mergedParams,
            services: template.services,
            last_triggered_value: null,
            active: true
        });
        
        res.status(201).json({
            message: 'Workflow created successfully from template',
            workflow: newWorkflow
        });
        
    } catch (error) {
        console.error('Error creating workflow from template:', error);
        res.status(500).json({ 
            message: 'Error creating workflow from template',
            error: error.message 
        });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const AreaTemplate = global.AreaTemplates;
        const template = await AreaTemplate.findOne({ 
            where: { name: req.body.name } 
        });
        
        if (template) {
            return res.status(400).json({ message: "Template already exists" });
        }
        
        const newTemplate = await AreaTemplate.create(req.body);
        res.status(201).json(newTemplate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating template' });
    }
};

exports.updateTemplate = async (req, res) => {
    const templateId = req.params.id;
    const updateData = req.body;
    
    try {
        const AreaTemplate = global.AreaTemplates;
        const template = await AreaTemplate.findByPk(templateId);
        
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        
        await template.update(updateData);
        res.status(200).json({ 
            message: 'Template updated successfully', 
            template 
        });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ 
            message: 'Error updating template', 
            error: error.message 
        });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        const AreaTemplate = global.AreaTemplates;
        const template = await AreaTemplate.findByPk(req.params.id);
        
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        
        await template.destroy();
        return res.status(200).json({ 
            message: "Template deleted successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting template' });
    }
};