import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import authService, { Service } from '@/services/authService';
import { API_URL } from '@/services/api';
import { ServiceCard } from '@/components/ServiceCard';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ServicesScreen() {
    const [services, setServices] = useState<Service[]>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [error, setError] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        const userID = await authService.getUserID();
        if (userID) {
            const user = await authService.getUserInfo(userID);
            if (user && !user.error) {
                setUserInfo(user);
            }
        }

        try {
            const result = await authService.getServices();
            if (Array.isArray(result)) {
                setServices(result);
            } else if (result && result.data && Array.isArray(result.data)) {
                // Handle case where backend returns { data: [...] }
                setServices(result.data);
            } else if (result && result.message) {
                setError(result.message);
            } else {
                // Fallback or empty
                setServices([]);
            }
        } catch (err) {
            setError('Une erreur inattendue est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const getIsConnected = (serviceName: string) => {
        if (!userInfo || !userInfo.info) return false;
        const normalizedName = serviceName.charAt(0).toLowerCase() + serviceName.slice(1);
        return userInfo.info[normalizedName]?.isConnected || false;
    };

    const handlePress = (service: Service) => {
        router.push(`/services/${service.id}` as any);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <ActivityIndicator size="large" color={isDark ? '#FFF' : '#000'} />
                <Text style={[styles.loadingText, { color: isDark ? '#BBB' : '#666' }]}>Chargement des services...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                    Services
                </Text>
                <Text style={[styles.subtitle, { color: isDark ? '#BBB' : '#666' }]}>
                    Connectez vos applications préférées
                </Text>
            </View>

            <FlatList
                data={services}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ServiceCard
                        service={item}
                        isConnected={getIsConnected(item.service)}
                        onPress={handlePress}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
        padding: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    }
});
