import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { requestConnect } from '../api/connections';
import { useConnectionStore } from '../store/connectionStore';

interface Props { listingId:string; listingTitle:string; ownerName:string; onClose:()=>void; onSuccess:()=>void; }

export default function ConnectRequestSheet({ listingId, listingTitle, ownerName, onClose, onSuccess }: Props) {
  const { theme: T } = useTheme();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const setConn = useConnectionStore(s => s.setConnection);

  const send = async () => {
    if (message.trim().length < 10) { Alert.alert('Add a message','Write at least 10 characters about yourself'); return; }
    setLoading(true);
    try {
      const conn = await requestConnect(listingId, message.trim());
      setConn(listingId, conn);
      onSuccess();
    } catch { Alert.alert('Error','Could not send request. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined}>
      <View style={[crs.sheet, { backgroundColor:T.surface1, borderTopColor:T.border2 }]}>
        <View style={[crs.handle, { backgroundColor:T.border3 }]} />
        <Text style={[TYPE.h3, { color:T.text1, textAlign:'center', marginBottom:S.sm }]}>Request to Connect</Text>
        <Text style={[TYPE.sm, { color:T.text2, textAlign:'center', lineHeight:22, marginBottom:S.xl }]}>{ownerName} will see your verified profile.{'\n'}Address unlocks only after they approve.</Text>
        <View style={[crs.pill, { backgroundColor:T.surface3, borderColor:T.border1 }]}>
          <Text style={[TYPE.label, { color:T.text3 }]}>LISTING</Text>
          <Text style={[TYPE.sm, { color:T.text1, fontWeight:'600', flex:1 }]} numberOfLines={1}>{listingTitle}</Text>
        </View>
        <Text style={[TYPE.label, { color:T.text3, marginBottom:S.sm, marginTop:S.lg }]}>YOUR MESSAGE</Text>
        <TextInput style={[crs.input, { backgroundColor:T.surface2, borderColor:T.border2, color:T.text1 }]}
          placeholder="Hi! I'm a working professional looking from June…"
          placeholderTextColor={T.text3} multiline value={message} onChangeText={setMessage} maxLength={300} />
        <Text style={[TYPE.label, { color:T.text3, textAlign:'right', marginTop:S.xs }]}>{message.length}/300</Text>
        <View style={[crs.privBox, { backgroundColor:`${T.lime}0A`, borderColor:`${T.lime}20` }]}>
          <Text style={[TYPE.xs, { color:T.text2, lineHeight:17 }]}>🛡️ Your phone stays hidden. Exact address only after approval. Chat is always free.</Text>
        </View>
        <View style={{ flexDirection:'row', gap:S.sm, marginTop:S.xl }}>
          <TouchableOpacity style={[crs.cancelBtn, { backgroundColor:T.surface4, borderColor:T.border2 }]} onPress={onClose}>
            <Text style={[TYPE.h4, { color:T.text2 }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[crs.sendBtn, { backgroundColor: message.trim().length>=10 ? T.lime : T.surface4 }]} onPress={send} disabled={loading}>
            {loading ? <ActivityIndicator color="#09090E" /> : <Text style={[TYPE.h4, { color: message.trim().length>=10 ? '#09090E' : T.text3, fontWeight:'900' }]}>Send Request</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const crs = StyleSheet.create({
  sheet:    { borderTopLeftRadius:R.xxl, borderTopRightRadius:R.xxl, padding:S.xl, paddingBottom:34, borderTopWidth:0.5 },
  handle:   { width:40, height:4, borderRadius:2, alignSelf:'center', marginBottom:S.xl },
  pill:     { flexDirection:'row', alignItems:'center', gap:S.md, borderRadius:R.lg, padding:S.md, borderWidth:0.5 },
  input:    { borderRadius:R.lg, borderWidth:0.5, padding:S.lg, minHeight:90, textAlignVertical:'top', lineHeight:20, ...TYPE.sm },
  privBox:  { borderRadius:R.lg, borderWidth:0.5, padding:S.md, marginTop:S.lg },
  cancelBtn:{ flex:1, borderRadius:R.xl, padding:S.lg, alignItems:'center', borderWidth:0.5 },
  sendBtn:  { flex:2, borderRadius:R.xl, padding:S.lg, alignItems:'center' },
});
