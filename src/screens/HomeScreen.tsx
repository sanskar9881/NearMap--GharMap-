// ============================================================
// src/screens/HomeScreen.tsx  —  Premium Home Feed
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, StatusBar, RefreshControl, Animated, FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { SectionHeader, Skeleton, Chip, PulseDot, Badge } from '../components/UI';
import PropertyCard, { PropertyData } from '../components/PropertyCard';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

// ── Mock Data ────────────────────────────────────────────────
const AREAS = [
  { id: '1', name: 'Near Me',       icon: '📍' },
  { id: '2', name: 'Kothrud',       icon: '🏘️' },
  { id: '3', name: 'Baner',         icon: '🌆' },
  { id: '4', name: 'Viman Nagar',   icon: '✈️' },
  { id: '5', name: 'Wakad',         icon: '🏙️' },
  { id: '6', name: 'Koregaon Park', icon: '☕' },
  { id: '7', name: 'Aundh',         icon: '🌿' },
  { id: '8', name: 'Hinjewadi',     icon: '💻' },
];

const FILTERS = ['All', 'Rent', 'Buy', 'PG', 'Flatmate'];

const TRENDING = [
  { name: 'Baner', delta: '+18%', count: 42 },
  { name: 'Wakad', delta: '+14%', count: 38 },
  { name: 'Hinjewadi', delta: '+22%', count: 57 },
];

const PROPERTIES: PropertyData[] = [
  { id:'1', type:'rent', title:'2BHK Semi-Furnished Flat', price:12000, area:'Kothrud', locality:'near Prabhat Rd', bhk:'2BHK', sqft:850, floor:'2/5', furnish:'Semi', emoji:'🏠', verified:true, saved:false, tags:['Parking','Lift','WiFi','AC'], availFrom:'Jun 1', ownerInit:'RK', ownerColor:'#8B7FEE', ownerName:'Ravi K.', views:847, requests:12, daysAgo:2, ownerOnline:true, responseRate:92, boosted:false },
  { id:'2', type:'pg', title:'Girls PG — Meals + WiFi Included', price:6500, area:'Koregaon Park', locality:'North Main Rd', bhk:'Bed', sqft:0, floor:'G/3', furnish:'Full', emoji:'🏨', verified:true, saved:true, tags:['Meals','AC','CCTV','24hr Security'], availFrom:'Now', ownerInit:'SA', ownerColor:'#FF5C7A', ownerName:'Sunita A.', views:1204, requests:23, daysAgo:0, ownerOnline:true, responseRate:98, womenSafe:true, boosted:true },
  { id:'3', type:'buy', title:'3BHK Ready to Move In', price:4500000, area:'Baner', locality:'near Balewadi', bhk:'3BHK', sqft:1250, floor:'4/7', furnish:'None', emoji:'🏛️', verified:true, saved:false, tags:['Gym','Pool','Parking','Club'], availFrom:'Immediate', ownerInit:'PS', ownerColor:'#2DD4BF', ownerName:'Priya S.', views:432, requests:8, daysAgo:5, responseRate:85, boosted:false },
  { id:'4', type:'room', title:'Room in 3BHK — Working Professionals', price:8000, area:'Viman Nagar', locality:'Phoenix Mall area', bhk:'1 Room', sqft:180, floor:'3/6', furnish:'Full', emoji:'🛏️', verified:false, saved:false, tags:['WiFi','AC','Washing Machine'], availFrom:'May 25', ownerInit:'AM', ownerColor:'#FFA820', ownerName:'Ankit M.', views:234, requests:4, daysAgo:3, ownerOnline:false, responseRate:72, boosted:false },
  { id:'5', type:'rent', title:'1BHK Modern Studio', price:9500, area:'Aundh', locality:'near D-Mart', bhk:'1BHK', sqft:520, floor:'5/8', furnish:'Full', emoji:'🏠', verified:true, saved:false, tags:['Lift','AC','Power Backup'], availFrom:'Jun 15', ownerInit:'NK', ownerColor:'#38BDF8', ownerName:'Neha K.', views:567, requests:9, daysAgo:1, ownerOnline:true, responseRate:95, boosted:false },
  { id:'6', type:'rent', title:'3BHK Penthouse — City View', price:35000, area:'Wakad', locality:'near Xion Mall', bhk:'3BHK', sqft:1800, floor:'Top/10', furnish:'Full', emoji:'🏙️', verified:true, saved:false, tags:['Terrace','Gym','Parking','AC'], availFrom:'Jun 1', ownerInit:'RJ', ownerColor:'#C4FF38', ownerName:'Raj J.', views:1891, requests:31, daysAgo:0, ownerOnline:true, responseRate:100, boosted:true },
];

