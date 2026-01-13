const express = require('express');
const AreaTemplateController = require('../../Api/Controllers/TemplateArea');
const route = express.Router();

route.get('/', AreaTemplateController.getAllTemplates);
route.get('/:id', AreaTemplateController.getTemplateById);
route.post('/create-workflow', AreaTemplateController.createWorkflowFromTemplate);

route.post('/', AreaTemplateController.createTemplate);
route.put('/:id', AreaTemplateController.updateTemplate);
route.delete('/:id', AreaTemplateController.deleteTemplate);

module.exports = route;