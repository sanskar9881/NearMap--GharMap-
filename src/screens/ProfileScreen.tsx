import React2, { useState as useState2 } from 'react';
import {
  View as View2, Text as Text2, ScrollView as ScrollView2, StyleSheet as StyleSheet2,
  TouchableOpacity as TouchableOpacity2, Switch, Alert as Alert2,
} from 'react-native';
import { useNavigation as useNav2 } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useTheme as useTheme2 } from '../theme/ThemeContext';
import { TYPE as TYPE2, S as S2, R as R2 } from '../theme/index';
import { TrustScore, SectionHeader as SH2, Divider, Badge as Badge2 } from '../components/UI';
import { useAuthStore as useAuth2 } from '../store/authStore';

const TABS2 = ['Profile','Listings','Wishlist','Settings'];
const MOCK_LISTINGS2 = [
  { id:'1', emoji:'🏠', title:'2BHK Semi-Furnished', area:'Kothrud', price:'₹12K/mo', views:847, requests:12 },
  { id:'2', emoji:'🛏️', title:'Room in 3BHK',       area:'Baner',   price:'₹8K/mo',  views:234, requests:4  },
];
const MOCK_WISH = [
  { id:'1', emoji:'🏨', title:'Girls PG with Meals',   area:'Koregaon Park', price:'₹6.5K/mo', init:'SA', color:'#FF5C7A' },
  { id:'2', emoji:'🏛️', title:'3BHK Ready to Move',   area:'Baner',         price:'₹45L',      init:'PS', color:'#2DD4BF' },
  { id:'3', emoji:'🏠', title:'1BHK Modern Studio',    area:'Aundh',         price:'₹9.5K/mo',  init:'NK', color:'#38BDF8' },
];

