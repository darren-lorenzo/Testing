import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { BackButton } from '@/components/BackButton';
import authService from '@/services/authService';
import { loginValidationSchema, registerValidationSchema } from '@/utils/validationSchemas';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
            await registerValidationSchema.validate(formData, { abortEarly: false });
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

        const result = await authService.register({
            name: formData.username,
            email: formData.email,
            password: formData.password
        });

        setIsLoading(false);

        if (result.success) {
            router.replace('/login');
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
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Inscription</Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#BBB' : '#666' }]}>
                        Créez votre compte pour commencer
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Nom d'utilisateur"
                        placeholder="pseudo"
                        value={formData.username}
                        onChangeText={(text) => handleChange('username', text)}
                        autoCapitalize="none"
                        error={errors.username}
                    />

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

                    <Input
                        label="Confirmer le mot de passe"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    <Button
                        title="S'inscrire"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        style={{ marginTop: 24 }}
                    />

                    <Button
                        title="J'ai déjà un compte"
                        onPress={() => router.push('/login')}
                        variant="outline"
                        style={{ marginTop: 12 }}
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
        marginTop: 40,
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
