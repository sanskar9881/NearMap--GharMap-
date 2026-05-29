import React, { useState as useState3 } from 'react';
import {
  View as V3, Text as T3, ScrollView as SV3, StyleSheet as SS3,
  TouchableOpacity as TO3, TextInput as TI3, Alert as A3, ActivityIndicator as AI3,
} from 'react-native';
import { useNavigation as useNav3 } from '@react-navigation/native';
import * as IP from 'expo-image-picker';
import { useTheme as useTheme3 } from '../theme/ThemeContext';
import { TYPE as TYP3, S as S3, R as R3 } from '../theme/index';
import { ScreenHeader, PrimaryButton } from '../components/UI';
import apiClient from '../api/client';

const TYPES3   = [['rent','🏠','Rent','Flat / house'],['buy','🏛️','Sell','Property for sale'],['room','🛏️','Flatmate','Looking for roommate'],['pg','🏨','PG','Paying guest']];
const FURNISH3 = [['full','Fully Furnished'],['semi','Semi-Furnished'],['none','Unfurnished']];
const BHK3     = ['Studio','1BHK','2BHK','3BHK','4BHK','Room'];
const AMEN3    = ['Parking','Lift','WiFi','AC','Power Backup','Gym','Security','CCTV','Washing Machine','Geyser','Meals','Balcony'];

