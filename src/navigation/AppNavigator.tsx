import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import AuthScreen          from '../screens/AuthScreen';
import HomeScreen          from '../screens/HomeScreen';
import MapScreen           from '../screens/MapScreen';
import ChatBotScreen       from '../screens/ChatBotScreen';
import ProfileScreen       from '../screens/ProfileScreen';
import PostListingScreen   from '../screens/PostListingScreen';
import ZoneListingsScreen  from '../screens/ZoneListingsScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import ChatScreen          from '../screens/ChatScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TABS = [
  { key:'HomeTab',    label:'Home',  icon:'🏠' },
  { key:'MapTab',     label:'Map',   icon:'🗺️' },
  { key:'PostTab',    label:'',      icon:null  },
  { key:'ChatTab',    label:'Chat',  icon:'💬' },
  { key:'ProfileTab', label:'Me',    icon:'👤' },
];

function TabBar({ state, navigation }: any) {
  const { theme: T } = useTheme();
  const unread = 3;
  return (
    <View style={[nb.bar, { backgroundColor: T.surface1, borderTopColor: T.border1 }]}>
      {TABS.map((tab, i) => {
        const focused = state.index === i;
        if (tab.key === 'PostTab') return (
          <TouchableOpacity key="post" style={nb.fabWrap} onPress={() => navigation.navigate('Post')}>
            <View style={[nb.fab, { backgroundColor: T.lime }]}>
              <Text style={nb.fabTxt}>＋</Text>
            </View>
          </TouchableOpacity>
        );
        return (
          <TouchableOpacity key={tab.key} style={nb.tab} onPress={() => navigation.navigate(tab.key)}>
            <View style={{ position:'relative' }}>
              <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
              {tab.key === 'ChatTab' && unread > 0 && (
                <View style={[nb.badge, { backgroundColor: T.rose, borderColor: T.bg }]}>
                  <Text style={nb.badgeTxt}>{unread}</Text>
                </View>
              )}
            </View>
            <Text style={[TYPE.label, { color: focused ? T.lime : T.text3, marginTop: 3 }]}>
              {tab.label.toUpperCase()}
            </Text>
            {focused && <View style={[nb.dot, { backgroundColor: T.lime }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const nb = StyleSheet.create({
  bar:    { height: 76, flexDirection:'row', alignItems:'center', justifyContent:'space-around', paddingHorizontal:S.sm, paddingBottom:S.lg, borderTopWidth:0.5 },
  tab:    { alignItems:'center', justifyContent:'center', paddingTop:S.sm, gap:2, minWidth:52 },
  fabWrap:{ alignItems:'center', justifyContent:'center' },
  fab:    { width:52, height:52, borderRadius:26, alignItems:'center', justifyContent:'center', marginBottom:S.sm },
  fabTxt: { fontSize:28, fontWeight:'900', color:'#09090E', lineHeight:32 },
  badge:  { position:'absolute', top:-4, right:-8, width:16, height:16, borderRadius:8, alignItems:'center', justifyContent:'center', borderWidth:1.5 },
  badgeTxt: { fontSize:8, fontWeight:'900', color:'white' },
  dot:    { width:4, height:4, borderRadius:2, marginTop:2 },
});

function MainTabs() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown:false }}>
      <Tab.Screen name="HomeTab"    component={HomeScreen}       />
      <Tab.Screen name="MapTab"     component={MapScreen}        />
      <Tab.Screen name="PostTab"    component={PostListingScreen}/>
      <Tab.Screen name="ChatTab"    component={ChatBotScreen}    />
      <Tab.Screen name="ProfileTab" component={ProfileScreen}    />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  return (
    <Stack.Navigator screenOptions={{ headerShown:false, cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: { transform: [{ translateX: current.progress.interpolate({ inputRange:[0,1], outputRange:[layouts.screen.width,0] }) }] }
    })}}>
      {!isLoggedIn
        ? <Stack.Screen name="Auth"  component={AuthScreen} />
        : <>
            <Stack.Screen name="Main"          component={MainTabs}           />
            <Stack.Screen name="ZoneListings"  component={ZoneListingsScreen} />
            <Stack.Screen name="ListingDetail" component={ListingDetailScreen}/>
            <Stack.Screen name="Chat"          component={ChatScreen}         />
            <Stack.Screen name="Post"          component={PostListingScreen}  />
          </>
      }
    </Stack.Navigator>
  );
}

