import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

WebBrowser.maybeCompleteAuthSession();

export default function Login({navigation} : any) {

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '70301397536-34cl9jufnru6flrpvp7qbet92k5rrhrv.apps.googleusercontent.com',
        iosClientId: '70301397536-cp0dp9ba5odcosuo8qr4bn0bscplt60o.apps.googleusercontent.com',
    });

    useEffect(() => {
        handleSignInResponse();
    }, [response]);

    async function handleSignInResponse() {
        if (response?.type === 'success') {
            const { authentication } = response;
            
            try {
                // Gọi Google User Info API để lấy thông tin người dùng
                // API này yêu cầu access token để xác thực và trả về thông tin cơ bản của tài khoản Google
                const userInfoResponse = await fetch(
                    'https://www.googleapis.com/userinfo/v2/me', // API endpoint của Google để lấy thông tin user profile
                    {
                        headers: { Authorization: `Bearer ${authentication?.accessToken}` }, // Gửi access token trong header để xác thực
                    }
                );
                
                // Parse JSON response chứa thông tin như email, name, picture,...
                const user = await userInfoResponse.json();
                navigation.navigate('Home');
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await promptAsync();
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };

    return (
        <LinearGradient
            colors={['#FFD93D', '#FF9F29', '#FF8E3C']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={styles.title}>Find Your Perfect Match</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                    
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={handleGoogleLogin}
                        disabled={!request}
                    >
                        <Text style={styles.buttonText}>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('PhoneLogin')}
                    >
                        <Text style={styles.buttonText}>
                            Continue with Phone Number
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.terms}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 40,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 25,
        width: '100%',
        maxWidth: 300,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#FF8E3C',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    terms: {
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    }
});