// ── Skeleton Card ─────────────────────────────────────────────
function SkeletonCard() {
  const { theme: T } = useTheme();
  return (
    <View style={[{ borderRadius: R.xl, padding: S.lg, marginBottom: S.md, backgroundColor: T.surface2 }]}>
      <View style={{ flexDirection: 'row', gap: S.md, marginBottom: S.md }}>
        <Skeleton w={76} h={76} r={R.lg} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton w="70%" h={12} />
          <Skeleton w="50%" h={12} />
          <Skeleton w="40%" h={10} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: S.sm }}>
        <Skeleton w={60} h={24} />
        <Skeleton w={70} h={24} />
        <Skeleton w={55} h={24} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: S.md }}>
        <Skeleton w="40%" h={12} />
        <Skeleton w={80} h={34} r={R.md} />
      </View>
    </View>
  );
}

// ── Trending Card ─────────────────────────────────────────────
function TrendingCard({ item }: { item: typeof TRENDING[0] }) {
  const { theme: T } = useTheme();
  return (
    <TouchableOpacity style={[tStyles.card, { backgroundColor: T.surface3, borderColor: T.border1 }]}>
      <Text style={[TYPE.h4, { color: T.text1 }]}>{item.name}</Text>
      <Text style={[TYPE.xs, { color: T.success, marginTop: 3 }]}>{item.delta} this week</Text>
      <Text style={[TYPE.label, { color: T.text3, marginTop: 4 }]}>{item.count} listings</Text>
    </TouchableOpacity>
  );
}

const tStyles = StyleSheet.create({
  card: { borderRadius: R.lg, padding: S.lg, marginRight: S.sm, width: 130, borderWidth: 0.5 },
});

