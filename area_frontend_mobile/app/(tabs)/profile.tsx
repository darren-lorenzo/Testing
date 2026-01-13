import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import authService from '@/services/authService';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [user, setUser] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [])
    );

    const loadUser = async () => {
        const userID = await authService.getUserID();
        if (!userID) {
            router.replace('/login');
            return;
        }
        const currentUser = await authService.getUserInfo(userID);
        setUser(currentUser);
    };

    const handleLogout = async () => {
        await authService.logout();
        router.replace('/login');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={[styles.logoutText]}>{"Se déconnecter de l'application"}</Text>

                    </View>
                    <Text style={[styles.name, { color: isDark ? '#FFF' : '#000' }]}>{user?.username || user?.name || 'Utilisateur'}</Text>
                    <Text style={[styles.email, { color: isDark ? '#BBB' : '#666' }]}>{user?.email || 'email@example.com'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Informations personnelles</Text>

                    <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                        <Text style={[styles.label, { color: isDark ? '#BBB' : '#666' }]}>Nom d&apos;utilisateur</Text>

                        <TextInput
                            style={[styles.input, { color: isDark ? '#FFF' : '#000' }]}
                            value={user?.username || user?.name}
                            editable={false}
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                        <Text style={[styles.label, { color: isDark ? '#BBB' : '#666' }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { color: isDark ? '#FFF' : '#000' }]}
                            value={user?.email}
                            editable={false}
                        />
                    </View>
                </View>

                <Button
                    title="Déconnexion"
                    onPress={handleLogout}
                    style={{ backgroundColor: '#FF5252', marginTop: 32 }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(128,128,128,0.2)',
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
    },
});
