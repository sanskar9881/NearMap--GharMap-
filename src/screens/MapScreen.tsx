// ============================================================
// src/screens/MapScreen.tsx  —  Premium Map Experience
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  ScrollView, Dimensions, Alert,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { ZONE_COLORS, TYPE, S, R } from '../theme/index';
import { PUNE_ZONES } from '../data/zones';
import { Chip, PulseDot, Badge } from '../components/UI';

const { width, height } = Dimensions.get('window');

const MAHARASHTRA = { latitude: 19.7515, longitude: 75.7139, latitudeDelta: 5.0, longitudeDelta: 5.0 };
const PUNE        = { latitude: 18.5204, longitude: 73.8567, latitudeDelta: 0.18, longitudeDelta: 0.14 };

const DARK_MAP = [
  { elementType: 'geometry',                  stylers: [{ color: '#090a14' }] },
  { elementType: 'labels.text.fill',          stylers: [{ color: '#3a3d58' }] },
  { elementType: 'labels.text.stroke',        stylers: [{ color: '#08080f' }] },
  { featureType: 'administrative',            elementType: 'geometry', stylers: [{ color: '#18192a' }] },
  { featureType: 'administrative.country',    elementType: 'labels.text.fill', stylers: [{ color: '#55587a' }] },
  { featureType: 'administrative.locality',   elementType: 'labels.text.fill', stylers: [{ color: '#44476a' }] },
  { featureType: 'poi',                       stylers: [{ visibility: 'off' }] },
  { featureType: 'road',                      elementType: 'geometry',        stylers: [{ color: '#181926' }] },
  { featureType: 'road',                      elementType: 'geometry.stroke', stylers: [{ color: '#101120' }] },
  { featureType: 'road.highway',              elementType: 'geometry',        stylers: [{ color: '#20213a' }] },
  { featureType: 'transit',                   stylers: [{ visibility: 'off' }] },
  { featureType: 'water',                     elementType: 'geometry',        stylers: [{ color: '#06080f' }] },
  { featureType: 'landscape',                 elementType: 'geometry',        stylers: [{ color: '#0c0d1c' }] },
];

const LIGHT_MAP = [
  { elementType: 'geometry',                  stylers: [{ color: '#f5f6ff' }] },
  { featureType: 'water',                     elementType: 'geometry', stylers: [{ color: '#c9d8f0' }] },
  { featureType: 'road',                      elementType: 'geometry', stylers: [{ color: '#e8eaff' }] },
  { featureType: 'poi',                       stylers: [{ visibility: 'off' }] },
];

const FILTERS = ['All', 'Rent', 'Buy', 'PG', 'Flatmate'];

