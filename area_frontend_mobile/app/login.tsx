import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { BackButton } from '@/components/BackButton';
import authService from '@/services/authService';
import { loginValidationSchema } from '@/utils/validationSchemas';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = async () => {
        try {
            await loginValidationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err: any) {
            const newErrors: { [key: string]: string } = {};
            err.inner.forEach((error: any) => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        setIsLoading(true);

        const result = await authService.login(formData);

        setIsLoading(false);
        if (result.success) {
            // Navigate to the main app (e.g., tabs)
            router.replace('/(tabs)');
        } else {
            console.log('Login error:', result.error);
            if (result.error?.errors) {
                // Map backend errors to fields
                const newErrors: { [key: string]: string } = {};
                // The backend likely returns { errors: { email: "message", password: "message" } }
                Object.keys(result.error.errors).forEach(key => {
                    // Start simple: map key to message. Adjust if value is array or other object.
                    // Web logic uses: Object.keys(result.error.errors).forEach(field => fieldErrors[field] = true)
                    // If web just sets boolean, it relies on generic error or existing field state?
                    // Let's assume backend sends { email: "Invalid", ... } or we just set a generic message on that field.
                    // For mobile Input component, we need a string error message.
                    const errVal = result.error!.errors[key];
                    newErrors[key] = typeof errVal === 'string' ? errVal : 'Erreur';
                });
                setErrors(newErrors);
            } else {
                Alert.alert('Erreur', result.error?.message || 'Erreur de connexion');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}
        >
            <BackButton color={isDark ? 'white' : 'black'} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Connexion</Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#BBB' : '#666' }]}>
                        Bienvenue ! Connectez-vous à votre compte
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChangeText={(text) => handleChange('email', text)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <Input
                        label="Mot de passe"
                        placeholder="••••••••"
                        value={formData.password}
                        onChangeText={(text) => handleChange('password', text)}
                        secureTextEntry
                        error={errors.password}
                    />

                    <Button
                        title="Se connecter"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        style={{ marginTop: 24 }}
                    />

                    <Button
                        title="S'inscrire"
                        onPress={() => router.push('/register')}
                        variant="outline"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
});
