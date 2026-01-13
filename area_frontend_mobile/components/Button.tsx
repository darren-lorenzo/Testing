import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({ title, onPress, isLoading, disabled, variant = 'primary', style, textStyle }: ButtonProps) {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'secondary': return '#6c757d';
            case 'outline': return 'transparent';
            default: return '#007AFF';
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outline': return '#007AFF';
            default: return '#FFFFFF';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    borderColor: variant === 'outline' ? '#007AFF' : undefined,
                    opacity: (isLoading || disabled) ? 0.5 : 1
                },
                style
            ]}
            onPress={onPress}
            disabled={isLoading || disabled}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
