import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, KeyboardAvoidingView, Platform, Animated, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { PulseDot } from '../components/UI';

const QUICK = ['🏠 2BHK under ₹15K', '🛏️ PG in Pune', '🗺️ Best areas', '🤝 How to connect', '💰 Deposit norms', '🛡️ Is it safe'];
const RULES: { p: RegExp; r: string }[] = [
  { p: /2bhk|two bhk/i,    r: "Found great 2BHK options! 🏠\n\n• Kothrud — ₹12,000/mo · Semi-furnished\n• Aundh — ₹14,500/mo · Fully furnished\n• Wakad — ₹11,000/mo · Unfurnished\n\nAll verified owners. Want me to show on map?" },
  { p: /pg|paying guest/i, r: "Top PG options in Pune 🏨\n\n• Girls PG, Koregaon Park — ₹6,500/mo (meals)\n• Mixed PG, Baner — ₹7,000/mo\n• Boys PG, Kothrud — ₹5,500/mo\n\nZero broker fees on GharMap!" },
  { p: /area|locality/i,   r: "Top areas by budget:\n\n💰 Under ₹10K: Hadapsar, Wanowrie\n💼 ₹10–18K: Kothrud, Aundh, Wakad\n✨ ₹18K+: Koregaon Park, Kalyani Nagar" },
  { p: /connect|owner/i,   r: "How GharMap connect works 🤝\n\n1. Tap property → Request to Connect\n2. Write intro message\n3. Owner reviews your profile\n4. Approval → address + chat unlocks\n\nPhone never shared without consent 🔒" },
  { p: /deposit|advance/i, r: "Typical Pune deposits 💰\n\nRent: 1–2 months advance\nPG: Usually 1 month\nBuy: 10–20% of price\n\nNegotiate directly, no middleman!" },
  { p: /safe|scam|trust/i, r: "GharMap safety features 🛡️\n\n✓ Phone OTP verification\n✓ ID verified badge\n✓ Masked communication\n✓ Anti-broker AI\n✓ Women-only mode\n✓ Suspicious behavior detection" },
  { p: /hello|hi|namaste/i,r: "Namaste! 🙏 I'm GharBot.\n\nI help you:\n• Find properties by budget\n• Understand how GharMap works\n• Answer renting questions\n\nWhat are you looking for?" },
  { p: /price|rent|budget/i,r:"Average Pune rents 2025 📊\n\n1BHK: ₹8,000–₹14,000/mo\n2BHK: ₹12,000–₹22,000/mo\n3BHK: ₹18,000–₹40,000/mo\nPG: ₹5,000–₹9,000/mo" },
  { p: /broker|commission/i,r:"That's why GharMap exists! 🎯\n\nBrokers charge 1–2 months rent just for introductions.\n\n✓ Direct owner contact\n✓ ₹0 listing fee\n✓ ₹0 to browse\n✓ Optional ₹29 to unlock phone vs ₹30,000 broker!" },
];

function getReply(input: string) {
  return RULES.find(r => r.p.test(input))?.r ??
    "Great question! 🤔\nTry asking about:\n• Finding properties by area\n• How owner connections work\n• Typical rent prices\n• GharMap safety features";
}

const MOCK_CHATS = [
  { id:'1', name:'Ravi Kumar',    init:'RK', color:'#8B7FEE', listing:'2BHK · Kothrud',       last:'Saturday 5pm works!',    time:'2m',  unread:2 },
  { id:'2', name:'Sunita Agarwal',init:'SA', color:'#FF5C7A', listing:'Girls PG · KP',         last:'Yes meals are included 😊',time:'1h',  unread:0 },
  { id:'3', name:'Ankit Mehta',   init:'AM', color:'#FFA820', listing:'Room · Viman Nagar',    last:'Request approved!',       time:'3h',  unread:1 },
];

interface Msg { id:string; from:'user'|'bot'; text:string }

function TypingDot({ delay }: { delay:number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(a, { toValue:-5, duration:280, useNativeDriver:true }),
      Animated.timing(a, { toValue:0,  duration:280, useNativeDriver:true }),
    ])).start();
  }, []);
  return <Animated.View style={{ width:7, height:7, borderRadius:3.5, backgroundColor:'#8D8FAC', transform:[{translateY:a}] }} />;
}

