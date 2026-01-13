
import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import authService from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';

interface Parameter {
    name: string;
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}

export default function CreateAreaScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [currentStep, setCurrentStep] = useState(0);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [workflowName, setWorkflowName] = useState('');

    const [actionService, setActionService] = useState<any>(null);
    const [action, setAction] = useState<any>(null);
    const [actionConfig, setActionConfig] = useState<any>({});
    const [actionParameters, setActionParameters] = useState<Parameter[]>([]);
    const [actionDetail, setActionDetail] = useState<any>(null);

    const [reactionService, setReactionService] = useState<any>(null);
    const [reaction, setReaction] = useState<any>(null);
    const [reactionConfig, setReactionConfig] = useState<any>({});
    const [reactionParameters, setReactionParameters] = useState<Parameter[]>([]);
    const [reactionDetail, setReactionDetail] = useState<any>(null);

    const [availableActions, setAvailableActions] = useState<any[]>([]);
    const [availableReactions, setAvailableReactions] = useState<any[]>([]);

    const [isCreating, setIsCreating] = useState(false);

    const steps = [
        'Nom',
        'Service Action',
        'Action',
        'Config Action',
        'Service Réaction',
        'Réaction',
        'Config Réaction',
        'Résumé'
    ];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await authService.getServices();
                const userId = await authService.getUserID();
                if (userId) {
                    const userRes = await authService.getUserInfo(userId);
                    const allServices = Array.isArray(res) ? res : (res.data || []);

                    const connectedServices = allServices.filter((service: any) => {
                        const serviceKey = service.service.toLowerCase();
                        const isPublic = !authService.needsAuth(serviceKey);
                        const isConnected = userRes?.info?.[serviceKey]?.isConnected || false;
                        return isPublic || isConnected;
                    });
                    setServices(connectedServices);
                }
            } catch (err) {
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchActions = async () => {
            if (actionService) {
                const res = await authService.getServiceById(actionService.id);
                if (res.success) {
                    setAvailableActions(res.data.actions || []);
                }
            }
        };
        fetchActions();
    }, [actionService]);

    useEffect(() => {
        const fetchReactions = async () => {
            if (reactionService) {
                const res = await authService.getServiceById(reactionService.id);
                if (res.success) {
                    setAvailableReactions(res.data.reactions || []);
                }
            }
        };
        fetchReactions();
    }, [reactionService]);

    useEffect(() => {
        const fetchActionParams = async () => {
            if (action && actionService) {
                const res = await authService.getActionByName(action.name);
                if (res.success && res.data && res.data.Params) {
                    setActionDetail(res.data);
                    const formattedParams = Object.entries(res.data.Params).map(([name, type]: [string, any]) => ({
                        name,
                        type: type.toLowerCase(),
                        label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        placeholder: `Enter ${name.replace(/_/g, ' ')}`,
                        required: false
                    }));
                    setActionParameters(formattedParams);

                    const initialConfig: any = {};
                    formattedParams.forEach(param => {
                        initialConfig[param.name] = param.type === 'checkbox' ? false : '';
                    });
                    setActionConfig(initialConfig);
                }
            }
        };
        fetchActionParams();
    }, [action, actionService]);

    useEffect(() => {
        const fetchReactionParams = async () => {
            if (reaction && reactionService) {
                const res = await authService.getReactionByName(reaction.name);
                if (res.success && res.data && res.data.Params) {
                    setReactionDetail(res.data);
                    const formattedParams = Object.entries(res.data.Params).map(([name, type]: [string, any]) => ({
                        name,
                        type: type.toLowerCase(),
                        label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        placeholder: `Enter ${name.replace(/_/g, ' ')}`,
                        required: false
                    }));
                    setReactionParameters(formattedParams);

                    const initialConfig: any = {};
                    formattedParams.forEach(param => {
                        initialConfig[param.name] = param.type === 'checkbox' ? false : '';
                    });
                    setReactionConfig(initialConfig);
                }
            }
        };
        fetchReactionParams();
    }, [reaction, reactionService]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        const userId = await authService.getUserID();
        if (!userId) {
            Alert.alert("Erreur", "Utilisateur non authentifié.");
            return;
        }

        const description = `${actionService?.name} ${action?.name} → ${reactionService?.name} ${reaction?.name}`;

        const params = {
            action: {
                [actionService?.name.toLowerCase()]: actionConfig
            },
            reaction: {
                [reactionService?.name.toLowerCase()]: reactionConfig
            }
        };

        const workflowPayload = {
            user_id: parseInt(userId),
            description: description,
            name: workflowName,
            action_id: actionDetail?.id,
            reaction_id: reactionDetail?.id,
            Params: params,
            services: [actionService?.name.toLowerCase(), reactionService?.name.toLowerCase()]
        };

        setIsCreating(true);
        const res = await authService.createWorkflow(workflowPayload);
        setIsCreating(false);

        if (res.success) {
            Alert.alert('Succès', 'Workflow créé avec succès !', [
                { text: 'OK', onPress: () => router.push('/(tabs)') }
            ]);
        } else {
            Alert.alert('Erreur', res.error?.message || 'Échec de la création du workflow');
        }
    };

    const validateConfig = (parameters: Parameter[], config: any) => {
        return parameters.every(param => {
            if (!param.required) return true;
            const value = config[param.name];
            if (param.type === 'checkbox') return value === true;
            return value !== undefined && value !== null && String(value).trim() !== '';
        });
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return workflowName.trim().length > 0;
            case 1: return !!actionService;
            case 2: return !!action;
            case 3: return validateConfig(actionParameters, actionConfig);
            case 4: return !!reactionService;
            case 5: return !!reaction;
            case 6: return validateConfig(reactionParameters, reactionConfig);
            case 7: return true;
            default: return false;
        }
    };

    const renderParameterField = (param: Parameter, config: any, setConfig: any) => {
        const value = config[param.name] || '';

        if (param.type === 'checkbox' || param.type === 'boolean') {
            return (
                <View key={param.name} style={styles.paramItem}>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{param.label}</Text>
                    <Switch
                        value={!!value}
                        onValueChange={(v) => setConfig({ ...config, [param.name]: v })}
                    />
                </View>
            );
        }

        return (
            <View key={param.name} style={styles.paramItem}>
                <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{param.label}</Text>
                <TextInput
                    style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#444' : '#DDD' }]}
                    placeholder={param.placeholder}
                    placeholderTextColor={isDark ? '#666' : '#AAA'}
                    value={String(value)}
                    onChangeText={(text) => setConfig({ ...config, [param.name]: text })}
                    keyboardType={param.type === 'number' ? 'numeric' : 'default'}
                />
            </View>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View style={styles.stepContent}>
                        <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>Nommez votre Workflow</Text>
                        <TextInput
                            style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#444' : '#DDD' }]}
                            placeholder="ex: GitHub Push → Gmail Notification"
                            placeholderTextColor={isDark ? '#666' : '#AAA'}
                            value={workflowName}
                            onChangeText={setWorkflowName}
                            autoFocus
                        />
                    </View>
                );
            case 1:
            case 4:
                const isAction = currentStep === 1;
                const currentSelection = isAction ? actionService : reactionService;
                const setSelection = isAction ? setActionService : setReactionService;
                return (
                    <View style={styles.stepContent}>
                        <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>
                            Choisir un service pour la {isAction ? 'Action' : 'Réaction'}
                        </Text>
                        <View style={styles.servicesGrid}>
                            {services.map(service => (
                                <TouchableOpacity
                                    key={service.id}
                                    style={[
                                        styles.serviceCard,
                                        { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
                                        currentSelection?.id === service.id && { borderColor: service.color, borderWidth: 2 }
                                    ]}
                                    onPress={() => setSelection(service)}
                                >
                                    <Image source={{ uri: service.logo }} style={styles.serviceLogo} contentFit="contain" />
                                    <Text style={[styles.serviceName, { color: isDark ? '#FFF' : '#333' }]}>{service.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {services.length === 0 && (
                            <Text style={styles.emptyText}>Aucun service connecté disponible.</Text>
                        )}
                    </View>
                );
            case 2:
            case 5:
                const isAct = currentStep === 2;
                const availableItems = isAct ? availableActions : availableReactions;
                const currentSelected = isAct ? action : reaction;
                const setSelected = isAct ? setAction : setReaction;
                return (
                    <View style={styles.stepContent}>
                        <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>
                            Sélectionnez {isAct ? 'une Action' : 'une Réaction'}
                        </Text>
                        {availableItems.map(item => (
                            <TouchableOpacity
                                key={item.name}
                                style={[
                                    styles.itemCard,
                                    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
                                    currentSelected?.name === item.name && { borderColor: '#6200EE', borderWidth: 2 }
                                ]}
                                onPress={() => setSelected(item)}
                            >
                                <Text style={[styles.itemName, { color: isDark ? '#FFF' : '#000' }]}>{item.name}</Text>
                                <Text style={[styles.itemDesc, { color: isDark ? '#AAA' : '#666' }]}>{item.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 3:
            case 6:
                const isActionConfig = currentStep === 3;
                const params = isActionConfig ? actionParameters : reactionParameters;
                const config = isActionConfig ? actionConfig : reactionConfig;
                const setConf = isActionConfig ? setActionConfig : setReactionConfig;
                const itemLabel = isActionConfig ? action?.name : reaction?.name;
                return (
                    <View style={styles.stepContent}>
                        <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>Configuration: {itemLabel}</Text>
                        {params.length > 0 ? (
                            params.map(p => renderParameterField(p, config, setConf))
                        ) : (
                            <Text style={styles.emptyText}>Aucune configuration requise.</Text>
                        )}
                    </View>
                );
            case 7:
                return (
                    <View style={styles.stepContent}>
                        <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>Résumé du Workflow</Text>
                        <View style={[styles.summaryCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Nom</Text>
                                <Text style={[styles.summaryValue, { color: isDark ? '#FFF' : '#000' }]}>{workflowName}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Déclencheur (Action)</Text>
                                <Text style={[styles.summaryValue, { color: isDark ? '#FFF' : '#000' }]}>{actionService?.name}: {action?.name}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Réacteur (Réaction)</Text>
                                <Text style={[styles.summaryValue, { color: isDark ? '#FFF' : '#000' }]}>{reactionService?.name}: {reaction?.name}</Text>
                            </View>
                        </View>
                    </View>
                );
            default: return null;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={{ marginTop: 10, color: isDark ? '#FFF' : '#000' }}>Chargement des services...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>Créer un Workflow</Text>
                <Text style={styles.stepIndicator}>{currentStep + 1} / {steps.length}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderStepContent()}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: isDark ? '#333' : '#EEE', backgroundColor: isDark ? '#121212' : '#FFF' }]}>
                <TouchableOpacity
                    style={[styles.btn, styles.btnSecondary, currentStep === 0 && { opacity: 0 }]}
                    onPress={handleBack}
                    disabled={currentStep === 0}
                >
                    <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#6200EE' }]}>Retour</Text>
                </TouchableOpacity>

                {currentStep === steps.length - 1 ? (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary]}
                        onPress={handleSubmit}
                        disabled={isCreating}
                    >
                        {isCreating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnTextPrimary}>Créer</Text>}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary, !isStepValid() && { opacity: 0.5 }]}
                        onPress={handleNext}
                        disabled={!isStepValid()}
                    >
                        <Text style={styles.btnTextPrimary}>Suivant</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    stepIndicator: {
        fontSize: 14,
        color: '#6200EE',
        fontWeight: '600',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceCard: {
        width: '48%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceLogo: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    itemCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDesc: {
        fontSize: 14,
        marginTop: 5,
    },
    paramItem: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
    summaryCard: {
        padding: 20,
        borderRadius: 15,
    },
    summaryItem: {
        paddingVertical: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6200EE',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
    },
    btn: {
        height: 50,
        paddingHorizontal: 30,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
    },
    btnPrimary: {
        backgroundColor: '#6200EE',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnTextPrimary: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});
