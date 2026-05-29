// ============================================================
// src/components/UI.tsx  —  Shared design system components
// ============================================================
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';

// ── Screen Header with back button ──────────────────────────
export function ScreenHeader({
  title, subtitle, showBack = true, right,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const nav = useNavigation();
  const { theme: T } = useTheme();
  return (
    <View style={[hStyles.wrap, { backgroundColor: T.surface1, borderBottomColor: T.border1 }]}>
      <View style={hStyles.left}>
        {showBack && (
          <TouchableOpacity
            style={[hStyles.backBtn, { backgroundColor: T.surface3, borderColor: T.border1 }]}
            onPress={() => nav.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: 18, color: T.text2 }}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={[TYPE.h4, { color: T.text1 }]}>{title}</Text>
          {subtitle && <Text style={[TYPE.xs, { color: T.text3, marginTop: 2 }]}>{subtitle}</Text>}
        </View>
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

const hStyles = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.lg, paddingTop: 54, paddingBottom: S.md, borderBottomWidth: 0.5 },
  left:    { flexDirection: 'row', alignItems: 'center', gap: S.md },
  backBtn: { width: 36, height: 36, borderRadius: R.md, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
});

// ── Primary Button ───────────────────────────────────────────
export function PrimaryButton({
  label, onPress, loading, disabled, icon, style,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
}) {
  const { theme: T } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        style={[bStyles.btn, { backgroundColor: disabled ? T.surface4 : T.lime, opacity: disabled ? 0.6 : 1 }]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#09090E" />
        ) : (
          <Text style={[bStyles.label, { color: disabled ? T.text3 : '#09090E' }]}>
            {icon ? `${icon}  ` : ''}{label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Ghost Button ─────────────────────────────────────────────
export function GhostButton({
  label, onPress, icon, style,
}: {
  label: string;
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
}) {
  const { theme: T } = useTheme();
  return (
    <TouchableOpacity
      style={[bStyles.ghost, { backgroundColor: T.surface3, borderColor: T.border2 }, style]}
      onPress={onPress}
    >
      <Text style={[bStyles.ghostLabel, { color: T.text1 }]}>
        {icon ? `${icon}  ` : ''}{label}
      </Text>
    </TouchableOpacity>
  );
}

const bStyles = StyleSheet.create({
  btn:        { borderRadius: R.lg, padding: S.lg, alignItems: 'center', justifyContent: 'center' },
  label:      { ...TYPE.h4, fontWeight: '800' },
  ghost:      { borderRadius: R.lg, padding: S.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  ghostLabel: { ...TYPE.h4 },
});

// ── Badge ────────────────────────────────────────────────────
export function Badge({
  label, color, bg, icon,
}: {
  label: string; color: string; bg: string; icon?: string;
}) {
  return (
    <View style={[badStyles.wrap, { backgroundColor: bg }]}>
      {icon && <Text style={{ fontSize: 10 }}>{icon}</Text>}
      <Text style={[badStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: R.full, paddingHorizontal: S.sm + 2, paddingVertical: 3 },
  text: { ...TYPE.label },
});

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ w, h, r, style }: { w?: number | string; h: number; r?: number; style?: ViewStyle }) {
  const { theme: T } = useTheme();
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[
      { width: w ?? '100%', height: h, borderRadius: r ?? R.md, backgroundColor: T.surface4, opacity: anim },
      style,
    ]} />
  );
}

// ── Section Header ───────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: {
  title: string; action?: string; onAction?: () => void;
}) {
  const { theme: T } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.md }}>
      <Text style={[TYPE.label, { color: T.text3 }]}>{title.toUpperCase()}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[TYPE.xs, { color: T.lime }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Divider ──────────────────────────────────────────────────
export function Divider({ style }: { style?: ViewStyle }) {
  const { theme: T } = useTheme();
  return <View style={[{ height: 0.5, backgroundColor: T.border1 }, style]} />;
}

// ── Chip ─────────────────────────────────────────────────────
export function Chip({
  label, active, onPress, icon,
}: {
  label: string; active: boolean; onPress: () => void; icon?: string;
}) {
  const { theme: T } = useTheme();
  return (
    <TouchableOpacity
      style={[
        chipStyles.wrap,
        {
          backgroundColor: active ? T.lime : T.surface3,
          borderColor: active ? T.lime : T.border1,
        },
      ]}
      onPress={onPress}
    >
      {icon && <Text style={{ fontSize: 12 }}>{icon}</Text>}
      <Text style={[chipStyles.text, { color: active ? '#09090E' : T.text2 }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: R.full, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 0.5 },
  text: { ...TYPE.xs, fontWeight: '700' },
});

// ── Pulse dot (live indicator) ────────────────────────────────
export function PulseDot({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.8, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        position: 'absolute', width: 10, height: 10, borderRadius: 5,
        backgroundColor: color, opacity: 0.3, transform: [{ scale: anim }],
      }} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
    </View>
  );
}

// ── Trust Score Ring ─────────────────────────────────────────
export function TrustScore({ score, size = 52 }: { score: number; size?: number }) {
  const { theme: T } = useTheme();
  const color = score >= 80 ? T.success : score >= 50 ? T.amber : T.rose;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: T.surface3, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color }}>
      <Text style={{ fontSize: size * 0.28, fontWeight: '900', color }}>{score}</Text>
      <Text style={{ fontSize: size * 0.18, color: T.text3, fontWeight: '600' }}>/ 100</Text>
    </View>
  );
}