export default function ChatBotScreen() {
  const nav = useNavigation<any>();
  const { theme: T } = useTheme();
  const [tab, setTab] = useState<'bot'|'chats'>('bot');
  const [msgs, setMsgs] = useState<Msg[]>([
    { id:'0', from:'bot', text:"Namaste! 🙏 I'm GharBot.\n\nI can help you find properties, understand how GharMap works, or answer renting questions in Pune.\n\nWhat are you looking for?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = (t?: string) => {
    const msg = t ?? input.trim();
    if (!msg) return;
    const u: Msg = { id: Date.now().toString(), from:'user', text:msg };
    setMsgs(p => [...p, u]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(p => [...p, { id:(Date.now()+1).toString(), from:'bot', text:getReply(msg) }]);
      setTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated:true }), 100);
    }, 900 + Math.random() * 700);
    setTimeout(() => listRef.current?.scrollToEnd({ animated:true }), 100);
  };

  return (
    <KeyboardAvoidingView style={[cs.container, { backgroundColor:T.bg }]}
      behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={90}>

      {/* Header */}
      <View style={[cs.header, { backgroundColor:T.surface1, borderBottomColor:T.border1 }]}>
        <View style={[cs.botAvt, { backgroundColor:`${T.lime}18`, borderColor:`${T.lime}40` }]}>
          <Text style={{ fontSize:20 }}>🤖</Text>
        </View>
        <View style={{ flex:1 }}>
          <Text style={[TYPE.h4, { color:T.text1 }]}>GharBot</Text>
          <View style={{ flexDirection:'row', alignItems:'center', gap:5, marginTop:2 }}>
            <PulseDot color={T.success} />
            <Text style={[TYPE.label, { color:T.success }]}>Always online</Text>
          </View>
        </View>
        <View style={[cs.tabSwitch, { backgroundColor:T.surface3 }]}>
          {(['bot','chats'] as const).map(t => (
            <TouchableOpacity key={t} style={[cs.tabBtn, tab===t && { backgroundColor:T.surface1 }]} onPress={() => setTab(t)}>
              <Text style={[TYPE.xs, { color: tab===t ? T.text1 : T.text3, fontWeight:'700' }]}>{t==='bot'?'🤖 Bot':'💬 Chats'}</Text>
              {t==='chats' && MOCK_CHATS.reduce((a,c)=>a+c.unread,0)>0 && (
                <View style={[cs.tbadge, { backgroundColor:T.rose }]}>
                  <Text style={{ fontSize:8, fontWeight:'900', color:'white' }}>{MOCK_CHATS.reduce((a,c)=>a+c.unread,0)}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tab==='bot' && (<>
        <FlatList ref={listRef} data={msgs} keyExtractor={i=>i.id}
          contentContainerStyle={{ padding:S.lg, gap:S.md }}
          renderItem={({ item:m }) => (
            <View style={{ alignItems:m.from==='user'?'flex-end':'flex-start' }}>
              {m.from==='bot' && <View style={[cs.botAvtSm, { backgroundColor:`${T.lime}14` }]}><Text style={{ fontSize:12 }}>🤖</Text></View>}
              <View style={[cs.bubble, m.from==='user'
                ? { backgroundColor:T.lime, borderBottomRightRadius:4 }
                : { backgroundColor:T.surface3, borderBottomLeftRadius:4 }]}>
                <Text style={[TYPE.sm, { color:m.from==='user'?'#09090E':T.text1, lineHeight:21 }]}>{m.text}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={typing ? (
            <View style={{ alignItems:'flex-start' }}>
              <View style={[cs.bubble, { backgroundColor:T.surface3, borderBottomLeftRadius:4, flexDirection:'row', gap:5, paddingVertical:12 }]}>
                <TypingDot delay={0} /><TypingDot delay={160} /><TypingDot delay={320} />
              </View>
            </View>
          ) : null}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap:S.sm, paddingHorizontal:S.lg, paddingVertical:S.sm }}>
          {QUICK.map(q => (
            <TouchableOpacity key={q} style={[cs.qr, { backgroundColor:T.surface3, borderColor:T.border1 }]} onPress={()=>send(q)}>
              <Text style={[TYPE.xs, { color:T.text2 }]}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={[cs.inputRow, { backgroundColor:T.surface1, borderTopColor:T.border1 }]}>
          <TextInput style={[cs.input, { backgroundColor:T.surface3, borderColor:T.border2, color:T.text1 }]}
            placeholder="Ask GharBot anything…" placeholderTextColor={T.text3}
            value={input} onChangeText={setInput} multiline returnKeyType="send"
            onSubmitEditing={() => send()} />
          <TouchableOpacity style={[cs.sendBtn, { backgroundColor: input.trim() ? T.lime : T.surface4 }]}
            onPress={() => send()} disabled={!input.trim()}>
            <Text style={{ fontSize:16, color: input.trim() ? '#09090E' : T.text3 }}>→</Text>
          </TouchableOpacity>
        </View>
      </>)}

      {tab==='chats' && (
        <FlatList data={MOCK_CHATS} keyExtractor={i=>i.id}
          contentContainerStyle={{ paddingHorizontal:S.lg, paddingTop:S.md, paddingBottom:100 }}
          renderItem={({ item:c }) => (
            <TouchableOpacity style={[cs.chatRow, { borderBottomColor:T.border1 }]}
              onPress={() => nav.navigate('Chat', { connectionId:c.id, otherName:c.name, listingTitle:c.listing })}>
              <View style={{ position:'relative' }}>
                <View style={[cs.chatAvt, { backgroundColor:c.color }]}>
                  <Text style={cs.chatInit}>{c.init}</Text>
                </View>
                {c.unread>0 && <View style={[cs.unread, { backgroundColor:T.lime, borderColor:T.bg }]}>
                  <Text style={{ fontSize:8, fontWeight:'900', color:'#09090E' }}>{c.unread}</Text>
                </View>}
              </View>
              <View style={{ flex:1 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:2 }}>
                  <Text style={[TYPE.h4, { color:T.text1 }]}>{c.name}</Text>
                  <Text style={[TYPE.label, { color:T.text3 }]}>{c.time} ago</Text>
                </View>
                <Text style={[TYPE.xs, { color:T.violet, fontWeight:'700', marginBottom:2 }]}>{c.listing}</Text>
                <Text style={[TYPE.sm, { color:T.text2 }]} numberOfLines={1}>{c.last}</Text>
              </View>
            </TouchableOpacity>
          )} />
      )}
    </KeyboardAvoidingView>
  );
}

const cs = StyleSheet.create({
  container:  { flex:1 },
  header:     { flexDirection:'row', alignItems:'center', gap:S.md, paddingHorizontal:S.lg, paddingTop:56, paddingBottom:S.md, borderBottomWidth:0.5 },
  botAvt:     { width:44, height:44, borderRadius:22, alignItems:'center', justifyContent:'center', borderWidth:1.5 },
  botAvtSm:   { width:24, height:24, borderRadius:12, alignItems:'center', justifyContent:'center', marginBottom:4 },
  tabSwitch:  { flexDirection:'row', borderRadius:R.md, padding:3, gap:3 },
  tabBtn:     { paddingHorizontal:S.md-2, paddingVertical:5, borderRadius:R.sm, flexDirection:'row', alignItems:'center', gap:4 },
  tbadge:     { width:16, height:16, borderRadius:8, alignItems:'center', justifyContent:'center' },
  bubble:     { maxWidth:'80%', borderRadius:18, padding:S.md },
  qr:         { borderRadius:R.full, paddingHorizontal:S.md, paddingVertical:7, borderWidth:0.5 },
  inputRow:   { flexDirection:'row', alignItems:'flex-end', gap:S.sm, padding:S.md, paddingBottom:24, borderTopWidth:0.5 },
  input:      { flex:1, borderRadius:22, paddingHorizontal:S.lg, paddingVertical:S.md-2, borderWidth:0.5, maxHeight:100, ...TYPE.sm },
  sendBtn:    { width:42, height:42, borderRadius:21, alignItems:'center', justifyContent:'center' },
  chatRow:    { flexDirection:'row', alignItems:'center', gap:S.md, paddingVertical:S.lg, borderBottomWidth:0.5 },
  chatAvt:    { width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center' },
  chatInit:   { fontSize:18, fontWeight:'900', color:'#09090E' },
  unread:     { position:'absolute', top:-2, right:-2, width:18, height:18, borderRadius:9, alignItems:'center', justifyContent:'center', borderWidth:2 },
});