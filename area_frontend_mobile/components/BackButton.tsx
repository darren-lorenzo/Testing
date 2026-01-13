import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackButtonProps {
    color?: string;
}

export const BackButton = ({ color = 'black' }: BackButtonProps) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handlePress = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { top: Math.max(insets.top, 16) }]}
            onPress={handlePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)', // Subtle background for better visibility
    }
});
