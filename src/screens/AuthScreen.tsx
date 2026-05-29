import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated, ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../theme/ThemeContext';
import { TYPE, S, R } from '../theme/index';
import { sendOtp, verifyOtp } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function AuthScreen() {
  const { theme: T } = useTheme();
  const [step,    setStep]    = useState<'phone'|'otp'>('phone');
  const [phone,   setPhone]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const setAuth = useAuthStore(s => s.setAuth);
  const logoAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(logoAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
  }, []);

  const handleSend = async () => {
    if (phone.length !== 10) { setError('Enter a valid 10-digit number'); return; }
    setLoading(true); setError('');
    try { await sendOtp(phone); setStep('otp'); }
    catch { setError('Could not send OTP. Check your connection.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      const { token, user } = await verifyOtp(phone, otp);
      await SecureStore.setItemAsync('auth_token', token);
      setAuth(user, token);
    } catch { setError('Wrong OTP. Try again.'); }
    finally { setLoading(false); }
  };

  const devSkip = () => {
    setAuth({ id:'dev-1', name:'Dev User', phone:'9999999999', isOtpVerified:true,
      isEmailVerified:false, isIdVerified:false, isAadhaarVerified:false,
      isBroker:false, credits:3, createdAt:new Date().toISOString() }, 'dev-token');
  };

  const logoScale = logoAnim.interpolate({ inputRange:[0,1], outputRange:[0.6,1] });

  return (
    <KeyboardAvoidingView style={[as.container, { backgroundColor:T.bg }]}
      behavior={Platform.OS==='ios'?'padding':undefined}>
      <ScrollView contentContainerStyle={as.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <Animated.View style={[as.logoWrap, { transform:[{ scale: logoScale }], opacity: logoAnim }]}>
          <Text style={{ fontSize:64, marginBottom:S.lg }}>🗺️</Text>
          <Text style={[TYPE.h1, { color:T.text1, letterSpacing:-1.5 }]}>GharMap</Text>
          <Text style={[TYPE.sm, { color:T.text2, marginTop:S.sm, textAlign:'center', lineHeight:22 }]}>
            Find your home.{'\n'}Skip the broker.
          </Text>
          <View style={[as.pill, { backgroundColor:`${T.lime}12`, borderColor:`${T.lime}28` }]}>
            <Text style={[TYPE.xs, { color:T.lime, fontWeight:'800' }]}>🏠 Apna ghar, bina dalal ke</Text>
          </View>
        </Animated.View>

        {step === 'phone' ? (<>
          {/* Phone input */}
          <Text style={[TYPE.label, { color:T.text3, marginBottom:S.sm }]}>MOBILE NUMBER</Text>
          <View style={[as.phoneRow, { backgroundColor:T.surface2, borderColor: phone.length>0 ? T.lime+'44' : T.border2 }]}>
            <View style={[as.cc, { borderRightColor:T.border2 }]}>
              <Text style={{ fontSize:18 }}>🇮🇳</Text>
              <Text style={[TYPE.sm, { color:T.text2, fontWeight:'700' }]}>+91</Text>
            </View>
            <TextInput style={[as.inp, { color:T.text1 }]}
              placeholder="10-digit number" placeholderTextColor={T.text3}
              value={phone} onChangeText={v => setPhone(v.replace(/\D/g,'').slice(0,10))}
              keyboardType="phone-pad" maxLength={10} />
          </View>
          {!!error && <Text style={[TYPE.xs, { color:T.error, marginTop:S.sm }]}>{error}</Text>}
          <TouchableOpacity
            style={[as.btn, { backgroundColor: phone.length===10 ? T.lime : T.surface4, marginTop:S.lg }]}
            onPress={handleSend} disabled={loading || phone.length!==10}>
            {loading ? <ActivityIndicator color="#09090E" /> :
              <Text style={[TYPE.h4, { color: phone.length===10 ? '#09090E' : T.text3, fontWeight:'900' }]}>Send OTP →</Text>}
          </TouchableOpacity>

          {/* Dev skip */}
          <TouchableOpacity style={[as.devBtn, { backgroundColor:T.surface3, borderColor:T.border2 }]} onPress={devSkip}>
            <Text style={[TYPE.xs, { color:T.text3 }]}>⚡ Dev Skip Login</Text>
          </TouchableOpacity>

          {/* Feature pills */}
          <View style={as.features}>
            {['🔒 Privacy-first','₹0 Listing fee','🗺️ Map browse','🛡️ No brokers'].map(f => (
              <View key={f} style={[as.feature, { backgroundColor:T.surface3, borderColor:T.border1 }]}>
                <Text style={[TYPE.xs, { color:T.text2 }]}>{f}</Text>
              </View>
            ))}
          </View>
        </>) : (<>
          <TouchableOpacity onPress={() => setStep('phone')} style={{ marginBottom:S.xl }}>
            <Text style={[TYPE.sm, { color:T.text2 }]}>← Change number</Text>
          </TouchableOpacity>
          <Text style={[TYPE.h2, { color:T.text1, textAlign:'center', marginBottom:S.sm }]}>Verify OTP</Text>
          <Text style={[TYPE.sm, { color:T.text2, textAlign:'center', marginBottom:S.xl }]}>
            Code sent to <Text style={{ color:T.lime, fontWeight:'700' }}>+91 {phone}</Text>
          </Text>
          <TextInput style={[as.otpInp, { backgroundColor:T.surface2, borderColor: otp.length>0 ? T.lime+'44' : T.border2, color:T.text1 }]}
            placeholder="Enter 6-digit OTP" placeholderTextColor={T.text3}
            value={otp} onChangeText={v => setOtp(v.replace(/\D/g,'').slice(0,6))}
            keyboardType="number-pad" maxLength={6} />
          {!!error && <Text style={[TYPE.xs, { color:T.error, marginTop:S.sm }]}>{error}</Text>}
          <TouchableOpacity
            style={[as.btn, { backgroundColor: otp.length===6 ? T.lime : T.surface4, marginTop:S.lg }]}
            onPress={handleVerify} disabled={loading || otp.length!==6}>
            {loading ? <ActivityIndicator color="#09090E" /> :
              <Text style={[TYPE.h4, { color: otp.length===6 ? '#09090E' : T.text3, fontWeight:'900' }]}>Verify & Enter →</Text>}
          </TouchableOpacity>
          <Text style={[TYPE.xs, { color:T.text3, textAlign:'center', marginTop:S.lg }]}>Resend OTP in 0:45</Text>
        </>)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const as = StyleSheet.create({
  container: { flex:1 },
  scroll:    { flexGrow:1, padding:S.xl + S.md, justifyContent:'center' },
  logoWrap:  { alignItems:'center', marginBottom:S.xxxl },
  pill:      { borderRadius:R.full, paddingHorizontal:S.lg, paddingVertical:S.sm, borderWidth:0.5, marginTop:S.md },
  phoneRow:  { flexDirection:'row', borderRadius:R.xl, borderWidth:0.5, overflow:'hidden', marginBottom:S.xs },
  cc:        { flexDirection:'row', alignItems:'center', gap:S.sm, paddingHorizontal:S.lg, borderRightWidth:0.5 },
  inp:       { flex:1, ...TYPE.h4, padding:S.lg },
  btn:       { borderRadius:R.xl, padding:S.lg, alignItems:'center' },
  devBtn:    { borderRadius:R.xl, padding:S.md, alignItems:'center', marginTop:S.md, borderWidth:0.5 },
  features:  { flexDirection:'row', flexWrap:'wrap', gap:S.sm, justifyContent:'center', marginTop:S.xl },
  feature:   { borderRadius:R.full, paddingHorizontal:S.md, paddingVertical:S.sm, borderWidth:0.5 },
  otpInp:    { borderRadius:R.xl, borderWidth:0.5, padding:S.xl, ...TYPE.h2, textAlign:'center', letterSpacing:12, marginBottom:S.xs },
});
