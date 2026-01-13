import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import authService from '@/services/authService';

interface Parameter {
    name: string;
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
}

export default function EditAreaScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [workflow, setWorkflow] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [workflowName, setWorkflowName] = useState('');
    const [actionConfig, setActionConfig] = useState<any>({});
    const [reactionConfig, setReactionConfig] = useState<any>({});

    const [actionParams, setActionParams] = useState<Parameter[]>([]);
    const [reactionParams, setReactionParams] = useState<Parameter[]>([]);

    useEffect(() => {
        const fetchWorkflowData = async () => {
            try {
                const res = await authService.getWorkflows(); // getWorkflows gets all, we need by ID
                // authService doesn't have getWorkflowById, but we can find it in the list for now
                // or add getWorkflowById to authService.
                // Let's check authService.ts again.
                // It has updateWorkflow(id, data).

                const allRes = await authService.getWorkflows();
                const wf = (allRes.data || []).find((w: any) => String(w.id) === String(id));

                if (wf) {
                    setWorkflow(wf);
                    setWorkflowName(wf.name);

                    // Extract existing config
                    const actionServiceKey = wf.services[0];
                    const reactionServiceKey = wf.services[1];
                    setActionConfig(wf.Params.action[actionServiceKey] || {});
                    setReactionConfig(wf.Params.reaction[reactionServiceKey] || {});

                    // Fetch params for existing action and reaction
                    const [actionsRes, reactionsRes] = await Promise.all([
                        authService.getActions(),
                        authService.getReactions()
                    ]);

                    const actionInfo = (actionsRes.data || []).find((a: any) => a.id === wf.action_id);
                    const reactionInfo = (reactionsRes.data || []).find((r: any) => r.id === wf.reaction_id);

                    if (actionInfo?.Params) {
                        const formatted = Object.entries(actionInfo.Params).map(([name, type]: [string, any]) => ({
                            name,
                            type: type.toLowerCase(),
                            label: name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                            placeholder: `Entrez ${name.replace(/_/g, ' ')}`,
                            required: true
                        }));
                        setActionParams(formatted);
                    }

                    if (reactionInfo?.Params) {
                        const formatted = Object.entries(reactionInfo.Params).map(([name, type]: [string, any]) => ({
                            name,
                            type: type.toLowerCase(),
                            label: name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                            placeholder: `Entrez ${name.replace(/_/g, ' ')}`,
                            required: true
                        }));
                        setReactionParams(formatted);
                    }
                } else {
                    Alert.alert("Erreur", "Workflow non trouvé.");
                    router.back();
                }
            } catch (error) {
                console.error("Error fetching workflow:", error);
                Alert.alert("Erreur", "Impossible de charger le workflow.");
            } finally {
                setLoading(false);
            }
        };
        fetchWorkflowData();
    }, [id]);

    const handleSubmit = async () => {
        if (!workflowName.trim()) {
            Alert.alert("Erreur", "Le nom ne peut pas être vide.");
            return;
        }

        const payload = {
            name: workflowName,
            Params: {
                action: {
                    [workflow.services[0]]: actionConfig
                },
                reaction: {
                    [workflow.services[1]]: reactionConfig
                }
            }
        };

        setSubmitting(true);
        const res = await authService.updateWorkflow(id as string, payload);
        setSubmitting(false);

        if (res.success) {
            Alert.alert("Succès", "Workflow mis à jour !", [
                { text: "OK", onPress: () => router.push('/areas') }
            ]);
        } else {
            Alert.alert("Erreur", res.error?.message || "Échec de la mise à jour.");
        }
    };

    const renderField = (param: Parameter, config: any, setConfig: any) => (
        <View key={param.name} style={styles.fieldContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{param.label}</Text>
            {param.type === 'checkbox' || param.type === 'boolean' ? (
                <Switch
                    value={!!config[param.name]}
                    onValueChange={(v) => setConfig({ ...config, [param.name]: v })}
                />
            ) : (
                <TextInput
                    style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#444' : '#DDD' }]}
                    placeholder={param.placeholder}
                    placeholderTextColor={isDark ? '#666' : '#AAA'}
                    value={String(config[param.name] || '')}
                    onChangeText={(t) => setConfig({ ...config, [param.name]: t })}
                />
            )}
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <ActivityIndicator size="large" color="#6200EE" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Modifier le Workflow</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Configuration Générale</Text>
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nom du Workflow</Text>
                        <TextInput
                            style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#444' : '#DDD' }]}
                            value={workflowName}
                            onChangeText={setWorkflowName}
                        />
                    </View>
                </View>

                {actionParams.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Action: {workflow?.services[0]}</Text>
                        {actionParams.map(p => renderField(p, actionConfig, setActionConfig))}
                    </View>
                )}

                {reactionParams.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Réaction: {workflow?.services[1]}</Text>
                        {reactionParams.map(p => renderField(p, reactionConfig, setReactionConfig))}
                    </View>
                )}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: isDark ? '#121212' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: '#6200EE' }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Enregistrer les modifications</Text>}
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#6200EE',
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
    },
    submitButton: {
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