export default function PostListingScreen() {
  const nav = useNav3<any>();
  const { theme: T } = useTheme3();
  const [step,    setStep]    = useState3(1);
  const [loading, setLoading] = useState3(false);
  const [photos,  setPhotos]  = useState3<string[]>([]);
  const [form,    setForm]    = useState3({ type:'', title:'', price:'', deposit:'', bhk:'', floor:'', sqft:'', furnishing:'', address:'', approximateArea:'', description:'', amenities: [] as string[] });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]:v }));
  const toggleAmen = (a: string) => set('amenities', form.amenities.includes(a) ? form.amenities.filter(x=>x!==a) : [...form.amenities, a]);

  const pickPhoto = async () => {
    const res = await IP.launchImageLibraryAsync({ mediaTypes: IP.MediaTypeOptions.Images, allowsMultipleSelection:true, quality:0.85 });
    if (!res.canceled) setPhotos(p => [...p, ...res.assets.map(a=>a.uri)].slice(0,10));
  };

  const submit = async () => {
    if (!form.type || !form.title || !form.price) { A3.alert('Missing info','Fill in type, title, and price'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v)));
      photos.forEach((uri,i) => fd.append('photos', { uri, name:`photo_${i}.jpg`, type:'image/jpeg' } as any));
      await apiClient.post('/api/listings', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      A3.alert('Posted! 🎉','Your property is now live on GharMap.',[{ text:'OK', onPress:()=>nav.navigate('Main') }]);
    } catch { A3.alert('Error','Failed to post. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <V3 style={{ flex:1, backgroundColor:T.bg }}>
      <ScreenHeader title="Post Property" showBack={true} right={
        <V3 style={{ flexDirection:'row', gap:6 }}>
          {[1,2,3].map(s => (
            <V3 key={s} style={{ width:24, height:24, borderRadius:12,
              backgroundColor: step>=s ? T.lime : T.surface4,
              alignItems:'center', justifyContent:'center' }}>
              <T3 style={{ fontSize:10, fontWeight:'900', color: step>=s ? '#09090E' : T.text3 }}>{s}</T3>
            </V3>
          ))}
        </V3>
      } />

      {/* Progress */}
      <V3 style={{ height:2, backgroundColor:T.surface3 }}>
        <V3 style={{ height:'100%', backgroundColor:T.lime, width:`${(step/3)*100}%` }} />
      </V3>

      <SV3 contentContainerStyle={{ padding:S3.xl, paddingBottom:60 }} showsVerticalScrollIndicator={false}>

        {step===1 && (<>
          <T3 style={[TYP3.h2, { color:T.text1, marginBottom:S3.sm }]}>What are you listing?</T3>
          <T3 style={[TYP3.sm, { color:T.text2, marginBottom:S3.xl }]}>Choose your property type</T3>
          <V3 style={{ flexDirection:'row', flexWrap:'wrap', gap:S3.md }}>
            {TYPES3.map(([key,emoji,label,desc]) => (
              <TO3 key={key} style={[pls.typeCard, { width:'47%', backgroundColor:T.surface2, borderColor: form.type===key ? T.lime : T.border1 }]} onPress={() => set('type',key)}>
                <T3 style={{ fontSize:32, marginBottom:S3.sm }}>{emoji}</T3>
                <T3 style={[TYP3.h4, { color:T.text1, marginBottom:3 }]}>{label}</T3>
                <T3 style={[TYP3.xs, { color:T.text3 }]}>{desc}</T3>
              </TO3>
            ))}
          </V3>
          <PrimaryButton label="Continue →" onPress={() => form.type && setStep(2)}
            disabled={!form.type} style={{ marginTop:S3.xl }} />
        </>)}

        {step===2 && (<>
          <TO3 onPress={() => setStep(1)} style={{ marginBottom:S3.xl }}><T3 style={[TYP3.sm, { color:T.text2 }]}>← Back</T3></TO3>
          <T3 style={[TYP3.h2, { color:T.text1, marginBottom:S3.sm }]}>Basic Details</T3>
          <T3 style={[TYP3.sm, { color:T.text2, marginBottom:S3.xl }]}>Tell seekers about your property</T3>
          {[['Title','title','2BHK near MG Road'],['Monthly Price (₹)','price','12000'],['Deposit (₹)','deposit','24000'],['Area (sqft)','sqft','850'],['Floor No.','floor','2nd'],['Approx Location Hint','approximateArea','near Prabhat Rd']].map(([label,key,ph]) => (
            <V3 key={key} style={{ marginBottom:S3.lg }}>
              <T3 style={[TYP3.label, { color:T.text3, marginBottom:S3.sm }]}>{(label as string).toUpperCase()}</T3>
              <TI3 style={[pls.input, { backgroundColor:T.surface2, borderColor:T.border2, color:T.text1 }]}
                placeholder={ph as string} placeholderTextColor={T.text3}
                value={(form as any)[key as string]} onChangeText={v => set(key as string, v)} />
            </V3>
          ))}
          <T3 style={[TYP3.label, { color:T.text3, marginBottom:S3.sm }]}>BHK TYPE</T3>
          <V3 style={{ flexDirection:'row', flexWrap:'wrap', gap:S3.sm, marginBottom:S3.lg }}>
            {BHK3.map(b => (
              <TO3 key={b} style={[pls.chip, { backgroundColor: form.bhk===b ? `${T.lime}20` : T.surface3, borderColor: form.bhk===b ? T.lime : T.border1 }]} onPress={() => set('bhk',b)}>
                <T3 style={[TYP3.xs, { color: form.bhk===b ? T.lime : T.text2, fontWeight:'700' }]}>{b}</T3>
              </TO3>
            ))}
          </V3>
          <T3 style={[TYP3.label, { color:T.text3, marginBottom:S3.sm }]}>FURNISHING</T3>
          <V3 style={{ flexDirection:'row', gap:S3.sm, marginBottom:S3.lg }}>
            {FURNISH3.map(([k,l]) => (
              <TO3 key={k} style={[pls.chip, { flex:1, backgroundColor: form.furnishing===k ? `${T.lime}20` : T.surface3, borderColor: form.furnishing===k ? T.lime : T.border1 }]} onPress={() => set('furnishing',k)}>
                <T3 style={[TYP3.xs, { color: form.furnishing===k ? T.lime : T.text2, fontWeight:'700', textAlign:'center' }]}>{l}</T3>
              </TO3>
            ))}
          </V3>
          <T3 style={[TYP3.label, { color:T.text3, marginBottom:S3.sm }]}>AMENITIES</T3>
          <V3 style={{ flexDirection:'row', flexWrap:'wrap', gap:S3.sm, marginBottom:S3.xl }}>
            {AMEN3.map(a => (
              <TO3 key={a} style={[pls.chip, { backgroundColor: form.amenities.includes(a) ? `${T.teal}18` : T.surface3, borderColor: form.amenities.includes(a) ? T.teal : T.border1 }]} onPress={() => toggleAmen(a)}>
                <T3 style={[TYP3.xs, { color: form.amenities.includes(a) ? T.teal : T.text2, fontWeight:'700' }]}>{a}</T3>
              </TO3>
            ))}
          </V3>
          <PrimaryButton label="Continue →" onPress={() => setStep(3)} style={{}} />
        </>)}

        {step===3 && (<>
          <TO3 onPress={() => setStep(2)} style={{ marginBottom:S3.xl }}><T3 style={[TYP3.sm, { color:T.text2 }]}>← Back</T3></TO3>
          <T3 style={[TYP3.h2, { color:T.text1, marginBottom:S3.sm }]}>Photos & Address</T3>
          <T3 style={[TYP3.sm, { color:T.text2, marginBottom:S3.xl }]}>Great photos get 3× more responses</T3>
          <TO3 style={[pls.photoBox, { backgroundColor:T.surface2, borderColor:T.border2 }]} onPress={pickPhoto}>
            <T3 style={{ fontSize:40, marginBottom:S3.md }}>📸</T3>
            <T3 style={[TYP3.h4, { color:T.text2 }]}>Tap to add photos</T3>
            <T3 style={[TYP3.xs, { color:T.text3, marginTop:5 }]}>{photos.length}/10 added</T3>
          </TO3>
          <T3 style={[TYP3.label, { color:T.text3, marginBottom:S3.sm, marginTop:S3.lg }]}>EXACT ADDRESS (PRIVATE)</T3>
          <T3 style={[TYP3.xs, { color:T.text3, marginBottom:S3.sm }]}>Only shown after connection approval</T3>
          <TI3 style={[pls.input, { backgroundColor:T.surface2, borderColor:T.border2, color:T.text1, marginBottom:S3.lg }]}
            placeholder="Full address here" placeholderTextColor={T.text3}
            value={form.address} onChangeText={v => set('address',v)} multiline />
          <TI3 style={[pls.input, { backgroundColor:T.surface2, borderColor:T.border2, color:T.text1, minHeight:80, textAlignVertical:'top', marginBottom:S3.xl }]}
            placeholder="Describe the flat…" placeholderTextColor={T.text3}
            value={form.description} onChangeText={v => set('description',v)} multiline />
          <V3 style={[pls.antiBox, { backgroundColor:`${T.lime}0D`, borderColor:`${T.lime}28` }]}>
            <T3 style={{ fontSize:16 }}>🛡️</T3>
            <T3 style={[TYP3.xs, { color:T.text2, flex:1, lineHeight:17 }]}>Personal owners list free. Agents must use the business plan (₹499/mo).</T3>
          </V3>
          <PrimaryButton label="🚀 Post for Free" onPress={submit} loading={loading} style={{ marginTop:S3.xl }} />
        </>)}
      </SV3>
    </V3>
  );
}

const pls = SS3.create({
  typeCard: { borderRadius:R3.xl, padding:S3.lg, borderWidth:0.5 },
  input:    { borderRadius:R3.lg, borderWidth:0.5, padding:S3.lg, ...TYP3.sm },
  chip:     { borderRadius:R3.full, paddingHorizontal:S3.md, paddingVertical:S3.sm, borderWidth:0.5 },
  photoBox: { borderRadius:R3.xl, padding:S3.xxxl, alignItems:'center', borderWidth:1.5, borderStyle:'dashed' },
  antiBox:  { borderRadius:R3.lg, borderWidth:0.5, padding:S3.md, flexDirection:'row', gap:S3.sm },
});
