import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert , Pressable, Image} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firestore';
import { useNavigation } from '@react-navigation/native';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  async function resetPassword() {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'An email has been sent to reset your password.');
    } catch (error) {
      Alert.alert('Error', 'There was a problem sending the password reset email. Please try again later.');
      console.error('Password reset error:', error);
    }
  }

  return (
    <View style={styles.container}>
            <Image style={styles.textHeader} source={require('../../assets/dode.png')} />
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        onChangeText={setEmail}
      />
      <Pressable onPress={resetPassword}>
        <Text style={styles.Textbt}>ส่งอีเมล</Text>
      </Pressable>

      <Text style={styles.or}>Or</Text>

      <Text
          style={styles.register}
          onPress={() => navigation.navigate('Login')}>
          เข้าสู่ระบบ
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070420",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleLog: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: 30,
    height: 45,
    width: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  textHeader: {

    textAlign: 'center',
    marginBottom: 20,
},
  textInput: {
    color: 'grey',
    height: 40,
    width: 300,
    marginTop: 40,
    marginLeft: 12,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  Textbt: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 18,
    color: '#006ee7',
    fontWeight: 'bold',
  },
  register: {
    color: '#006ee7',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 19,
 
    
    
  },
  or:{
    color:'white',
    alignSelf: 'center',
  }
});