import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Stepper from '../../Components/Organisms/Stepper/Stepper';
import InputText from '../../Components/Atoms/Input/Input';
import Button from '../../Components/Atoms/Button/Button';
import './AddService.css';

const AddService = () => {
//     const navigate = useNavigate();
//     const [currentStep, setCurrentStep] = useState(0);
//     const [isLoading, setIsLoading] = useState(false);

//     // Step 1: General Information
//     const [serviceName, setServiceName] = useState('');
//     const [logoUrl, setLogoUrl] = useState('');

//     // Step 2: OAuth Configuration
//     const [clientId, setClientId] = useState('');
//     const [clientSecret, setClientSecret] = useState('');
//     const [scopes, setScopes] = useState('');
//     const [redirectUrl, setRedirectUrl] = useState('');

//     const steps = [
//         'General Information',
//         'OAuth Configuration'
//     ];

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

//     const handleSubmit = async () => {
//         const serviceData = {
//             name: serviceName,
//             url_logo: logoUrl,
//             oauth: {
//                 clientId,
//                 clientSecret,
//                 scopes: scopes.split('\n').filter(s => s.trim()),
//                 redirectUrl
//             }
//         };

//         setIsLoading(true);
//         try {
//             const response = await serviceService.createService(serviceData);
//             if (response.success) {
//                 toast.success('Service added successfully!');
//                 navigate('/services');
//             } else {
//                 toast.error('Failed to add service: ' + (response.message || 'Unknown error'));
//             }
//         } catch (error) {
//             console.error('Error adding service:', error);
//             toast.error('An error occurred while adding the service.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const isStepValid = () => {
//         switch (currentStep) {
//             case 0:
//                 return serviceName.trim().length > 0 && logoUrl.trim().length > 0;
//             case 1:
//                 return clientId.trim().length > 0 &&
//                     clientSecret.trim().length > 0 &&
//                     scopes.trim().length > 0 &&
//                     redirectUrl.trim().length > 0;
//             default:
//                 return false;
//         }
//     };

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 0:
//                 return (
//                     <div className="step-content">
//                         <h2>General Information</h2>
//                         <div className="form-container">
//                             <div className="form-field">
//                                 <label>
//                                     Service Name
//                                     <span className="required">*</span>
//                                 </label>
//                                 <InputText
//                                     type="text"
//                                     placeholder="e.g., GitHub, OneDrive, Gmail"
//                                     value={serviceName}
//                                     onChange={(e) => setServiceName(e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-field">
//                                 <label>
//                                     Logo URL
//                                     <span className="required">*</span>
//                                 </label>
//                                 <InputText
//                                     type="url"
//                                     placeholder="https://cdn.simpleicons.org/github/181717"
//                                     value={logoUrl}
//                                     onChange={(e) => setLogoUrl(e.target.value)}
//                                 />
//                                 {logoUrl && (
//                                     <div className="logo-preview">
//                                         <p>Logo Preview:</p>
//                                         <img src={logoUrl} alt="Service logo preview" />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 );

//             case 1:
//                 return (
//                     <div className="step-content">
//                         <h2>OAuth Configuration</h2>
//                         <div className="form-container">
//                             <div className="form-field">
//                                 <label>
//                                     Client ID
//                                     <span className="required">*</span>
//                                 </label>
//                                 <InputText
//                                     type="text"
//                                     placeholder="Enter OAuth Client ID"
//                                     value={clientId}
//                                     onChange={(e) => setClientId(e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-field">
//                                 <label>
//                                     Client Secret
//                                     <span className="required">*</span>
//                                 </label>
//                                 <InputText
//                                     type="password"
//                                     placeholder="Enter OAuth Client Secret"
//                                     value={clientSecret}
//                                     onChange={(e) => setClientSecret(e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-field">
//                                 <label>
//                                     Scopes
//                                     <span className="required">*</span>
//                                 </label>
//                                 <textarea
//                                     className="scopes-textarea"
//                                     placeholder="Enter scopes (one per line)&#10;e.g.,&#10;user:email&#10;repo&#10;read:org"
//                                     value={scopes}
//                                     onChange={(e) => setScopes(e.target.value)}
//                                     rows={6}
//                                 />
//                             </div>

//                             <div className="form-field">
//                                 <label>
//                                     Redirect URL
//                                     <span className="required">*</span>
//                                 </label>
//                                 <InputText
//                                     type="url"
//                                     placeholder="https://yourapp.com/oauth/callback"
//                                     value={redirectUrl}
//                                     onChange={(e) => setRedirectUrl(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 );

//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="add-service-page">
//             <div className="add-service-container">
//                 <h1 className="page-title">Add New Service</h1>

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
//                             Add Service
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

export default AddService;
