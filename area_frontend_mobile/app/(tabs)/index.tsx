import React, { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import authService, { Service } from '@/services/authService';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useArea } from '@/context/AreaContext';

export default function DashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [userName, setUserName] = useState('Utilisateur');
    const [services, setServices] = useState<Service[]>([]);
    const [connectedServicesCount, setConnectedServicesCount] = useState(0);
    const { areas } = useArea();
    const areasCount = areas.length;

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        const userID = await authService.getUserID();
        console.log(userID);
        if (userID) {
            const user = await authService.getUserInfo(userID);
            console.log(user);
            if (user) {
                setUserName(user.username || user.name || 'Utilisateur');
            }
        }

        const result = await authService.getServices();
        if (Array.isArray(result)) {
            setServices(result);
        } else if (result && result.data && Array.isArray(result.data)) {
            setServices(result.data);
            setConnectedServicesCount(result.data.filter((s: Service) => s.Is_connected).length);
        } else {
            // Fallback
            setServices([]);
        }
    };

    const MenuItem = ({ title, icon, count, color, route }: any) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}
            onPress={() => route && router.push(route)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <IconSymbol name={icon} size={24} color={color} />
                </View>
                {count !== undefined && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{count}</Text>
                    </View>
                )}
            </View>
            <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{title}</Text>
        </TouchableOpacity>
    );

    const ServiceItem = ({ service }: { service: Service }) => (
        <TouchableOpacity
            style={[styles.serviceItem, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}
            onPress={() => router.push('/services')}
            activeOpacity={0.7}
        >
            <Image source={{ uri: service.logo }} style={styles.serviceLogo} contentFit="contain" />
            <Text style={[styles.serviceName, { color: isDark ? '#FFF' : '#333' }]} numberOfLines={1}>{service.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: isDark ? '#BBB' : '#666' }]}>Bonjour,</Text>
                    <Text style={[styles.username, { color: isDark ? '#FFF' : '#000' }]}>{userName}</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => router.push('/profile' as any)}
                >
                    <IconSymbol name="house.fill" size={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Aperçu</Text>

                <View style={styles.grid}>
                    <MenuItem
                        title="Mes Services"
                        icon="list.bullet"
                        count={connectedServicesCount}
                        color="#2196F3"
                        route="/services?filter=connected"
                    />
                    <MenuItem
                        title="Mes AREA"
                        icon="paperplane.fill"
                        count={areasCount}
                        color="#9C27B0"
                        route="/areas"
                    />
                </View>

                <View style={[styles.banner, { backgroundColor: '#6200EE' }]}>
                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerTitle}>Nouvelle Automatisation</Text>
                        <Text style={styles.bannerText}>Créez des flux de travail puissants en quelques clics.</Text>
                        <TouchableOpacity
                            style={styles.bannerButton}
                            onPress={() => router.push('/create' as any)}
                        >
                            <Text style={styles.bannerButtonText}>Créer maintenant</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333', marginTop: 8 }]}>Services Disponibles</Text>
                    <View style={styles.servicesGrid}>
                        {services.map((item) => (
                            <ServiceItem key={item.id} service={item} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(128,128,128,0.1)',
    },
    content: {
        padding: 24,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    card: {
        flex: 1,
        minWidth: '45%',
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
    },
    badge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    banner: {
        borderRadius: 16,
        padding: 24,
        marginTop: 8,
        marginBottom: 24,
    },
    bannerContent: {
        alignItems: 'flex-start',
    },
    bannerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bannerText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    bannerButton: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    bannerButtonText: {
        color: '#6200EE',
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    serviceItem: {
        width: '30.5%',
        aspectRatio: 1,
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    serviceLogo: {
        width: 32,
        height: 32,
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
});
