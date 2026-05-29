// ============================================================
// src/components/PropertyCard.tsx
// ============================================================
import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { Badge, PulseDot } from './UI';

export interface PropertyData {
  id: string;
  type: 'rent' | 'buy' | 'room' | 'pg';
  title: string;
  price: number;
  area: string;
  locality: string;
  bhk: string;
  sqft: number;
  floor: string;
  furnish: string;
  emoji: string;
  verified: boolean;
  saved: boolean;
  tags: string[];
  availFrom: string;
  ownerInit: string;
  ownerColor: string;
  ownerName: string;
  views: number;
  requests: number;
  daysAgo: number;
  ownerOnline?: boolean;
  responseRate?: number;
  womenSafe?: boolean;
  boosted?: boolean;
}

const TYPE_CFG: Record<string, [string, string]> = {
  rent:     ['#2DD4BF', 'rgba(45,212,191,0.14)'],
  buy:      ['#8B7FEE', 'rgba(139,127,238,0.14)'],
  room:     ['#FFA820', 'rgba(255,168,32,0.14)'],
  pg:       ['#FF5C7A', 'rgba(255,92,122,0.14)'],
  flatmate: ['#FFA820', 'rgba(255,168,32,0.14)'],
};

function fmt(price: number, type: string): string {
  if (type === 'buy') return price >= 10000000 ? `₹${(price/10000000).toFixed(1)}Cr` : `₹${(price/100000).toFixed(0)}L`;
  return price >= 1000 ? `₹${(price/1000).toFixed(0)}K/mo` : `₹${price}/mo`;
}

export default function PropertyCard({
  item, onPress, onSave, compact = false,
}: {
  item: PropertyData;
  onPress: () => void;
  onSave?: () => void;
  compact?: boolean;
}) {
  const { theme: T } = useTheme();
  const [saved, setSaved] = useState(item.saved);
  const scale  = useRef(new Animated.Value(1)).current;
  const saveS  = useRef(new Animated.Value(1)).current;
  const [color, bg] = TYPE_CFG[item.type] ?? TYPE_CFG.rent;

  const pin  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const pout = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  const tap = () => {
    Animated.sequence([
      Animated.spring(saveS, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(saveS, { toValue: 1,   useNativeDriver: true }),
    ]).start();
    setSaved(s => !s);
    onSave?.();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: T.surface2,
            borderColor: item.boosted ? `${T.lime}40` : T.border1,
            borderWidth: item.boosted ? 1 : 0.5,
          },
        ]}
        onPress={onPress}
        onPressIn={pin}
        onPressOut={pout}
        activeOpacity={1}
      >
        {/* Boosted glow strip */}
        {item.boosted && (
          <View style={[styles.boostStrip, { backgroundColor: `${T.lime}18` }]}>
            <Text style={[TYPE.label, { color: T.lime }]}>⚡ FEATURED</Text>
          </View>
        )}

        {/* Top row */}
        <View style={styles.topRow}>
          {/* Thumb */}
          <View style={[styles.thumb, { backgroundColor: T.surface4 }]}>
            <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
            {item.womenSafe && (
              <View style={[styles.womenBadge, { backgroundColor: '#FF5C7A22' }]}>
                <Text style={{ fontSize: 10 }}>🔴</Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            {/* Tags row */}
            <View style={styles.tagsRow}>
              <Badge label={item.type.toUpperCase()} color={color} bg={bg} />
              {item.verified && <Badge label="✓ Verified" color={T.lime} bg={`${T.lime}14`} />}
              {item.womenSafe && <Badge label="Women Safe" color="#FF5C7A" bg="#FF5C7A14" />}
            </View>

            {/* Title */}
            <Text style={[TYPE.h4, { color: T.text1, marginTop: 5, marginBottom: 3 }]} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Location */}
            <Text style={[TYPE.xs, { color: T.text3 }]} numberOfLines={1}>
              📍 {item.area}  ·  {item.locality}
            </Text>
          </View>

          {/* Save */}
          <Animated.View style={{ transform: [{ scale: saveS }] }}>
            <TouchableOpacity style={styles.saveBtn} onPress={tap} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 20 }}>{saved ? '🔖' : '🤍'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Stats pills */}
        <View style={styles.pillsRow}>
          {[item.bhk, item.sqft > 0 ? `${item.sqft}sqft` : null, item.furnish, `Fl ${item.floor}`]
            .filter(Boolean)
            .map(v => (
              <View key={v!} style={[styles.pill, { backgroundColor: T.surface4, borderColor: T.border1 }]}>
                <Text style={[TYPE.xs, { color: T.text2 }]}>{v}</Text>
              </View>
            ))}
        </View>

        {/* Amenities */}
        {!compact && (
          <View style={styles.ameRow}>
            {item.tags.slice(0, 4).map(t => (
              <View key={t} style={[styles.ameTag, { backgroundColor: `${T.teal}10`, borderColor: `${T.teal}28` }]}>
                <Text style={[TYPE.xs, { color: T.teal }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom row */}
        <View style={[styles.bottomRow, { borderTopColor: T.border1 }]}>
          {/* Owner + live signals */}
          <View style={styles.ownerSide}>
            <View style={[styles.ownerAvt, { backgroundColor: item.ownerColor }]}>
              <Text style={styles.ownerInit}>{item.ownerInit}</Text>
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={[TYPE.xs, { color: T.text1, fontWeight: '600' }]}>{item.ownerName}</Text>
                {item.ownerOnline && <PulseDot color={T.success} />}
              </View>
              <Text style={[TYPE.label, { color: T.text3, marginTop: 2 }]}>
                👁 {item.views}  ·  {item.daysAgo === 0 ? 'Today' : `${item.daysAgo}d ago`}
                {item.responseRate && `  ·  ${item.responseRate}% reply`}
              </Text>
            </View>
          </View>

          {/* Price + CTA */}
          <View style={styles.priceSide}>
            <Text style={[TYPE.h3, { color: T.amber }]}>{fmt(item.price, item.type)}</Text>
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: T.lime }]}
              onPress={onPress}
            >
              <Text style={[TYPE.xs, { color: '#09090E', fontWeight: '800' }]}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card:       { borderRadius: R.xl, padding: S.lg, marginBottom: S.md, overflow: 'hidden' },
  boostStrip: { marginHorizontal: -S.lg, marginTop: -S.lg, marginBottom: S.md, paddingHorizontal: S.lg, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 6 },
  topRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: S.md },
  thumb:      { width: 76, height: 76, borderRadius: R.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' },
  womenBadge: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tagsRow:    { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  saveBtn:    { padding: S.xs },
  pillsRow:   { flexDirection: 'row', gap: 6, marginBottom: S.sm, flexWrap: 'wrap' },
  pill:       { borderRadius: R.sm, paddingHorizontal: S.sm + 2, paddingVertical: 4, borderWidth: 0.5 },
  ameRow:     { flexDirection: 'row', gap: 6, marginBottom: S.md, flexWrap: 'wrap' },
  ameTag:     { borderRadius: R.sm, paddingHorizontal: S.sm + 2, paddingVertical: 4, borderWidth: 0.5 },
  bottomRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 0.5, paddingTop: S.md },
  ownerSide:  { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  ownerAvt:   { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  ownerInit:  { fontSize: 12, fontWeight: '900', color: '#09090E' },
  priceSide:  { alignItems: 'flex-end', gap: 6 },
  cta:        { borderRadius: R.md, paddingHorizontal: S.lg, paddingVertical: 7 },
});
