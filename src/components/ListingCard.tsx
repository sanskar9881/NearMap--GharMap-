import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export function ListingCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>Listing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, backgroundColor: C.s2, borderRadius: 8, marginBottom: 8 },
  text: { color: C.t1 },
});
