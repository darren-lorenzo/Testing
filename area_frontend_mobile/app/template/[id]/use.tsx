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

export default function UseTemplateScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [workflowName, setWorkflowName] = useState('');
    const [formValues, setFormValues] = useState<any>({});
    const [actionPlaceholders, setActionPlaceholders] = useState<any>({});
    const [reactionPlaceholders, setReactionPlaceholders] = useState<any>({});

    const extractPlaceholders = (params: any) => {
        const extractFromObj = (obj: any) => {
            const extracted: any = {};
            const traverse = (o: any) => {
                for (const key in o) {
                    if (typeof o[key] === 'string') {
                        const val = o[key].toLowerCase();
                        if (['string', 'number', 'int', 'integer', 'boolean'].includes(val)) {
                            extracted[key] = { type: val };
                        }
                        const matches = o[key].match(/\{\{([^}]+)\}\}/g);
                        if (matches) {
                            matches.forEach((match: string) => {
                                const variable = match.replace(/\{\{|\}\}/g, '');
                                extracted[variable] = { type: 'string' };
                            });
                        }
                    } else if (typeof o[key] === 'object' && o[key] !== null) {
                        traverse(o[key]);
                    }
                }
            };
            traverse(obj);
            return extracted;
        };

        const actionParams = params.action || {};
        const reactionParams = params.reaction || {};

        const actionExtracted = extractFromObj(actionParams);
        const reactionExtracted = extractFromObj(reactionParams);

        setActionPlaceholders(actionExtracted);
        setReactionPlaceholders(reactionExtracted);

        const initialValues: any = {};
        Object.keys(actionExtracted).forEach(k => initialValues[k] = actionExtracted[k].type === 'boolean' ? false : '');
        Object.keys(reactionExtracted).forEach(k => initialValues[k] = reactionExtracted[k].type === 'boolean' ? false : '');
        setFormValues(initialValues);
    };

    const replacePlaceholders = (obj: any, values: any): any => {
        if (typeof obj === 'string') {
            return obj.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
                return values[variable] !== undefined ? String(values[variable]) : match;
            });
        } else if (Array.isArray(obj)) {
            return obj.map(item => replacePlaceholders(item, values));
        } else if (typeof obj === 'object' && obj !== null) {
            const newObj: any = {};
            for (const key in obj) {
                const val = typeof obj[key] === 'string' ? obj[key].toLowerCase() : '';
                if (typeof obj[key] === 'string' && ['string', 'number', 'int', 'integer', 'boolean'].includes(val) && values[key] !== undefined) {
                    newObj[key] = values[key];
                } else {
                    newObj[key] = replacePlaceholders(obj[key], values);
                }
            }
            return newObj;
        }
        return obj;
    };

    useEffect(() => {
        const fetchTemplateData = async () => {
            try {
                const res = await authService.getTemplateById(id as string);
                if (res.success && res.data) {
                    const tpl = res.data;
                    setTemplate(tpl);
                    setWorkflowName(tpl.name);
                    extractPlaceholders(tpl.Params);
                }
            } catch (error) {
                console.error("Error fetching template:", error);
                Alert.alert("Erreur", "Impossible de charger le modèle.");
            } finally {
                setLoading(false);
            }
        };
        fetchTemplateData();
    }, [id]);

    const handleSubmit = async () => {
        if (!workflowName.trim()) {
            Alert.alert("Erreur", "Veuillez donner un nom à votre workflow.");
            return;
        }

        const userId = await authService.getUserID();
        if (!userId) return;

        const filledParams = replacePlaceholders(template.Params, formValues);

        const payload = {
            user_id: parseInt(userId),
            name: workflowName,
            description: template.description,
            action_id: template.action_id,
            reaction_id: template.reaction_id,
            Params: filledParams,
            services: template.services.map((s: string) => s.toLowerCase()),
            is_active: false
        };

        setSubmitting(true);
        const res = await authService.createWorkflow(payload);
        setSubmitting(false);

        if (res.success) {
            Alert.alert("Succès", "Workflow créé avec succès !", [
                { text: "Super", onPress: () => router.push('/areas') }
            ]);
        } else {
            Alert.alert("Erreur", res.error?.message || "Échec de la création.");
        }
    };

    const renderField = (name: string, type: string) => (
        <View key={name} style={styles.fieldContainer}>
            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>
                {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
            {type === 'boolean' || type === 'checkbox' ? (
                <Switch
                    value={!!formValues[name]}
                    onValueChange={(v) => setFormValues({ ...formValues, [name]: v })}
                />
            ) : (
                <TextInput
                    style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#444' : '#DDD' }]}
                    placeholder={`Entrez ${name.replace(/_/g, ' ')}`}
                    placeholderTextColor={isDark ? '#666' : '#AAA'}
                    value={String(formValues[name] || '')}
                    onChangeText={(t) => setFormValues({ ...formValues, [name]: t })}
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
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Utiliser le modèle</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                    <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#000' }]}>{template?.name}</Text>
                    <Text style={[styles.infoDesc, { color: isDark ? '#BBB' : '#666' }]}>{template?.description}</Text>
                </View>

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

                {Object.keys(actionPlaceholders).length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Config Action ({template?.services[0]})</Text>
                        {Object.keys(actionPlaceholders).map(name => renderField(name, actionPlaceholders[name].type))}
                    </View>
                )}

                {Object.keys(reactionPlaceholders).length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Config Réaction ({template?.services[1]})</Text>
                        {Object.keys(reactionPlaceholders).map(name => renderField(name, reactionPlaceholders[name].type))}
                    </View>
                )}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: isDark ? '#121212' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: '#6200EE' }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Activer le Workflow</Text>}
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
    infoCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 25,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoDesc: {
        fontSize: 14,
        lineHeight: 20,
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
