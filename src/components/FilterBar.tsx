import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export function FilterBar() {
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>Filters</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { padding: 12, backgroundColor: C.s2, flexDirection: 'row' },
  text: { color: C.t1 },
});
