import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/Button';

export default function Index() {
    const router = useRouter();

    const handleRegister = () => {
        console.log("Navigate to register");
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>ACTION-REACTION</Text>
                    <Text style={styles.subtitle}>
                        Automatisez vos services en toute simplicité
                    </Text>

                    <Button
                        variant="primary"
                        onPress={() => router.push("/register" as Href)}
                        title="S'inscrire"
                    />

                    <Button
                        variant="outline"
                        onPress={() => router.push("/login" as Href)}
                        style={{ marginTop: 16, borderColor: 'white' }}
                        textStyle={{ color: 'white' }}
                        title="Se connecter"
                    />
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: 'white',
        marginBottom: 24,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.95,
        marginBottom: 48,
        fontWeight: '300',
        textAlign: 'center',
    },
});
