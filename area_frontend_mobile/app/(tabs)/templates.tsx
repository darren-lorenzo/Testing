import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import authService, { Service, ServiceAction, ServiceReaction } from '@/services/authService';

interface Template {
    id: number;
    name: string;
    description: string;
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

export default function TemplatesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    const fetchData = async () => {
        try {
            const userID = await authService.getUserID();
            const [tplResponse, servicesResponse, actionsResponse, reactionsResponse, userResponse] = await Promise.all([
                authService.getTemplates(),
                authService.getServices(),
                authService.getActions(),
                authService.getReactions(),
                userID ? authService.getUserInfo(userID) : Promise.resolve(null)
            ]);

            if (tplResponse.success) {
                const services = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse.data || []);
                const actionsData = actionsResponse.success ? actionsResponse.data : [];
                const reactionsData = reactionsResponse.success ? reactionsResponse.data : [];

                const enrichedTemplates = (Array.isArray(tplResponse.data) ? tplResponse.data : []).map((template: any) => {
                    const actionInfo = actionsData.find((a: any) => a.id === template.action_id);
                    const reactionInfo = reactionsData.find((r: any) => r.id === template.reaction_id);

                    const actionServiceKey = template.services?.[0];
                    const reactionServiceKey = template.services?.[1];

                    const actionServiceInfo = services.find((s: any) =>
                        (s.service || '').toLowerCase() === (actionServiceKey || '').toLowerCase() ||
                        (s.name || '').toLowerCase() === (actionServiceKey || '').toLowerCase()
                    );
                    const reactionServiceInfo = services.find((s: any) =>
                        (s.service || '').toLowerCase() === (reactionServiceKey || '').toLowerCase() ||
                        (s.name || '').toLowerCase() === (reactionServiceKey || '').toLowerCase()
                    );

                    return {
                        ...template,
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
                setTemplates(enrichedTemplates);
                if (userResponse) {
                    setUserInfo(userResponse);
                }
            }
        } catch (error) {
            console.error("Error fetching templates data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const handleUseTemplate = (template: Template) => {
        if (!userInfo || !userInfo.info) {
            Alert.alert("Erreur", "Impossible de vérifier vos connexions. Veuillez réessayer.");
            return;
        }

        const disconnectedServices: string[] = [];
        if (template.services) {
            template.services.forEach(serviceName => {
                const serviceKey = serviceName.toLowerCase();
                // Check if service needs auth
                if (authService.needsAuth(serviceKey)) {
                    const isConnected = userInfo.info[serviceKey]?.isConnected;
                    if (!isConnected) {
                        disconnectedServices.push(serviceName);
                    }
                }
            });
        }

        if (disconnectedServices.length > 0) {
            Alert.alert("Connexion requise", `Veuillez vous connecter à : ${disconnectedServices.join(', ')}`);
            return;
        }

        // Navigate to use template screen
        router.push(`/template/${template.id}/use` as any);
    };

    const renderTemplateItem = ({ item }: { item: Template }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderLeftColor: item.color }]}
            onPress={() => handleUseTemplate(item)}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View style={styles.serviceRow}>
                    {item.action_name?.logo ? <Image source={{ uri: item.action_name.logo }} style={styles.miniLogo} contentFit="contain" /> : null}
                    <IconSymbol name="arrow.right" size={16} color={isDark ? '#BBB' : '#666'} style={{ marginHorizontal: 8 }} />
                    {item.reaction_name?.logo ? <Image source={{ uri: item.reaction_name.logo }} style={styles.miniLogo} contentFit="contain" /> : null}
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Modèle</Text>
                </View>
            </View>

            <Text style={[styles.templateName, { color: isDark ? '#FFF' : '#333' }]}>{item.name}</Text>
            <Text style={[styles.description, { color: isDark ? '#BBB' : '#666' }]} numberOfLines={3}>
                {item.description}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Modèles</Text>
                <Text style={[styles.subtitle, { color: isDark ? '#BBB' : '#666' }]}>Prêt à l'emploi</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6200EE" />
                </View>
            ) : templates.length === 0 ? (
                <View style={styles.emptyState}>
                    <IconSymbol name="sparkles" size={64} color={isDark ? '#333' : '#CCC'} />
                    <Text style={[styles.emptyText, { color: isDark ? '#BBB' : '#666' }]}>Aucun modèle disponible</Text>
                </View>
            ) : (
                <FlatList
                    data={templates}
                    renderItem={renderTemplateItem}
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
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
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
        marginBottom: 12,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniLogo: {
        width: 24,
        height: 24,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666666',
    },
    templateName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
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
    },
});
