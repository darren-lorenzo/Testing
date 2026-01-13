import React from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Service } from '@/services/authService';
import authService from '@/services/authService';
interface ServiceCardProps {
    service: Service;
    onPress?: (service: Service) => void;
    isConnected?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress, isConnected }) => {
    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: service.color }]}
            onPress={() => onPress && onPress(service)}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: service.logo }}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </View>

                <View style={styles.info}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{service.name}</Text>
                        {!authService.needsAuth(service.service) ? (
                            <View style={[styles.connectedBadge, { backgroundColor: '#E3F2FD', borderColor: '#2196F3' }]}>
                                <Text style={[styles.connectedText, { color: '#1976D2' }]}>Service Public</Text>
                            </View>
                        ) : isConnected ? (
                            <View style={[styles.connectedBadge, { borderColor: service.color + '40', backgroundColor: service.color + '10' }]}>
                                <Text style={[styles.connectedText, { color: service.color }]}>Connecté</Text>
                            </View>
                        ) : (
                            <View style={[styles.connectedBadge, styles.disconnectedBadge]}>
                                <Text style={[styles.connectedText, styles.disconnectedText]}>Déconnecté</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderLeftWidth: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    logo: {
        width: 32,
        height: 32,
    },
    info: {
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    connectedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    disconnectedBadge: {
        backgroundColor: '#FFEBEE',
        borderColor: '#F44336',
    },
    connectedText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    disconnectedText: {
        color: '#C62828',
    },
});
