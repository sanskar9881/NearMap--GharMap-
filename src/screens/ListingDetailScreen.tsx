import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { ScreenHeader, Badge, PrimaryButton, GhostButton, PulseDot } from '../components/UI';
import { useConnectionStore } from '../store/connectionStore';
import { fetchListingById } from '../api/zones';
import ConnectRequestSheet from '../components/ConnectRequestSheet';

const TYPE_COLOR: Record<string,string> = { rent:'#2DD4BF', buy:'#8B7FEE', room:'#FFA820', pg:'#FF5C7A' };

const MOCK_DETAIL = { id:'d1', type:'rent', title:'2BHK Semi-Furnished Flat', price:12000, deposit:24000, bhk:'2BHK', floor:'2nd', total_floors:5, area_sqft:850, furnishing:'semi', approximate_area:'near Prabhat Rd', available_from:'2025-06-01', description:'Well maintained flat in a quiet society. Great ventilation, 2 balconies. 5 min walk to Prabhat Rd cafes. Society has security 24/7.', amenities:['🅿️ Parking','🛗 Lift','🌐 WiFi','⚡ Power Backup','🌬️ AC','🔒 Security','🚿 Hot Water'], zone_name:'Kothrud', owner_name:'Ravi Kumar', owner_rating:4.8, is_id_verified:true, view_count:847, connection_status:'none', connection_id:null, exact_address:null };