// ── Main Screen ───────────────────────────────────────────────
export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { theme: T } = useTheme();
  const user = useAuthStore(s => s.user);

  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [activeArea,   setActiveArea]   = useState('1');
  const [activeFilter, setActiveFilter] = useState('All');
  const [search,       setSearch]       = useState('');

  const scrollY   = useRef(new Animated.Value(0)).current;
  const headerBg  = scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 1], extrapolate: 'clamp' });

  useEffect(() => { setTimeout(() => setLoading(false), 1600); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1400);
  }, []);

  const filtered = PROPERTIES.filter(p => {
    const filt = activeFilter === 'All' || p.type === activeFilter.toLowerCase();
    const srch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase());
    return filt && srch;
  });

  const nearby    = filtered;
  const recent    = [...filtered].sort((a, b) => a.daysAgo - b.daysAgo);
  const roommate  = filtered.filter(p => p.type === 'room');
  const verified  = filtered.filter(p => p.verified);
  const womenSafe = filtered.filter(p => p.womenSafe);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.bg === '#08080F' ? 'light-content' : 'dark-content'} backgroundColor={T.bg} />

      {/* Animated header backdrop */}
      <Animated.View style={[styles.headerBack, { backgroundColor: T.surface1, opacity: headerBg }]} />

      {/* Top bar */}
      <View style={[styles.topBar, { backgroundColor: 'transparent' }]}>
        <View style={{ flex: 1 }}>
          <Text style={[TYPE.xs, { color: T.text3 }]}>{greeting()},</Text>
          <Text style={[TYPE.h3, { color: T.text1, marginTop: 1 }]}>
            {user?.name?.split(' ')[0] ?? 'Find your home'} 👋
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, { backgroundColor: T.surface3, borderColor: T.border1 }]}
          onPress={() => nav.navigate('ProfileTab')}
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
          <View style={[styles.notifDot, { backgroundColor: T.rose, borderColor: T.bg }]} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { paddingHorizontal: S.lg }]}>
        <View style={[styles.searchBar, { backgroundColor: T.surface2, borderColor: T.border2 }]}>
          <Text style={{ fontSize: 16, marginRight: S.sm }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: T.text1 }]}
            placeholder="Search area, locality, BHK…"
            placeholderTextColor={T.text3}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ fontSize: 14, color: T.text3 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: T.surface3, borderColor: T.border1 }]}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={T.lime} />}
      >
        {/* Area chips */}
        <View style={{ marginBottom: S.sm }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: S.lg, gap: S.sm, paddingBottom: S.xs }}>
            {AREAS.map(a => (
              <Chip key={a.id} label={a.name} icon={a.icon} active={activeArea === a.id} onPress={() => setActiveArea(a.id)} />
            ))}
          </ScrollView>
        </View>

        {/* Filter bar */}
        <View style={{ marginBottom: S.sm }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: S.lg, gap: S.sm }}>
            {FILTERS.map(f => (
              <Chip key={f} label={f} active={activeFilter === f} onPress={() => setActiveFilter(f)} />
            ))}
          </ScrollView>
        </View>

        {/* Stats bar */}
        <View style={[styles.statsBar, { paddingHorizontal: S.lg }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm }}>
            <PulseDot color={T.success} />
            <Text style={[TYPE.sm, { color: T.text2 }]}>
              <Text style={{ color: T.lime, fontWeight: '700' }}>{filtered.length}</Text> live in Maharashtra
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={[TYPE.xs, { color: T.teal, fontWeight: '700' }]}>Sort ↕</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: S.lg, paddingBottom: 100 }}>

          {/* Trending localities */}
          <View style={{ marginBottom: S.xl }}>
            <SectionHeader title="Trending Localities" action="See all" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.sm }}>
              {TRENDING.map(t => <TrendingCard key={t.name} item={t} />)}
            </ScrollView>
          </View>

          {/* Nearby Listings */}
          <View style={{ marginBottom: S.md }}>
            <SectionHeader title="Nearby Listings" action="View map" onAction={() => nav.navigate('MapTab')} />
            {loading
              ? [1,2,3].map(i => <SkeletonCard key={i} />)
              : nearby.map(p => (
                  <PropertyCard key={p.id} item={p}
                    onPress={() => nav.navigate('ListingDetail', { listingId: p.id })}
                    onSave={() => {}} />
                ))}
          </View>

          {/* Women Safe — only show if exists */}
          {!loading && womenSafe.length > 0 && (
            <View style={{ marginBottom: S.xl }}>
              <SectionHeader title="🔴 Women-Safe Listings" />
              {womenSafe.map(p => (
                <PropertyCard key={p.id} item={p}
                  onPress={() => nav.navigate('ListingDetail', { listingId: p.id })}
                  onSave={() => {}} />
              ))}
            </View>
          )}

          {/* Roommate Needed */}
          {!loading && roommate.length > 0 && (
            <View style={{ marginBottom: S.xl }}>
              <SectionHeader title="🛏️ Roommate Needed" />
              {roommate.map(p => (
                <PropertyCard key={p.id} item={p} compact
                  onPress={() => nav.navigate('ListingDetail', { listingId: p.id })}
                  onSave={() => {}} />
              ))}
            </View>
          )}

          {/* Recently Added */}
          {!loading && (
            <View style={{ marginBottom: S.xl }}>
              <SectionHeader title="🆕 Recently Added" />
              {recent.slice(0, 3).map(p => (
                <PropertyCard key={p.id} item={p} compact
                  onPress={() => nav.navigate('ListingDetail', { listingId: p.id })}
                  onSave={() => {}} />
              ))}
            </View>
          )}

          {/* Verified Spaces */}
          {!loading && (
            <View>
              <SectionHeader title="✅ Verified Owner Spaces" />
              {verified.slice(0, 3).map(p => (
                <PropertyCard key={p.id} item={p} compact
                  onPress={() => nav.navigate('ListingDetail', { listingId: p.id })}
                  onSave={() => {}} />
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  headerBack: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 0 },
  topBar:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.lg, paddingTop: 56, paddingBottom: S.md },
  notifBtn:   { width: 42, height: 42, borderRadius: R.full, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 0.5 },
  notifDot:   { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },
  searchRow:  { flexDirection: 'row', gap: S.sm, marginBottom: S.md },
  searchBar:  { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: R.xl, paddingHorizontal: S.md, paddingVertical: S.md - 2, borderWidth: 0.5 },
  searchInput:{ flex: 1, ...TYPE.sm },
  filterBtn:  { width: 46, height: 46, borderRadius: R.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  statsBar:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.md },
});
