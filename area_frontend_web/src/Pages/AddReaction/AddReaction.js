import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Stepper from '../../Components/Organisms/Stepper/Stepper';
import InputText from '../../Components/Atoms/Input/Input';
import Button from '../../Components/Atoms/Button/Button';
import './AddReaction.css';

const AddReaction = () => {
//     const navigate = useNavigate();
//     const [currentStep, setCurrentStep] = useState(0);
//     const [isLoading, setIsLoading] = useState(false);
//     const [services, setServices] = useState([]);

//     const [selectedService, setSelectedService] = useState(null);

//     const [name, setName] = useState('');
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');

//     const [method, setMethod] = useState('POST');
//     const [endpoint, setEndpoint] = useState('');
//     const [scopes, setScopes] = useState('');

//     const [parameters, setParameters] = useState([{ name: '', type: 'text' }]);

//     const [bodyTemplate, setBodyTemplate] = useState('{\n  \n}');

//     const steps = [
//         'Choose Service',
//         'General Info',
//         'API Config',
//         'Parameters',
//         'Body Template'
//     ];

//     useEffect(() => {
//         const fetchServices = async () => {
//             const res = await serviceService.getServices();
//             if (res.success) {
//                 setServices(res.data);
//             }
//         };
//         fetchServices();
//     }, []);

//     const handleNext = () => {
//         if (currentStep < steps.length - 1) {
//             setCurrentStep(prev => prev + 1);
//         }
//     };

//     const handleBack = () => {
//         if (currentStep > 0) {
//             setCurrentStep(prev => prev - 1);
//         }
//     };

//     const handleAddParameter = () => {
//         setParameters([...parameters, { name: '', type: 'text' }]);
//     };

//     const handleRemoveParameter = (index) => {
//         const newParams = parameters.filter((_, i) => i !== index);
//         setParameters(newParams);
//     };

//     const handleParameterChange = (index, field, value) => {
//         const newParams = [...parameters];
//         newParams[index][field] = value;
//         setParameters(newParams);
//     };

//     const handleSubmit = async () => {
//         const reactionData = {
//             serviceId: selectedService.id,
//             name,
//             title,
//             description,
//             api: {
//                 method,
//                 endpoint,
//                 scopes: scopes.split(',').map(s => s.trim()).filter(s => s)
//             },
//             parameters: parameters.filter(p => p.name.trim() !== ''),
//             bodyTemplate: JSON.parse(bodyTemplate)
//         };

//         setIsLoading(true);
//         try {
//             const response = await serviceService.createReaction(reactionData);
//             if (response.success) {
//                 toast.success('Reaction added successfully!');
//                 navigate('/services');
//             } else {
//                 toast.error('Failed to add reaction: ' + (response.message || 'Unknown error'));
//             }
//         } catch (error) {
//             console.error('Error adding reaction:', error);
//             toast.error('An error occurred while adding the reaction. Check your JSON format.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const isStepValid = () => {
//         switch (currentStep) {
//             case 0:
//                 return !!selectedService;
//             case 1:
//                 return name.trim().length > 0 && title.trim().length > 0 && description.trim().length > 0;
//             case 2:
//                 return endpoint.trim().length > 0;
//             case 3:
//                 return parameters.every(p => p.name.trim().length > 0);
//             case 4:
//                 try {
//                     JSON.parse(bodyTemplate);
//                     return true;
//                 } catch (e) {
//                     return false;
//                 }
//             default:
//                 return false;
//         }
//     };

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 0:
//                 return (
//                     <div className="step-content">
//                         <h2>Select a Service</h2>
//                         <div className="services-grid-select">
//                             {services.map(service => (
//                                 <div
//                                     key={service.id}
//                                     className={`service-card-item ${selectedService?.id === service.id ? 'selected' : ''}`}
//                                     onClick={() => setSelectedService(service)}
//                                 >
//                                     <img src={service.url_logo} alt={service.name} />
//                                     <span>{service.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 );

//             case 1:
//                 return (
//                     <div className="step-content">
//                         <h2>General Information</h2>
//                         <div className="form-container">
//                             <div className="form-field">
//                                 <label>Internal Name <span className="required">*</span></label>
//                                 <InputText
//                                     type="text"
//                                     placeholder="e.g., send_email"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                 />
//                             </div>
//                             <div className="form-field">
//                                 <label>Display Title <span className="required">*</span></label>
//                                 <InputText
//                                     type="text"
//                                     placeholder="e.g., Send an Email"
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                 />
//                             </div>
//                             <div className="form-field">
//                                 <label>Description <span className="required">*</span></label>
//                                 <textarea
//                                     className="description-textarea"
//                                     placeholder="Describe what this reaction does..."
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     rows={3}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 );