export default function ListingDetailScreen() {
  const nav   = useNavigation<any>();
  const route = useRoute<any>();
  const { theme: T } = useTheme();
  const { listingId } = route.params ?? {};
  const [listing,   setListing]   = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [showConn,  setShowConn]  = useState(false);
  const getStatus = useConnectionStore(s => s.getStatus);
  const setConn   = useConnectionStore(s => s.setConnection);
  const status    = listing ? getStatus(listing.id) : 'none';
  const typeColor = listing ? TYPE_COLOR[listing.type] ?? TYPE_COLOR.rent : TYPE_COLOR.rent;

  useEffect(() => {
    fetchListingById(listingId)
      .then(data => {
        setListing(data);
        if (data.connection_status && data.connection_status !== 'none') {
          setConn(data.id, { id:data.connection_id, listingId:data.id, seekerId:'', ownerId:data.owner_id,
            status:data.connection_status, message:'', phoneUnlocked:data.phone_unlocked??false, createdAt:'', updatedAt:'' });
        }
      })
      .catch(() => setListing(MOCK_DETAIL))
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return <View style={{ flex:1, backgroundColor:T.bg, alignItems:'center', justifyContent:'center' }}><ActivityIndicator color={T.lime} size="large" /></View>;
  if (!listing) return null;

  const fmtPrice = (p: number, type: string) => type==='buy' ? (p>=10000000?`₹${(p/10000000).toFixed(1)}Cr`:`₹${(p/100000).toFixed(0)}L`) : `₹${(p/1000).toFixed(0)}K/mo`;

  return (
    <View style={{ flex:1, backgroundColor:T.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[lds.hero, { backgroundColor:`${typeColor}12` }]}>
          <Text style={{ fontSize:80 }}>🏠</Text>
          {/* Back */}
          <TouchableOpacity onPress={() => nav.goBack()} style={[lds.backBtn, { backgroundColor:`${T.bg}CC`, borderColor:T.border2 }]}>
            <Text style={{ color:T.text1, fontSize:18 }}>←</Text>
          </TouchableOpacity>
          <View style={lds.heroBadges}>
            <Badge label={listing.type.toUpperCase()} color={typeColor} bg={`${typeColor}22`} />
            {listing.is_id_verified && <Badge label="✓ Verified Owner" color={T.lime} bg={`${T.lime}18`} />}
          </View>
        </View>

        <View style={{ padding:S.lg }}>
          {/* Title + price */}
          <View style={lds.titleRow}>
            <Text style={[TYPE.h2, { color:T.text1, flex:1, marginRight:S.md }]}>{listing.title}</Text>
            <Text style={[TYPE.h2, { color:T.amber, flexShrink:0 }]}>{fmtPrice(listing.price, listing.type)}</Text>
          </View>

          {/* Address */}
          {status==='approved' && listing.exact_address
            ? <View style={lds.addrRow}><Text style={{ fontSize:13 }}>📍</Text><Text style={[TYPE.sm, { color:T.teal, flex:1 }]}>{listing.exact_address}</Text></View>
            : <View style={lds.addrRow}><Text style={{ fontSize:13 }}>🔒</Text>
                <Text style={[TYPE.sm, { color:T.text3, flex:1 }]}>{listing.zone_name} · {listing.approximate_area}</Text>
                <View style={[lds.lockedBadge, { backgroundColor:`${T.amber}14` }]}><Text style={[TYPE.label, { color:T.amber }]}>LOCKED</Text></View>
              </View>}

          {/* Stats */}
          <View style={lds.statsGrid}>
            {[[listing.bhk,'BHK'],[listing.area_sqft+' sqft','Area'],[`${listing.floor}/${listing.total_floors}`,'Floor'],[listing.furnishing==='full'?'Fully Furn':listing.furnishing==='semi'?'Semi Furn':'Unfurn','Furnish']].map(([v,l])=>(
              <View key={l} style={[lds.statBox, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
                <Text style={[TYPE.sm, { color:T.text1, fontWeight:'700' }]}>{v}</Text>
                <Text style={[TYPE.label, { color:T.text3, marginTop:3 }]}>{l?.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          {/* Deposit + available */}
          <View style={lds.twoCol}>
            <View style={[lds.infoBox, { backgroundColor:`${T.amber}0D`, borderColor:`${T.amber}25` }]}>
              <Text style={[TYPE.label, { color:T.amber }]}>DEPOSIT</Text>
              <Text style={[TYPE.h3, { color:T.text1, marginTop:4 }]}>₹{listing.deposit?(listing.deposit/1000).toFixed(0)+'K':'0'}</Text>
            </View>
            <View style={[lds.infoBox, { backgroundColor:`${T.teal}0D`, borderColor:`${T.teal}25` }]}>
              <Text style={[TYPE.label, { color:T.teal }]}>AVAILABLE</Text>
              <Text style={[TYPE.h3, { color:T.text1, marginTop:4 }]}>{listing.available_from ? new Date(listing.available_from).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'Now'}</Text>
            </View>
          </View>

          {/* Amenities */}
          {listing.amenities?.length > 0 && (<>
            <Text style={[TYPE.label, { color:T.text3, marginBottom:S.md }]}>AMENITIES</Text>
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:S.sm, marginBottom:S.xl }}>
              {listing.amenities.map((a: string) => (
                <View key={a} style={[lds.amenTag, { backgroundColor:`${T.teal}0E`, borderColor:`${T.teal}25` }]}>
                  <Text style={[TYPE.xs, { color:T.teal }]}>{a}</Text>
                </View>
              ))}
            </View>
          </>)}

          {/* Description */}
          {listing.description && (<>
            <Text style={[TYPE.label, { color:T.text3, marginBottom:S.md }]}>ABOUT THIS PLACE</Text>
            <Text style={[TYPE.sm, { color:T.text2, lineHeight:22, marginBottom:S.xl }]}>{listing.description}</Text>
          </>)}

          {/* Owner card */}
          <Text style={[TYPE.label, { color:T.text3, marginBottom:S.md }]}>OWNER</Text>
          <View style={[lds.ownerCard, { backgroundColor:T.surface2, borderColor:T.border2 }]}>
            <View style={[lds.ownerAvt, { backgroundColor:T.violet }]}>
              <Text style={{ fontSize:18, fontWeight:'900', color:'#09090E' }}>{listing.owner_name?.substring(0,2)??'OW'}</Text>
            </View>
            <View style={{ flex:1 }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:S.sm, marginBottom:4 }}>
                <Text style={[TYPE.h4, { color:T.text1 }]}>{listing.owner_name}</Text>
                {listing.is_id_verified && <Text style={{ fontSize:14 }}>✅</Text>}
              </View>
              <View style={{ flexDirection:'row', gap:S.lg }}>
                <Text style={[TYPE.xs, { color:T.text3 }]}>⭐ {listing.owner_rating??'—'}</Text>
                <Text style={[TYPE.xs, { color:T.text3 }]}>👁 {listing.view_count}</Text>
              </View>
            </View>
            {status==='approved' && (
              <TouchableOpacity style={[lds.chatSmall, { backgroundColor:T.surface4, borderColor:T.border2 }]}
                onPress={() => nav.navigate('Chat', { connectionId:listing.connection_id, otherName:listing.owner_name, listingTitle:listing.title })}>
                <Text style={[TYPE.xs, { color:T.text1, fontWeight:'700' }]}>💬 Chat</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Privacy note */}
          <View style={[lds.privNote, { backgroundColor:`${T.lime}0A`, borderColor:`${T.lime}20` }]}>
            <Text style={[TYPE.xs, { color:T.text2, lineHeight:18 }]}>🛡️ Phone and exact address are shared only after the owner approves your connection request.</Text>
          </View>

          <View style={{ height:120 }} />
        </View>
      </ScrollView>

      {/* CTA bar */}
      <View style={[lds.ctaBar, { backgroundColor:T.surface1, borderTopColor:T.border1 }]}>
        {status==='none' && <PrimaryButton label="🤝 Request to Connect" onPress={() => setShowConn(true)} />}
        {status==='pending' && <View style={[lds.pendingBar, { backgroundColor:T.surface3, borderColor:T.border2 }]}><Text style={[TYPE.h4, { color:T.amber }]}>⏳ Request sent — awaiting owner</Text></View>}
        {status==='approved' && <PrimaryButton label="💬 Open Chat" onPress={() => nav.navigate('Chat', { connectionId:listing.connection_id, otherName:listing.owner_name, listingTitle:listing.title })} />}
        {status==='declined' && <View style={[lds.pendingBar, { backgroundColor:`${T.rose}10`, borderColor:`${T.rose}25` }]}><Text style={[TYPE.h4, { color:T.rose }]}>✕ Request declined</Text></View>}
      </View>

      {showConn && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={{ flex:1, backgroundColor:'rgba(0,0,0,0.55)' }} onPress={() => setShowConn(false)} activeOpacity={1} />
          <ConnectRequestSheet listingId={listing.id} listingTitle={listing.title}
            ownerName={listing.owner_name} onClose={() => setShowConn(false)} onSuccess={() => setShowConn(false)} />
        </View>
      )}
    </View>
  );
}
const lds = StyleSheet.create({
  hero:       { height:220, alignItems:'center', justifyContent:'center', position:'relative', borderBottomWidth:0.5 },
  backBtn:    { position:'absolute', top:52, left:S.lg, width:38, height:38, borderRadius:19, alignItems:'center', justifyContent:'center', borderWidth:0.5 },
  heroBadges: { position:'absolute', bottom:S.lg, left:S.lg, flexDirection:'row', gap:S.sm },
  titleRow:   { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:S.sm },
  addrRow:    { flexDirection:'row', alignItems:'center', gap:S.sm, marginBottom:S.xl },
  lockedBadge:{ borderRadius:R.sm, paddingHorizontal:S.sm, paddingVertical:2 },
  statsGrid:  { flexDirection:'row', gap:S.sm, marginBottom:S.lg, flexWrap:'wrap' },
  statBox:    { flex:1, borderRadius:R.lg, padding:S.md, alignItems:'center', borderWidth:0.5, minWidth:'22%' },
  twoCol:     { flexDirection:'row', gap:S.md, marginBottom:S.xl },
  infoBox:    { flex:1, borderRadius:R.lg, padding:S.md, borderWidth:0.5 },
  amenTag:    { borderRadius:R.sm, paddingHorizontal:S.md-2, paddingVertical:5, borderWidth:0.5 },
  ownerCard:  { borderRadius:R.xl, padding:S.lg, flexDirection:'row', alignItems:'center', gap:S.md, marginBottom:S.lg, borderWidth:0.5 },
  ownerAvt:   { width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center' },
  chatSmall:  { borderRadius:R.md, paddingHorizontal:S.md, paddingVertical:S.sm, borderWidth:0.5 },
  privNote:   { borderRadius:R.lg, borderWidth:0.5, padding:S.md, marginBottom:S.md },
  ctaBar:     { position:'absolute', bottom:0, left:0, right:0, padding:S.lg, paddingBottom:34, borderTopWidth:0.5 },
  pendingBar: { borderRadius:R.xl, padding:S.lg, alignItems:'center', borderWidth:0.5 },
});

