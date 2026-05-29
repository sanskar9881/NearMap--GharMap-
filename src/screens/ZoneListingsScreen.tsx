import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { PUNE_ZONES } from '../data/zones';
import { ZONE_COLORS } from '../theme/index';
import { ScreenHeader, Chip, Divider } from '../components/UI';
import PropertyCard from '../components/PropertyCard';
import { useConnectionStore } from '../store/connectionStore';
import { fetchListingsByZone } from '../api/zones';
import ConnectRequestSheet from '../components/ConnectRequestSheet';

const CHIPS = ['Any','1BHK','2BHK','3BHK','PG','< ₹10K','< ₹15K','Furnished','Women Safe'];

export default function ZoneListingsScreen() {
  const nav  = useNavigation<any>();
  const route = useRoute<any>();
  const { theme: T } = useTheme();
  const { zoneId } = route.params ?? {};
  const zone   = PUNE_ZONES.find(z => z.id === zoneId);
  const colors = ZONE_COLORS(T);
  const col    = zone ? colors[zone.colorKey as keyof typeof colors] ?? colors.kothrud : colors.kothrud;

  const [listings,  setListings]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [activeFilters,setActiveFilters] = useState<string[]>(['Any']);
  const [connectTarget,setConnectTarget] = useState<any>(null);
  const getStatus = useConnectionStore(s => s.getStatus);
  const setConn   = useConnectionStore(s => s.setConnection);

  const load = useCallback(async () => {
    if (!zone) { setLoading(false); return; }
    try {
      const data = await fetchListingsByZone(zone.id, {});
      setListings(data);
      data.forEach((l: any) => {
        if (l.connection_status && l.connection_status !== 'none') {
          setConn(l.id, { id:l.connection_id, listingId:l.id, seekerId:'', ownerId:l.owner_id,
            status:l.connection_status, message:'', phoneUnlocked:l.phone_unlocked??false, createdAt:'', updatedAt:'' });
        }
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [zone]);

  useEffect(() => { load(); }, [load]);

  const toggleFilter = (c: string) => {
    if (c==='Any') { setActiveFilters(['Any']); return; }
    const next = activeFilters.filter(f => f!=='Any');
    const upd  = next.includes(c) ? next.filter(f=>f!==c) : [...next,c];
    setActiveFilters(upd.length ? upd : ['Any']);
  };

  // Use mock data if API not ready
  const MOCK = [
    { id:'z1', type:'rent', title:'2BHK Semi-Furnished', price:12000, area:zone?.name??'Pune', locality:'near main road', bhk:'2BHK', sqft:850, floor:'2/5', furnish:'Semi', emoji:'🏠', verified:true, saved:false, tags:['Parking','WiFi','AC'], availFrom:'Jun 1', ownerInit:'RK', ownerColor:'#8B7FEE', ownerName:'Ravi K.', views:847, requests:12, daysAgo:2, ownerOnline:true, responseRate:92 },
    { id:'z2', type:'pg',   title:'Girls PG — Meals Included', price:6500, area:zone?.name??'Pune', locality:'near college', bhk:'Bed', sqft:0, floor:'G/3', furnish:'Full', emoji:'🏨', verified:true, saved:false, tags:['Meals','AC','CCTV'], availFrom:'Now', ownerInit:'SA', ownerColor:'#FF5C7A', ownerName:'Sunita A.', views:1204, requests:23, daysAgo:0, ownerOnline:true, responseRate:98, womenSafe:true },
  ];
  const displayData = listings.length > 0 ? listings : MOCK;

  if (!zone) return (
    <View style={{ flex:1, backgroundColor:T.bg, alignItems:'center', justifyContent:'center' }}>
      <Text style={[TYPE.h3, { color:T.text1 }]}>Zone not found</Text>
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor:T.bg }}>
      <ScreenHeader title={zone.name} subtitle={`${displayData.length} properties available`}
        right={<View style={[zls.zoneIcon, { backgroundColor:col.bg, borderColor:col.border }]}>
          <Text style={[TYPE.h4, { color:col.solid }]}>{zone.name[0]}</Text>
        </View>} />

      {/* Requirement chips */}
      <View style={{ paddingTop:S.md }}>
        <Text style={[TYPE.label, { color:T.text3, paddingHorizontal:S.lg, marginBottom:S.sm }]}>SELECT REQUIREMENTS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal:S.lg, gap:S.sm, paddingBottom:S.sm }}>
          {CHIPS.map(c => <Chip key={c} label={c} active={activeFilters.includes(c)} onPress={() => toggleFilter(c)} />)}
        </ScrollView>
      </View>

      {/* Privacy notice */}
      <View style={[zls.privBanner, { backgroundColor:`${T.amber}0E`, borderColor:`${T.amber}28` }]}>
        <Text style={{ fontSize:14 }}>🔒</Text>
        <View style={{ flex:1 }}>
          <Text style={[TYPE.xs, { color:T.amber, fontWeight:'700' }]}>Addresses hidden</Text>
          <Text style={[TYPE.xs, { color:T.text3, marginTop:2 }]}>Connect → Owner approves → Exact address unlocks</Text>
        </View>
      </View>

      <Divider />

      {loading
        ? <ActivityIndicator color={T.lime} size="large" style={{ marginTop:60 }} />
        : <FlatList data={displayData} keyExtractor={i => i.id}
            contentContainerStyle={{ padding:S.lg, paddingBottom:100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={T.lime} />}
            renderItem={({ item }) => (
              <PropertyCard item={item} status={getStatus(item.id)}
                onConnect={() => setConnectTarget(item)}
                onPress={() => nav.navigate('ListingDetail', { listingId:item.id })}
                onSave={() => {}} />
            )}
            ListEmptyComponent={
              <View style={{ alignItems:'center', paddingTop:60 }}>
                <Text style={{ fontSize:44, marginBottom:12 }}>🏚️</Text>
                <Text style={[TYPE.h3, { color:T.text1 }]}>No properties yet</Text>
                <Text style={[TYPE.sm, { color:T.text2, marginTop:6 }]}>Be the first to post in {zone.name}</Text>
              </View>
            } />
      }

      {connectTarget && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={{ flex:1, backgroundColor:'rgba(0,0,0,0.55)' }}
            onPress={() => setConnectTarget(null)} activeOpacity={1} />
          <ConnectRequestSheet listingId={connectTarget.id} listingTitle={connectTarget.title}
            ownerName={connectTarget.ownerName}
            onClose={() => setConnectTarget(null)}
            onSuccess={() => { setConnectTarget(null); load(); }} />
        </View>
      )}
    </View>
  );
}
const zls = StyleSheet.create({
  zoneIcon:   { width:36, height:36, borderRadius:18, borderWidth:2, alignItems:'center', justifyContent:'center' },
  privBanner: { marginHorizontal:S.lg, marginVertical:S.md, borderRadius:R.lg, borderWidth:0.5, padding:S.md, flexDirection:'row', gap:S.md, alignItems:'flex-start' },
});