//             case 2:
//                 return (
//                     <div className="step-content">
//                         <h2>API Configuration</h2>
//                         <div className="form-container">
//                             <div className="form-field">
//                                 <label>HTTP Method <span className="required">*</span></label>
//                                 <select
//                                     className="type-select"
//                                     value={method}
//                                     onChange={(e) => setMethod(e.target.value)}
//                                 >
//                                     <option value="POST">POST</option>
//                                     <option value="PUT">PUT</option>
//                                     <option value="DELETE">DELETE</option>
//                                     <option value="PATCH">PATCH</option>
//                                 </select>
//                             </div>
//                             <div className="form-field">
//                                 <label>Endpoint URL <span className="required">*</span></label>
//                                 <InputText
//                                     type="text"
//                                     placeholder="e.g., /v1/messages"
//                                     value={endpoint}
//                                     onChange={(e) => setEndpoint(e.target.value)}
//                                 />
//                             </div>
//                             <div className="form-field">
//                                 <label>Scopes (comma separated)</label>
//                                 <InputText
//                                     type="text"
//                                     placeholder="e.g., mail.send, user.read"
//                                     value={scopes}
//                                     onChange={(e) => setScopes(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 );

//             case 3:
//                 return (
//                     <div className="step-content">
//                         <h2>Define Parameters</h2>
//                         <p className="step-description">Define parameters needed for this reaction.</p>
//                         <div className="parameters-list">
//                             {parameters.map((param, index) => (
//                                 <div key={index} className="parameter-row">
//                                     <div className="param-field name">
//                                         <InputText
//                                             type="text"
//                                             placeholder="Parameter Name"
//                                             value={param.name}
//                                             onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
//                                         />
//                                     </div>
//                                     <div className="param-field type">
//                                         <select
//                                             value={param.type}
//                                             onChange={(e) => handleParameterChange(index, 'type', e.target.value)}
//                                         >
//                                             <option value="text">Text</option>
//                                             <option value="number">Number</option>
//                                             <option value="boolean">Boolean</option>
//                                             <option value="object">Object</option>
//                                         </select>
//                                     </div>
//                                     <Button
//                                         className="remove-param-btn"
//                                         onClick={() => handleRemoveParameter(index)}
//                                         disabled={parameters.length === 1}
//                                         variant="transparent"
//                                     >
//                                         ✕
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                         <Button
//                             className="add-param-btn"
//                             onClick={handleAddParameter}
//                             variant="transparent"
//                         >
//                             + Add Parameter
//                         </Button>
//                     </div>
//                 );

//             case 4:
//                 return (
//                     <div className="step-content">
//                         <h2>Body Template</h2>
//                         <p className="step-description">Define the JSON body structure. Use <code>{'{{paramName}}'}</code> for dynamic values.</p>
//                         <div className="form-container">
//                             <textarea
//                                 className="code-textarea"
//                                 value={bodyTemplate}
//                                 onChange={(e) => setBodyTemplate(e.target.value)}
//                                 rows={10}
//                             />
//                             {!isStepValid() && bodyTemplate.length > 0 && (
//                                 <p className="error-text">Invalid JSON format</p>
//                             )}
//                         </div>
//                     </div>
//                 );

//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="add-reaction-page">
//             <div className="add-reaction-container">
//                 <h1 className="page-title">Add New Reaction</h1>

//                 <Stepper steps={steps} currentStep={currentStep} />

//                 <div className="step-container">
//                     {renderStepContent()}
//                 </div>

//                 <div className="step-actions">
//                     <Button
//                         variant="secondary"
//                         onClick={handleBack}
//                         disabled={currentStep === 0}
//                     >
//                         Back
//                     </Button>

//                     {currentStep === steps.length - 1 ? (
//                         <Button
//                             variant="primary"
//                             onClick={handleSubmit}
//                             disabled={!isStepValid() || isLoading}
//                             isLoading={isLoading}
//                         >
//                             Add Reaction
//                         </Button>
//                     ) : (
//                         <Button
//                             variant="primary"
//                             onClick={handleNext}
//                             disabled={!isStepValid()}
//                         >
//                             Next
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
};

export default AddReaction;
