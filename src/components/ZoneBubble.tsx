import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export function ZoneBubble() {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>Zone</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 8, backgroundColor: C.s2, borderRadius: 8 },
  text: { color: C.t1, fontSize: 12 },
});
