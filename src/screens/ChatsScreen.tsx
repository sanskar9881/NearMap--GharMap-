import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💬 Chats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, color: C.t1 },
});
