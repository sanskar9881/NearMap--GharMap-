import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export function VerifiedBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
  text: { color: C.bg, fontSize: 12, fontWeight: 'bold' },
});