// ── Animated Zone Bubble ─────────────────────────────────────
function ZoneBubble({ zone, onPress, colors }: {
  zone: typeof PUNE_ZONES[0];
  onPress: () => void;
  colors: { solid: string; bg: string; border: string };
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const size = Math.min(92, Math.max(58, 50 + zone.propertyCount * 2.4));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const tap = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.88, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={tap} activeOpacity={1}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        {/* Outer pulse ring */}
        <Animated.View style={[
          bStyles.ring,
          {
            width: size + 22, height: size + 22,
            borderRadius: (size + 22) / 2,
            borderColor: colors.solid + '35',
            transform: [{ scale: pulseAnim }],
          },
        ]} />
        {/* Bubble */}
        <View style={[
          bStyles.bubble,
          {
            width: size, height: size, borderRadius: size / 2,
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}>
          <Text style={[bStyles.count, { color: colors.solid }]}>{zone.propertyCount}</Text>
          <Text style={[bStyles.name, { color: colors.solid }]} numberOfLines={1}>
            {zone.name.length > 7 ? zone.name.slice(0, 6) + '…' : zone.name}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const bStyles = StyleSheet.create({
  ring:   { position: 'absolute', borderWidth: 1.5 },
  bubble: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  count:  { fontSize: 18, fontWeight: '900' },
  name:   { fontSize: 9,  fontWeight: '800', marginTop: 1, textAlign: 'center', paddingHorizontal: 4 },
});

// ── Main Screen ───────────────────────────────────────────────
export default function MapScreen() {
  const nav            = useNavigation<any>();
  const { theme: T, isDark } = useTheme();
  const mapRef         = useRef<MapView>(null);

  const [hasLoc,       setHasLoc]       = useState(false);
  const [showPerm,     setShowPerm]     = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedZone, setSelectedZone] = useState<typeof PUNE_ZONES[0] | null>(null);
  const [zoomedIn,     setZoomedIn]     = useState(false);

  const sheetY  = useRef(new Animated.Value(400)).current;
  const permY   = useRef(new Animated.Value(600)).current;
  const permBg  = useRef(new Animated.Value(0)).current;

  const zoneColors = ZONE_COLORS(T);

  useEffect(() => {
    setTimeout(() => {
      setShowPerm(true);
      Animated.parallel([
        Animated.spring(permY,  { toValue: 0,   friction: 14, useNativeDriver: true }),
        Animated.timing(permBg, { toValue: 1,   duration: 300, useNativeDriver: true }),
      ]).start();
    }, 900);
  }, []);

  const requestLoc = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    Animated.parallel([
      Animated.timing(permY,  { toValue: 600, duration: 280, useNativeDriver: true }),
      Animated.timing(permBg, { toValue: 0,   duration: 280, useNativeDriver: true }),
    ]).start(() => setShowPerm(false));

    if (status === 'granted') {
      setHasLoc(true);
      const loc = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion(
        { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.08, longitudeDelta: 0.06 },
        1200
      );
    }
  };

  const skipLoc = () => {
    Animated.parallel([
      Animated.timing(permY,  { toValue: 600, duration: 280, useNativeDriver: true }),
      Animated.timing(permBg, { toValue: 0,   duration: 280, useNativeDriver: true }),
    ]).start(() => { setShowPerm(false); mapRef.current?.animateToRegion(PUNE, 1200); });
  };

  const openZone = (zone: typeof PUNE_ZONES[0]) => {
    setSelectedZone(zone);
    Animated.spring(sheetY, { toValue: 0, friction: 14, useNativeDriver: true }).start();
    mapRef.current?.animateToRegion(
      { latitude: zone.latitude, longitude: zone.longitude, latitudeDelta: 0.06, longitudeDelta: 0.05 },
      800
    );
    setZoomedIn(true);
  };

  const closeZone = () => {
    Animated.timing(sheetY, { toValue: 400, duration: 250, useNativeDriver: true }).start(() => setSelectedZone(null));
  };

  const zoomOut = () => {
    mapRef.current?.animateToRegion(MAHARASHTRA, 1000);
    setZoomedIn(false);
    closeZone();
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={MAHARASHTRA}
        customMapStyle={isDark ? DARK_MAP : LIGHT_MAP}
        showsUserLocation={hasLoc}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
      >
        {PUNE_ZONES.map(zone => {
          const col = zoneColors[zone.colorKey as keyof typeof zoneColors] ?? zoneColors.kothrud;
          return (
            <React.Fragment key={zone.id}>
              {/* Heat zone circle */}
              <Circle
                center={{ latitude: zone.latitude, longitude: zone.longitude }}
                radius={zone.radiusKm * 1000}
                fillColor={col.bg}
                strokeColor={col.border}
                strokeWidth={1.5}
              />
              {/* Animated bubble */}
              <Marker
                coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
                onPress={() => openZone(zone)}
                tracksViewChanges={false}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <ZoneBubble zone={zone} onPress={() => openZone(zone)} colors={col} />
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>

      {/* Filter chips overlay */}
      <View style={mapStyles.topOverlay} pointerEvents="box-none">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: S.lg, gap: S.sm }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                mapStyles.filterChip,
                {
                  backgroundColor: activeFilter === f ? T.lime : `${T.bg}E0`,
                  borderColor: activeFilter === f ? T.lime : T.border2,
                },
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[TYPE.xs, { color: activeFilter === f ? '#09090E' : T.text1, fontWeight: '700' }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Privacy bar */}
        <View style={[mapStyles.privBar, { backgroundColor: `${T.bg}E8`, borderColor: `${T.amber}44` }]}>
          <Text style={{ fontSize: 12 }}>🔒</Text>
          <Text style={[TYPE.xs, { color: T.amber, flex: 1 }]}>
            Tap zone · Request connect · Address unlocks after approval
          </Text>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={mapStyles.bottomCtrls} pointerEvents="box-none">
        <View style={[mapStyles.statsBadge, { backgroundColor: `${T.bg}E8`, borderColor: T.border2 }]}>
          <PulseDot color={T.success} />
          <Text style={[TYPE.sm, { color: T.text1 }]}>
            <Text style={{ color: T.lime, fontWeight: '700' }}>{PUNE_ZONES.reduce((a, z) => a + z.propertyCount, 0)}</Text>
            {' '}live properties
          </Text>
        </View>
        <View style={{ gap: S.sm }}>
          {zoomedIn && (
            <TouchableOpacity style={[mapStyles.ctrlBtn, { backgroundColor: `${T.bg}E8`, borderColor: T.border2 }]} onPress={zoomOut}>
              <Text style={{ fontSize: 18 }}>🗺️</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[mapStyles.ctrlBtn, { backgroundColor: `${T.bg}E8`, borderColor: T.border2 }]} onPress={requestLoc}>
            <Text style={{ fontSize: 20 }}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Zone bottom sheet */}
      {selectedZone && (() => {
        const col = zoneColors[selectedZone.colorKey as keyof typeof zoneColors];
        return (
          <Animated.View style={[mapStyles.sheet, { backgroundColor: T.surface1, borderColor: T.border2, transform: [{ translateY: sheetY }] }]}>
            <TouchableOpacity onPress={closeZone} style={{ paddingVertical: S.sm, alignItems: 'center' }}>
              <View style={[mapStyles.handle, { backgroundColor: T.border3 }]} />
            </TouchableOpacity>

            <View style={[mapStyles.sheetHead, { paddingHorizontal: S.lg }]}>
              <View style={[mapStyles.sheetIcon, { backgroundColor: col.bg, borderColor: col.border }]}>
                <Text style={[TYPE.h4, { color: col.solid }]}>{selectedZone.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[TYPE.h3, { color: T.text1 }]}>{selectedZone.name}</Text>
                <Text style={[TYPE.xs, { color: col.solid, marginTop: 2 }]}>
                  {selectedZone.propertyCount} properties · Maharashtra
                </Text>
              </View>
              <TouchableOpacity onPress={closeZone} style={[mapStyles.closeBtn, { backgroundColor: T.surface3, borderColor: T.border1 }]}>
                <Text style={{ color: T.text2 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[TYPE.label, { color: T.text3, paddingHorizontal: S.lg, marginTop: S.md, marginBottom: S.sm }]}>
              PICK YOUR REQUIREMENT
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: S.lg, gap: S.sm, marginBottom: S.lg }}>
              {['Any', '1BHK', '2BHK', '3BHK', 'PG', '< ₹10K', '< ₹15K', 'Furnished', 'Women Safe'].map(c => (
                <Chip key={c} label={c} active={false} onPress={() => {}} />
              ))}
            </ScrollView>

            <View style={{ paddingHorizontal: S.lg, paddingBottom: 34 }}>
              <TouchableOpacity
                style={[mapStyles.browseBtn, { backgroundColor: col.solid }]}
                onPress={() => { closeZone(); nav.navigate('ZoneListings', { zoneId: selectedZone.id }); }}
              >
                <Text style={[TYPE.h4, { color: '#09090E', fontWeight: '900' }]}>
                  Browse {selectedZone.propertyCount} Properties →
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      })()}

      {/* Location permission popup */}
      {showPerm && (
        <Animated.View style={[mapStyles.permOverlay, { opacity: permBg }]}>
          <Animated.View style={[mapStyles.permSheet, { backgroundColor: T.surface1, borderColor: T.border2, transform: [{ translateY: permY }] }]}>
            <Text style={{ fontSize: 52, textAlign: 'center', marginBottom: S.lg }}>📍</Text>
            <Text style={[TYPE.h2, { color: T.text1, textAlign: 'center', marginBottom: S.sm }]}>Find homes near you</Text>
            <Text style={[TYPE.sm, { color: T.text2, textAlign: 'center', lineHeight: 22, marginBottom: S.xl }]}>
              GharMap uses your location to show properties in Maharashtra. Your location is never shared with owners.
            </Text>

            <View style={[mapStyles.permPrivacy, { backgroundColor: `${T.lime}0E`, borderColor: `${T.lime}28` }]}>
              <Text style={{ fontSize: 18 }}>🛡️</Text>
              <Text style={[TYPE.xs, { color: T.text2, flex: 1, lineHeight: 17 }]}>
                Privacy protected · Only used to centre the map · Owners never see your location
              </Text>
            </View>

            <TouchableOpacity style={[mapStyles.permBtn, { backgroundColor: T.lime, marginBottom: S.sm }]} onPress={requestLoc}>
              <Text style={[TYPE.h4, { color: '#09090E', fontWeight: '900' }]}>Allow Location Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: S.md, alignItems: 'center' }} onPress={skipLoc}>
              <Text style={[TYPE.sm, { color: T.text3 }]}>Not now — browse Pune</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const mapStyles = StyleSheet.create({
  topOverlay:  { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 54 },
  filterChip:  { borderRadius: R.full, paddingHorizontal: S.lg - 2, paddingVertical: S.sm - 1, borderWidth: 0.5 },
  privBar:     { marginHorizontal: S.lg, marginTop: S.sm, borderRadius: R.md, borderWidth: 0.5, padding: S.sm + 2, flexDirection: 'row', alignItems: 'center', gap: S.sm },
  bottomCtrls: { position: 'absolute', bottom: 100, left: S.lg, right: S.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statsBadge:  { flexDirection: 'row', alignItems: 'center', gap: S.sm, borderRadius: R.lg, paddingHorizontal: S.md, paddingVertical: S.sm, borderWidth: 0.5 },
  ctrlBtn:     { width: 44, height: 44, borderRadius: R.full, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  sheet:       { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: R.xxl, borderTopRightRadius: R.xxl, borderTopWidth: 0.5 },
  handle:      { width: 40, height: 4, borderRadius: 2 },
  sheetHead:   { flexDirection: 'row', alignItems: 'center', gap: S.md, marginBottom: S.md },
  sheetIcon:   { width: 46, height: 46, borderRadius: R.full, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  closeBtn:    { borderRadius: R.sm, paddingHorizontal: S.md, paddingVertical: S.sm, borderWidth: 0.5 },
  browseBtn:   { borderRadius: R.xl, padding: S.lg, alignItems: 'center' },
  permOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 34 },
  permSheet:   { width: width - S.xxxl, borderRadius: R.xxl, padding: S.xl, borderWidth: 0.5 },
  permPrivacy: { borderRadius: R.lg, borderWidth: 0.5, padding: S.md, flexDirection: 'row', gap: S.sm, marginBottom: S.xl },
  permBtn:     { borderRadius: R.xl, padding: S.lg, alignItems: 'center' },
});
