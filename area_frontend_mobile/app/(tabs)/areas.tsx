import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Switch, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import authService from '@/services/authService';

interface Workflow {
    id: string;
    name: string;
    is_active: boolean;
    action_id: number;
    reaction_id: number;
    services: string[];
    color?: string;
    action_name?: {
        name: string;
        logo: string;
    };
    reaction_name?: {
        name: string;
        logo: string;
    };
}

export default function AreasScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWorkflows = async () => {
        try {
            const [wfResponse, servicesResponse, actionsResponse, reactionsResponse] = await Promise.all([
                authService.getWorkflows(),
                authService.getServices(),
                authService.getActions(),
                authService.getReactions()
            ]);

            if (wfResponse.success) {
                const services = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse.data || []);
                const actionsData = actionsResponse.success ? actionsResponse.data : [];
                const reactionsData = reactionsResponse.success ? reactionsResponse.data : [];

                const enrichedWorkflows = (Array.isArray(wfResponse.data) ? wfResponse.data : []).map((workflow: any) => {
                    const actionInfo = actionsData.find((a: any) => a.id === workflow.action_id);
                    const reactionInfo = reactionsData.find((r: any) => r.id === workflow.reaction_id);

                    const actionServiceKey = workflow.services?.[0];
                    const reactionServiceKey = workflow.services?.[1];

                    const actionServiceInfo = services.find((s: any) =>
                        (s.service || '').toLowerCase() === (actionServiceKey || '').toLowerCase() ||
                        (s.name || '').toLowerCase() === (actionServiceKey || '').toLowerCase()
                    );
                    const reactionServiceInfo = services.find((s: any) =>
                        (s.service || '').toLowerCase() === (reactionServiceKey || '').toLowerCase() ||
                        (s.name || '').toLowerCase() === (reactionServiceKey || '').toLowerCase()
                    );

                    return {
                        ...workflow,
                        color: actionServiceInfo?.color || '#6200EE',
                        action_name: {
                            name: actionInfo?.name || 'Action inconnue',
                            logo: actionServiceInfo?.logo || ''
                        },
                        reaction_name: {
                            name: reactionInfo?.name || 'Réaction inconnue',
                            logo: reactionServiceInfo?.logo || ''
                        }
                    };
                });
                setWorkflows(enrichedWorkflows);
            }
        } catch (error) {
            console.error("Error fetching workflows:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchWorkflows();
    }, []);

    const toggleWorkflowStatus = async (workflow: Workflow) => {
        const newStatus = !workflow.is_active;
        try {
            // Update local state first for responsiveness
            setWorkflows(prev => prev.map(w => w.id === workflow.id ? { ...w, is_active: newStatus } : w));

            const res = await authService.updateWorkflow(workflow.id, { is_active: newStatus });
            if (!res.success) {
                // Rollback on error
                setWorkflows(prev => prev.map(w => w.id === workflow.id ? { ...w, is_active: !newStatus } : w));
                Alert.alert("Erreur", "Impossible de mettre à jour le statut.");
            }
        } catch (error) {
            setWorkflows(prev => prev.map(w => w.id === workflow.id ? { ...w, is_active: !newStatus } : w));
            Alert.alert("Erreur", "Une erreur est survenue.");
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Supprimer l'automation",
            "Êtes-vous sûr de vouloir supprimer cette automation ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer", style: "destructive", onPress: async () => {
                        const res = await authService.deleteWorkflow(id);
                        if (res.success) {
                            setWorkflows(prev => prev.filter(w => w.id !== id));
                        } else {
                            Alert.alert("Erreur", "Impossible de supprimer l'automation.");
                        }
                    }
                }
            ]
        );
    };

    const renderAreaItem = ({ item }: { item: Workflow }) => (
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderLeftColor: item.color }]}>
            <View style={styles.cardHeader}>
                <View style={styles.serviceRow}>
                    {item.action_name?.logo ? <Image source={{ uri: item.action_name.logo }} style={styles.miniLogo} contentFit="contain" /> : null}
                    <IconSymbol name="arrow.right" size={16} color={isDark ? '#BBB' : '#666'} style={{ marginHorizontal: 8 }} />
                    {item.reaction_name?.logo ? <Image source={{ uri: item.reaction_name.logo }} style={styles.miniLogo} contentFit="contain" /> : null}
                </View>
                <View style={styles.headerActions}>
                    <Switch
                        value={item.is_active}
                        onValueChange={() => toggleWorkflowStatus(item)}
                        trackColor={{ false: '#767577', true: '#B388FF' }}
                        style={{ marginRight: 10 }}
                    />
                    <TouchableOpacity onPress={() => router.push(`/areas/${item.id}/edit` as any)} style={styles.editButton}>
                        <IconSymbol name="pencil" size={20} color="#6200EE" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                        <IconSymbol name="trash.fill" size={20} color="#FF5252" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentRow}>
                <Text style={[styles.workflowName, { color: isDark ? '#FFF' : '#333' }]}>{item.name}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={[styles.label, { color: isDark ? '#BBB' : '#666' }]}>SI</Text>
                <Text style={[styles.description, { color: isDark ? '#FFF' : '#333' }]} numberOfLines={1}>
                    {item.action_name?.name}
                </Text>
            </View>

            <View style={{ height: 2 }} />

            <View style={styles.detailRow}>
                <Text style={[styles.label, { color: isDark ? '#BBB' : '#666' }]}>ALORS</Text>
                <Text style={[styles.description, { color: isDark ? '#FFF' : '#333' }]} numberOfLines={1}>
                    {item.reaction_name?.name}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Ma Librairie</Text>
                <TouchableOpacity onPress={() => router.push('/create' as any)} style={styles.addButton}>
                    <IconSymbol name="plus" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6200EE" />
                </View>
            ) : workflows.length === 0 ? (
                <View style={styles.emptyState}>
                    <IconSymbol name="cube.box.fill" size={64} color={isDark ? '#333' : '#CCC'} />
                    <Text style={[styles.emptyText, { color: isDark ? '#BBB' : '#666' }]}>Aucun workflow créé</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.push('/create' as any)}
                    >
                        <Text style={styles.createButtonText}>Créer un workflow</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={workflows}
                    renderItem={renderAreaItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6200EE" />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#6200EE',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#6200EE",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    listContent: {
        padding: 24,
        paddingTop: 0,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.1)',
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniLogo: {
        width: 28,
        height: 28,
    },
    editButton: {
        padding: 5,
        marginRight: 10,
    },
    deleteButton: {
        padding: 5,
    },
    contentRow: {
        marginBottom: 12,
    },
    workflowName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        width: 45,
    },
    description: {
        fontSize: 14,
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        marginBottom: 24,
    },
    createButton: {
        backgroundColor: '#6200EE',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 28,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
