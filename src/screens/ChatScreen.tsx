import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { ScreenHeader } from '../components/UI';
import apiClient from '../api/client';
import { unlockPhone } from '../api/connections';

const MOCK_MSGS = [
  { id:'1', sender_id:'other', content:'Hi! Happy to connect about the 2BHK in Kothrud.', created_at: new Date().toISOString() },
  { id:'2', sender_id:'me',    content:"Great! Is it available from June 1st? I'm relocating from Bangalore.", created_at: new Date().toISOString() },
  { id:'3', sender_id:'other', content:'Yes! Semi-furnished, 2nd floor. Great ventilation.', created_at: new Date().toISOString() },
  { id:'4', sender_id:'me',    content:'Can I visit Saturday?', created_at: new Date().toISOString() },
  { id:'5', sender_id:'other', content:'Saturday 5pm works perfectly!', created_at: new Date().toISOString() },
];

export default function ChatScreen() {
  const nav   = useNavigation<any>();
  const route = useRoute<any>();
  const { theme: T } = useTheme();
  const { connectionId, otherName, listingTitle } = route.params ?? {};
  const [messages,  setMessages]  = useState<any[]>(MOCK_MSGS);
  const [text,      setText]      = useState('');
  const [unlocked,  setUnlocked]  = useState(false);
  const [phone,     setPhone]     = useState('');
  const socketRef = useRef<Socket | null>(null);
  const listRef   = useRef<FlatList>(null);
  const myId = 'me';

  useEffect(() => {
    apiClient.get(`/api/chat/${connectionId}/messages`)
      .then(r => { if (r.data.messages?.length) setMessages(r.data.messages); })
      .catch(() => {});
    (async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;
      const socket = io(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000', { auth:{ token } });
      socketRef.current = socket;
      socket.emit('join_chat', connectionId);
      socket.on('new_message', (msg: any) => {
        setMessages(p => [...p, msg]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated:true }), 100);
      });
    })();
    return () => { socketRef.current?.disconnect(); };
  }, [connectionId]);

  const send = () => {
    if (!text.trim()) return;
    socketRef.current?.emit('send_message', { connectionId, content:text.trim(), type:'text' });
    setMessages(p => [...p, { id:Date.now().toString(), sender_id:myId, content:text.trim(), created_at:new Date().toISOString() }]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated:true }), 100);
  };

  const handleUnlock = () => {
    Alert.alert('Unlock Phone Number', 'Use 1 free credit to unlock the owner\'s number?', [
      { text:'Cancel', style:'cancel' },
      { text:'Unlock', onPress: async () => {
          try { const d = await unlockPhone(connectionId); setPhone(d.phone); setUnlocked(true); }
          catch { Alert.alert('Error','Failed to unlock. Try again.'); }
      }},
    ]);
  };

  const fmtTime = (t: string) => new Date(t).toLocaleTimeString('en-IN',{ hour:'2-digit', minute:'2-digit' });

  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:T.bg }}
      behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={90}>
      <ScreenHeader title={otherName ?? 'Chat'} subtitle={listingTitle}
        right={<TouchableOpacity style={[chs.headerBtn, { backgroundColor:T.surface3, borderColor:T.border1 }]}>
          <Text style={[TYPE.xs, { color:T.text1, fontWeight:'700' }]}>📋 Listing</Text>
        </TouchableOpacity>} />

      <FlatList ref={listRef} data={messages} keyExtractor={i=>i.id}
        contentContainerStyle={{ padding:S.lg, gap:S.md }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated:false })}
        renderItem={({ item:m }) => {
          const isMe = m.sender_id === myId;
          return (
            <View style={{ alignItems: isMe?'flex-end':'flex-start' }}>
              <View style={[chs.bubble, isMe ? { backgroundColor:T.lime, borderBottomRightRadius:4 } : { backgroundColor:T.surface3, borderBottomLeftRadius:4 }]}>
                <Text style={[TYPE.sm, { color: isMe?'#09090E':T.text1, lineHeight:21 }]}>{m.content}</Text>
                <Text style={[TYPE.label, { opacity:0.55, marginTop:3, textAlign: isMe?'right':'left', color: isMe?'#09090E':T.text3 }]}>
                  {fmtTime(m.created_at)}{isMe?' ✓✓':''}
                </Text>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          !unlocked ? (
            <View style={[chs.unlockCard, { backgroundColor:T.surface2, borderColor:`${T.lime}30` }]}>
              <Text style={[TYPE.h4, { color:T.text1, marginBottom:5 }]}>🔓 Unlock Phone Number</Text>
              <Text style={[TYPE.xs, { color:T.text2, lineHeight:17, marginBottom:S.md }]}>
                Chat is always free. Unlock owner's number for ₹29 or 1 credit.
              </Text>
              <View style={{ flexDirection:'row', gap:S.sm }}>
                <TouchableOpacity style={[chs.unlockBtn, { backgroundColor:T.lime }]} onPress={handleUnlock}>
                  <Text style={[TYPE.xs, { color:'#09090E', fontWeight:'900' }]}>Use 1 Credit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[chs.unlockBtn, { backgroundColor:T.surface4, borderWidth:0.5, borderColor:T.border2 }]} onPress={handleUnlock}>
                  <Text style={[TYPE.xs, { color:T.text1, fontWeight:'700' }]}>Pay ₹29</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[chs.phoneRevealed, { backgroundColor:T.surface3, borderColor:`${T.lime}25` }]}>
              <Text style={[TYPE.label, { color:T.lime, marginBottom:3 }]}>PHONE UNLOCKED</Text>
              <Text style={[TYPE.h3, { color:T.text1 }]}>📞 {phone}</Text>
            </View>
          )
        }
      />

      <View style={[chs.inputRow, { backgroundColor:T.surface1, borderTopColor:T.border1 }]}>
        <TouchableOpacity style={{ padding:S.sm }}><Text style={{ fontSize:20 }}>📷</Text></TouchableOpacity>
        <TextInput style={[chs.input, { backgroundColor:T.surface3, borderColor:T.border2, color:T.text1 }]}
          placeholder="Type a message…" placeholderTextColor={T.text3}
          value={text} onChangeText={setText} multiline returnKeyType="send"
          onSubmitEditing={send} />
        <TouchableOpacity style={[chs.sendBtn, { backgroundColor: text.trim() ? T.lime : T.surface4 }]} onPress={send}>
          <Text style={{ fontSize:17, color: text.trim()?'#09090E':T.text3 }}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const chs = StyleSheet.create({
  headerBtn:    { borderRadius:R.md, paddingHorizontal:S.md, paddingVertical:S.sm, borderWidth:0.5 },
  bubble:       { maxWidth:'80%', borderRadius:18, padding:S.md },
  unlockCard:   { borderRadius:R.xl, padding:S.lg, marginTop:S.md, borderWidth:0.5, borderStyle:'dashed' },
  unlockBtn:    { flex:1, borderRadius:R.lg, padding:S.md, alignItems:'center' },
  phoneRevealed:{ borderRadius:R.lg, padding:S.md, marginTop:S.md, borderWidth:0.5 },
  inputRow:     { flexDirection:'row', alignItems:'flex-end', gap:S.sm, padding:S.md, paddingBottom:24, borderTopWidth:0.5 },
  input:        { flex:1, borderRadius:22, paddingHorizontal:S.lg, paddingVertical:S.md-2, borderWidth:0.5, maxHeight:100, ...TYPE.sm },
  sendBtn:      { width:42, height:42, borderRadius:21, alignItems:'center', justifyContent:'center' },
});

