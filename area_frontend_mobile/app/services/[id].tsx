import React, { useState, useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import authService, { Service } from '@/services/authService';
import { API_URL } from '@/services/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';

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

export default function ServiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [service, setService] = useState<any>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const userID = await authService.getUserID();
            const [serviceRes, userRes, tplResponse, servicesRes, actionsRes, reactionsRes] = await Promise.all([
                authService.getServiceById(id as string),
                userID ? authService.getUserInfo(userID) : Promise.resolve(null),
                authService.getTemplates(),
                authService.getServices(),
                authService.getActions(),
                authService.getReactions()
            ]);

            if (serviceRes.success) {
                const s = serviceRes.data;
                const serviceName = s.service.toLowerCase();
                const isConnected = userRes?.info?.[serviceName]?.isConnected || false;

                setService({ ...s, connection_info: isConnected });
                setUserInfo(userRes);

                if (tplResponse.success) {
                    const allServices = Array.isArray(servicesRes) ? servicesRes : (servicesRes.data || []);
                    const actionsData = actionsRes.success ? actionsRes.data : [];
                    const reactionsData = reactionsRes.success ? reactionsRes.data : [];
                    const serviceDisplayName = (s.name || '').toLowerCase();

                    const filteredTemplates = (Array.isArray(tplResponse.data) ? tplResponse.data : [])
                        .filter((t: any) =>
                            t.services && (
                                t.services.some((srv: string) => srv.toLowerCase() === serviceName) ||
                                t.services.some((srv: string) => srv.toLowerCase() === serviceDisplayName)
                            )
                        )
                        .map((template: any) => {
                            const actionInfo = actionsData.find((a: any) => a.id === template.action_id);
                            const reactionInfo = reactionsData.find((r: any) => r.id === template.reaction_id);

                            const actionServiceKey = template.services?.[0];
                            const reactionServiceKey = template.services?.[1];

                            const actionServiceInfo = allServices.find((s: any) =>
                                (s.service || '').toLowerCase() === (actionServiceKey || '').toLowerCase()
                            );
                            const reactionServiceInfo = allServices.find((s: any) =>
                                (s.service || '').toLowerCase() === (reactionServiceKey || '').toLowerCase()
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
                    setTemplates(filteredTemplates);
                }
            }
        } catch (error) {
            console.error("Error fetching service details:", error);
            Alert.alert("Erreur", "Impossible de charger les détails du service.");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh when returning from OAuth WebView
    useFocusEffect(
        useCallback(() => {
            // Refresh data when screen comes into focus
            fetchData();
        }, [fetchData])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    const handleConnection = async () => {
        if (!service) return;

        if (!service.connection_info) {
            const userID = await authService.getUserID();
            if (userID) {
                const authUrl = `${API_URL}/auth/${service.service.toLowerCase()}?userId=${userID}&plateforme=mobile`;
                router.push({
                    pathname: '/auth-webview',
                    params: { url: authUrl }
                } as any);
            } else {
                Alert.alert('Désolé', 'La connexion automatique pour ce service n\'est pas encore disponible.');
            }
            return;
        }

        Alert.alert(
            "Déconnexion",
            `Voulez-vous vraiment vous déconnecter de ${service.name} ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnecter",
                    style: "destructive",
                    onPress: async () => {
                        const res = await authService.disconnectService(service.service);
                        if (res.success) {
                            setService((prev: any) => ({ ...prev, connection_info: false }));
                            Alert.alert("Succès", `Déconnecté de ${service.name}`);
                        } else {
                            Alert.alert("Erreur", "Échec de la déconnexion");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading && !refreshing) {
        return (
            <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <ActivityIndicator size="large" color="#6200EE" />
            </SafeAreaView>
        );
    }

    if (!service) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <BackButton />
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]} numberOfLines={1}>
                    {service.name}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6200EE" />}
            >
                <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                    <View style={styles.serviceHeader}>
                        <View style={[styles.logoContainer, { backgroundColor: service.color + '10' }]}>
                            <Image source={{ uri: service.logo }} style={styles.logo} contentFit="contain" />
                        </View>
                        <View style={styles.serviceInfo}>
                            <Text style={[styles.serviceName, { color: isDark ? '#FFF' : '#000' }]}>{service.name}</Text>
                            {!authService.needsAuth(service.service) ? (
                                <View style={[styles.statusBadge, { backgroundColor: '#E3F2FD' }]}>
                                    <Text style={[styles.statusText, { color: '#1976D2' }]}>Service Public</Text>
                                </View>
                            ) : (
                                <View style={[styles.statusBadge, { backgroundColor: service.connection_info ? '#E8F5E9' : '#FFEBEE' }]}>
                                    <Text style={[styles.statusText, { color: service.connection_info ? '#2E7D32' : '#C62828' }]}>
                                        {service.connection_info ? 'Connecté' : 'Déconnecté'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Text style={[styles.description, { color: isDark ? '#BBB' : '#666' }]}>
                        {service.description || "Aucune description disponible pour ce service."}
                    </Text>

                    {authService.needsAuth(service.service) && (
                        <Button
                            title={service.connection_info ? "Se déconnecter" : "Se connecter"}
                            onPress={handleConnection}
                            variant={service.connection_info ? "secondary" : "primary"}
                            style={styles.connectButton}
                        />
                    )}

                    <Button
                        title="Créer une AREA personnalisée"
                        onPress={() => router.push({ pathname: '/create', params: { serviceId: service.id } } as any)}
                        variant="outline"
                        isLoading={false}
                        disabled={authService.needsAuth(service.service) && !service.connection_info}
                    />
                </View>

                {templates.length > 0 && (
                    <View style={styles.templatesSection}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>
                            Modèles disponibles ({templates.length})
                        </Text>

                        {templates.map((template: Template) => (
                            <TouchableOpacity
                                key={template.id}
                                style={[styles.templateCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderLeftColor: template.color }]}
                                onPress={() => {
                                    if (authService.needsAuth(service.service) && !service.connection_info) {
                                        Alert.alert("Connexion requise", `Veuillez vous connecter à ${service.name} pour utiliser ce modèle.`);
                                        return;
                                    }
                                    router.push(`/template/${template.id}/use` as any);
                                }}
                            >
                                <View style={styles.templateHeader}>
                                    <View style={styles.serviceRow}>
                                        {template.action_name?.logo ? <Image source={{ uri: template.action_name.logo }} style={styles.miniLogo} contentFit="contain" /> : null}
                                        <IconSymbol name="arrow.right" size={14} color={isDark ? '#BBB' : '#666'} style={{ marginHorizontal: 6 }} />
                                        {template.reaction_name?.logo ? <Image source={{ uri: template.reaction_name.logo }} style={styles.miniLogo} contentFit="contain" /> : null}
                                    </View>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Modèle</Text>
                                    </View>
                                </View>
                                <Text style={[styles.templateName, { color: isDark ? '#FFF' : '#333' }]}>{template.name}</Text>
                                <Text style={[styles.templateDesc, { color: isDark ? '#BBB' : '#666' }]} numberOfLines={3}>
                                    {template.description}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 24,
    },
    serviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    logo: {
        width: 40,
        height: 40,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    connectButton: {
        marginBottom: 12,
    },
    templatesSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    templateCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    templateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    miniLogo: {
        width: 20,
        height: 20,
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    templateDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
});
