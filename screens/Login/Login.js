import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View, SafeAreaView, Image, Pressable, Alert } from 'react-native'; // Import Image and Alert components
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../Firestore'; // Firestore Database
import { doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions

export default function AssetExample({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function UserLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user role from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigation.navigate('Admin');
        } else {
          navigation.navigate('Main');
        }
      } else {
        Alert.alert("Error", "User data not found!");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/dode.png')} />
      <View>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="อีเมล "
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="รหัสผ่าน"
          secureTextEntry
        />
        <Text
          style={styles.forgot}
          onPress={() => navigation.navigate('Forget')}>
          ลืมรหัสผ่าน?
        </Text>
        <View style={styles.loginButton}>
          <Pressable onPress={UserLogin}>
            <Text style={styles.loginButton}>เข้าสู่ระบบ</Text>
          </Pressable>
        </View>
        <Text style={styles.or}>Or</Text>
        <Text
          style={styles.register}
          onPress={() => navigation.navigate('Register')}>
          สมัครสมาชิก?
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#070420',
  },
  logostyle: {
    marginTop: 2,
    alignSelf: 'top',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 30,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 12,
    padding: 10,
    marginRight: 30,
    marginLeft: 30,
  },
  loginButton: {
    color: '#006ee7',
    alignSelf: 'center',
    fontSize: 18,
    marginTop: 12,
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 10,
  },
  register: {
    color: '#006ee7',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 12,
  },
  logo: {
    height: 50,
    width: 110,
    alignSelf: 'center',
    marginBottom: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  forgot: {
    color: 'white',
    left: 40,
  },
  or: {
    color: 'white',
    alignSelf: 'center',
  }
});