export default function ProfileScreen() {
  const nav = useNav2<any>();
  const { theme: T, isDark, toggle } = useTheme2();
  const { user, logout } = useAuth2();
  const [tab,   setTab]   = useState2('Profile');
  const [notif, setNotif] = useState2(true);
  const [locSh, setLocSh] = useState2(false);

  const trustScore = [user?.isOtpVerified, user?.isEmailVerified, user?.isIdVerified, user?.isAadhaarVerified]
    .filter(Boolean).length * 25;

  const handleLogout = () => {
    Alert2.alert('Log Out', 'Are you sure?', [
      { text:'Cancel', style:'cancel' },
      { text:'Log Out', style:'destructive', onPress: async () => {
          await SecureStore.deleteItemAsync('auth_token'); logout();
      }},
    ]);
  };

  return (
    <View2 style={{ flex:1, backgroundColor:T.bg }}>
      {/* Cover */}
      <View2 style={[ps.cover, { backgroundColor:T.surface2 }]}>
        <View2 style={[ps.avatar, { backgroundColor:T.violet, borderColor:T.bg }]}>
          <Text2 style={ps.avatarTxt}>{user?.name?.substring(0,2)?.toUpperCase() ?? 'ME'}</Text2>
        </View2>
        <TouchableOpacity2 style={[ps.editBtn, { backgroundColor:`${T.bg}CC`, borderColor:T.border2 }]}>
          <Text2 style={[TYPE2.xs, { color:T.text1, fontWeight:'700' }]}>Edit Profile</Text2>
        </TouchableOpacity2>
        <TrustScore score={trustScore} />
      </View2>

      {/* Name */}
      <View2 style={{ paddingHorizontal:S2.lg, paddingTop:46, paddingBottom:S2.sm }}>
        <Text2 style={[TYPE2.h2, { color:T.text1, marginBottom:3 }]}>{user?.name ?? 'Your Name'}</Text2>
        <Text2 style={[TYPE2.sm, { color:T.text2, marginBottom:S2.sm }]}>
          {user?.occupation ?? 'Add occupation'} · Pune, Maharashtra
        </Text2>
        <ScrollView2 horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:S2.sm }}>
          {[
            [user?.isOtpVerified,     '📱','Phone',  T.teal  ],
            [user?.isEmailVerified,   '📧','Email',  T.lime  ],
            [user?.isIdVerified,      '🪪','ID',     T.amber ],
            [user?.isAadhaarVerified, '🔏','Aadhaar',T.violet],
          ].map(([done,icon,label,color]) => (
            <View2 key={label as string} style={[ps.vbadge, {
              backgroundColor:`${color}14`, borderColor:`${color}28`, opacity: done ? 1 : 0.45
            }]}>
              <Text2 style={{ fontSize:11 }}>{icon as string}</Text2>
              <Text2 style={[TYPE2.label, { color: done ? color as string : T.text3 }]}>{label as string} {done?'✓':'—'}</Text2>
            </View2>
          ))}
        </ScrollView2>
      </View2>

      {/* Tab bar */}
      <View2 style={[ps.tabBar, { borderBottomColor:T.border1 }]}>
        {TABS2.map(t => (
          <TouchableOpacity2 key={t} style={[ps.tab, tab===t && { borderBottomColor:T.lime }]} onPress={()=>setTab(t)}>
            <Text2 style={[TYPE2.xs, { color: tab===t ? T.lime : T.text3, fontWeight:'700' }]}>{t.toUpperCase()}</Text2>
          </TouchableOpacity2>
        ))}
      </View2>

      <ScrollView2 showsVerticalScrollIndicator={false} contentContainerStyle={{ padding:S2.lg, paddingBottom:100 }}>

        {tab==='Profile' && (<>
          <View2 style={[ps.statsGrid, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
            {[['2','Listings',T.teal],['1.1K','Views',T.amber],['16','Requests',T.violet],['3','Credits',T.lime]]
              .map(([n,l,c]) => (
                <View2 key={l as string} style={[ps.statBox, { borderRightColor:T.border1 }]}>
                  <Text2 style={[TYPE2.h2, { color:c as string }]}>{n as string}</Text2>
                  <Text2 style={[TYPE2.label, { color:T.text3, marginTop:3 }]}>{(l as string).toUpperCase()}</Text2>
                </View2>
              ))}
          </View2>
          <View2 style={[ps.credCard, { backgroundColor:`${T.lime}0D`, borderColor:`${T.lime}28` }]}>
            <View2 style={{ flex:1 }}>
              <Text2 style={[TYPE2.h4, { color:T.lime, marginBottom:3 }]}>🎁 Free Credits</Text2>
              <Text2 style={[TYPE2.xs, { color:T.text2, marginBottom:S2.sm }]}>3 contact unlocks/month · resets Jun 1</Text2>
              <View2 style={[ps.credBar, { backgroundColor:T.surface4 }]}>
                <View2 style={[ps.credFill, { backgroundColor:T.lime, width:'100%' }]} />
              </View2>
            </View2>
            <Text2 style={[TYPE2.h1, { color:T.lime }]}>{user?.credits ?? 3}</Text2>
          </View2>
        </>)}

        {tab==='Listings' && (<>
          <TouchableOpacity2 style={[ps.addBtn, { backgroundColor:`${T.lime}0F`, borderColor:`${T.lime}30` }]}
            onPress={() => nav.navigate('Post')}>
            <Text2 style={{ fontSize:20 }}>＋</Text2>
            <Text2 style={[TYPE2.h4, { color:T.lime, flex:1 }]}>Post a New Property</Text2>
            <View2 style={[ps.freeBadge, { backgroundColor:`${T.lime}20` }]}>
              <Text2 style={[TYPE2.label, { color:T.lime }]}>FREE</Text2>
            </View2>
          </TouchableOpacity2>
          {MOCK_LISTINGS2.map(l => (
            <View2 key={l.id} style={[ps.listCard, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
              <View2 style={[ps.listThumb, { backgroundColor:T.surface4 }]}>
                <Text2 style={{ fontSize:28 }}>{l.emoji}</Text2>
              </View2>
              <View2 style={{ flex:1 }}>
                <Text2 style={[TYPE2.h4, { color:T.text1, marginBottom:3 }]} numberOfLines={1}>{l.title}</Text2>
                <Text2 style={[TYPE2.xs, { color:T.text3, marginBottom:3 }]}>📍 {l.area}</Text2>
                <Text2 style={[TYPE2.h4, { color:T.amber }]}>{l.price}</Text2>
                <View2 style={{ flexDirection:'row', gap:S2.md, marginTop:4 }}>
                  <Text2 style={[TYPE2.label, { color:T.text3 }]}>👁 {l.views}</Text2>
                  <Text2 style={[TYPE2.label, { color:T.text3 }]}>🤝 {l.requests}</Text2>
                  <Text2 style={[TYPE2.label, { color:T.success }]}>● Active</Text2>
                </View2>
              </View2>
              <TouchableOpacity2 style={[ps.editLBtn, { backgroundColor:T.surface4, borderColor:T.border1 }]}>
                <Text2 style={[TYPE2.xs, { color:T.text2 }]}>Edit</Text2>
              </TouchableOpacity2>
            </View2>
          ))}
        </>)}

        {tab==='Wishlist' && (<>
          <SH2 title="Saved Properties" />
          {MOCK_WISH.map(w => (
            <View2 key={w.id} style={[ps.listCard, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
              <View2 style={[ps.listThumb, { backgroundColor:T.surface4 }]}>
                <Text2 style={{ fontSize:26 }}>{w.emoji}</Text2>
              </View2>
              <View2 style={{ flex:1 }}>
                <Text2 style={[TYPE2.h4, { color:T.text1, marginBottom:3 }]} numberOfLines={1}>{w.title}</Text2>
                <Text2 style={[TYPE2.xs, { color:T.text3, marginBottom:3 }]}>📍 {w.area}</Text2>
                <Text2 style={[TYPE2.h4, { color:T.amber }]}>{w.price}</Text2>
              </View2>
              <View2 style={{ alignItems:'center', gap:S2.sm }}>
                <View2 style={[ps.wOwner, { backgroundColor:w.color }]}>
                  <Text2 style={ps.wOwnerTxt}>{w.init}</Text2>
                </View2>
                <Text2 style={{ fontSize:18 }}>🔖</Text2>
              </View2>
            </View2>
          ))}
        </>)}

        {tab==='Settings' && (<>
          <SH2 title="Appearance" />
          <View2 style={[ps.settGroup, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
            <View2 style={[ps.settRow, { borderBottomColor:T.border1 }]}>
              <Text2 style={{ fontSize:20 }}>{isDark ? '🌙' : '☀️'}</Text2>
              <Text2 style={[TYPE2.h4, { color:T.text1, flex:1 }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text2>
              <Switch value={isDark} onValueChange={toggle} trackColor={{ false:T.surface4, true:T.lime }} thumbColor="white" />
            </View2>
            <View2 style={[ps.settRow, { borderBottomWidth:0 }]}>
              <Text2 style={{ fontSize:20 }}>🔔</Text2>
              <Text2 style={[TYPE2.h4, { color:T.text1, flex:1 }]}>Notifications</Text2>
              <Switch value={notif} onValueChange={setNotif} trackColor={{ false:T.surface4, true:T.lime }} thumbColor="white" />
            </View2>
          </View2>

          <SH2 title="Account" style={{ marginTop:S2.xl }} />
          <View2 style={[ps.settGroup, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
            {[['🪪','Verify Your ID'],['💳','Billing & Credits'],['🔒','Privacy Settings'],['📞','Help & Support']].map(([i,l],idx,arr) => (
              <TouchableOpacity2 key={l as string} style={[ps.settRow, { borderBottomColor:T.border1, borderBottomWidth: idx===arr.length-1?0:0.5 }]}>
                <Text2 style={{ fontSize:18 }}>{i as string}</Text2>
                <Text2 style={[TYPE2.h4, { color:T.text1, flex:1 }]}>{l as string}</Text2>
                <Text2 style={{ color:T.text3, fontSize:18 }}>›</Text2>
              </TouchableOpacity2>
            ))}
          </View2>

          <SH2 title="Legal" style={{ marginTop:S2.xl }} />
          <View2 style={[ps.settGroup, { backgroundColor:T.surface2, borderColor:T.border1 }]}>
            {[['📋','Terms of Service'],['🛡️','Privacy Policy'],['ℹ️','App Version 1.0.0']].map(([i,l],idx,arr) => (
              <TouchableOpacity2 key={l as string} style={[ps.settRow, { borderBottomColor:T.border1, borderBottomWidth: idx===arr.length-1?0:0.5 }]}>
                <Text2 style={{ fontSize:18 }}>{i as string}</Text2>
                <Text2 style={[TYPE2.h4, { color:T.text1, flex:1 }]}>{l as string}</Text2>
                <Text2 style={{ color:T.text3, fontSize:16 }}>›</Text2>
              </TouchableOpacity2>
            ))}
          </View2>

          <TouchableOpacity2 style={[ps.logoutBtn, { backgroundColor:`${T.rose}10`, borderColor:`${T.rose}28` }]} onPress={handleLogout}>
            <Text2 style={{ fontSize:20 }}>🚪</Text2>
            <Text2 style={[TYPE2.h4, { color:T.rose }]}>Log Out</Text2>
          </TouchableOpacity2>
          <TouchableOpacity2 style={{ alignItems:'center', padding:S2.md, marginTop:S2.sm }}>
            <Text2 style={[TYPE2.xs, { color:T.text3, textDecorationLine:'underline' }]}>Delete Account</Text2>
          </TouchableOpacity2>
        </>)}
      </ScrollView2>
    </View2>
  );
}

const ps = StyleSheet2.create({
  cover:     { height:140, position:'relative', overflow:'visible' },
  avatar:    { position:'absolute', bottom:-38, left:18, width:76, height:76, borderRadius:38, alignItems:'center', justifyContent:'center', borderWidth:3 },
  avatarTxt: { fontSize:26, fontWeight:'900', color:'#09090E' },
  editBtn:   { position:'absolute', top:56, right:16, borderRadius:R2.md, paddingHorizontal:14, paddingVertical:7, borderWidth:0.5 },
  vbadge:    { flexDirection:'row', alignItems:'center', gap:5, borderRadius:R2.full, paddingHorizontal:10, paddingVertical:4, borderWidth:0.5 },
  tabBar:    { flexDirection:'row', borderBottomWidth:0.5 },
  tab:       { flex:1, paddingVertical:S2.md, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent' },
  statsGrid: { flexDirection:'row', borderRadius:R2.xl, overflow:'hidden', borderWidth:0.5, marginBottom:S2.md },
  statBox:   { flex:1, paddingVertical:S2.lg, alignItems:'center', borderRightWidth:0.5 },
  credCard:  { borderRadius:R2.xl, padding:S2.lg, flexDirection:'row', alignItems:'center', gap:S2.lg, marginBottom:S2.md, borderWidth:0.5 },
  credBar:   { height:4, borderRadius:2, overflow:'hidden' },
  credFill:  { height:'100%', borderRadius:2 },
  addBtn:    { borderRadius:R2.xl, padding:S2.lg, flexDirection:'row', alignItems:'center', gap:S2.md, marginBottom:S2.md, borderWidth:0.5 },
  freeBadge: { borderRadius:R2.full, paddingHorizontal:S2.sm, paddingVertical:3 },
  listCard:  { flexDirection:'row', gap:S2.md, borderRadius:R2.xl, padding:S2.lg, marginBottom:S2.sm, borderWidth:0.5, alignItems:'center' },
  listThumb: { width:64, height:60, borderRadius:R2.lg, alignItems:'center', justifyContent:'center', flexShrink:0 },
  editLBtn:  { borderRadius:R2.sm, paddingHorizontal:S2.md, paddingVertical:6, borderWidth:0.5, alignSelf:'flex-start' },
  wOwner:    { width:34, height:34, borderRadius:17, alignItems:'center', justifyContent:'center' },
  wOwnerTxt: { fontSize:12, fontWeight:'900', color:'#09090E' },
  settGroup: { borderRadius:R2.xl, borderWidth:0.5, overflow:'hidden', marginBottom:S2.sm },
  settRow:   { flexDirection:'row', alignItems:'center', gap:S2.md, paddingHorizontal:S2.lg, paddingVertical:S2.lg },
  logoutBtn: { flexDirection:'row', alignItems:'center', gap:S2.md, borderRadius:R2.xl, padding:S2.lg, marginTop:S2.xl, borderWidth:0.5 },
});
