import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = width * 1.3;

const MatchingCardSkeleton = () => {
    const animatedValue = new Animated.Value(0);

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.card}>
            <Animated.View style={[styles.image, { opacity }]} />
            <View style={styles.infoContainer}>
                <Animated.View style={[styles.nameSkeleton, { opacity }]} />
                <Animated.View style={[styles.bioSkeleton, { opacity }]} />
                <View style={styles.interestContainer}>
                    {[1, 2, 3].map((_, index) => (
                        <Animated.View
                            key={index}
                            style={[styles.interestSkeleton, { opacity }]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '75%',
        backgroundColor: COLORS.border,
    },
    infoContainer: {
        padding: SIZES.medium,
    },
    nameSkeleton: {
        width: '60%',
        height: 24,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        marginBottom: SIZES.small,
    },
    bioSkeleton: {
        width: '80%',
        height: 16,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        marginBottom: SIZES.medium,
    },
    interestContainer: {
        flexDirection: 'row',
        gap: SIZES.small,
    },
    interestSkeleton: {
        width: 80,
        height: 30,
        backgroundColor: COLORS.border,
        borderRadius: 15,
    },
});

export default MatchingCardSkeleton;