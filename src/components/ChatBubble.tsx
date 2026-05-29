import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export function ChatBubble({ message }: { message: string }) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, backgroundColor: C.s2, borderRadius: 12, marginBottom: 8 },
  text: { color: C.t1 },
});
