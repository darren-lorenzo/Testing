import React from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: isDark ? '#E0E0E0' : '#333' }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: isDark ? '#333' : '#FFF',
                        color: isDark ? '#FFF' : '#000',
                        borderColor: error ? '#FF5252' : isDark ? '#555' : '#DDD'
                    },
                    style
                ]}
                placeholderTextColor={isDark ? '#AAA' : '#888'}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    errorText: {
        color: '#FF5252',
        fontSize: 12,
        marginTop: 4,
    },
});
