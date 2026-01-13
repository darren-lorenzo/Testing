import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AuthWebViewScreen() {
    const { url } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isLoading, setIsLoading] = useState(true);

    const handleNavigationStateChange = (navState: any) => {
        const { url: currentUrl } = navState;

        if (currentUrl.includes('status=success') || currentUrl.includes('status=failed')) {
            setTimeout(() => {
                router.back();
            }, 0);
            return;
        }

        if (currentUrl.includes(':8081/services')) {
            setTimeout(() => {
                router.back();
            }, 0);
            return;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
            <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <IconSymbol name="plus" size={24} color={isDark ? '#FFF' : '#000'} style={{ transform: [{ rotate: '45deg' }] }} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Connexion Service</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.webviewContainer}>
                <WebView
                    source={{ uri: url as string }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#6200EE" />
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    webviewContainer: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});
