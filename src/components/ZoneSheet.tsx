import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export function ZoneSheet() {
  return (
    <View style={styles.sheet}>
      <Text style={styles.text}>Zone Sheet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: 16, backgroundColor: C.s1 },
  text: { color: C.t1 },
});
