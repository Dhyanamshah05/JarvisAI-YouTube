import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface VoiceWaveformProps {
  isActive: boolean;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive }) => {
  const bars = useRef<Animated.Value[]>([]).current;
  
  // Initialize animated values for bars
  if (bars.length === 0) {
    for (let i = 0; i < 8; i++) {
      bars[i] = new Animated.Value(0);
    }
  }

  useEffect(() => {
    if (isActive) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isActive]);

  const startAnimation = () => {
    const animations = bars.map((bar, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 0.1,
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
        ])
      );
    });

    animations.forEach(animation => animation.start());
  };

  const stopAnimation = () => {
    bars.forEach(bar => {
      Animated.timing(bar, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: bar.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 40],
              }),
              opacity: bar.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 50,
    marginBottom: 20,
  },
  bar: {
    width: 4,
    backgroundColor: '#00d4ff',
    marginHorizontal: 2,
    borderRadius: 2,
    minHeight: 4,
  },
});

export default VoiceWaveform;