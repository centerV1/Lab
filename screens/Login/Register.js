import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View, TouchableOpacity, StatusBar, Alert, Pressable , Image} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../Firestore';
import { useNavigation } from '@react-navigation/native';

export default function Register({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfpassword, setCfPassword] = useState('');
    const navigations = useNavigation();

    async function UserRegister() {
        if (!username || !email || !password || !cfpassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (cfpassword !== password) {
            Alert.alert('Error', "Passwords don't match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const currentUser = userCredential.user;
            
            await setDoc(doc(db, "users", currentUser.uid), {
                name: username,
                email: email,
                role: 'user',
                picture: 'https://freesvg.org/img/abstract-user-flat-3.png'
            });

            Alert.alert('Success', 'Account created successfully.');
            navigation.navigate('LoginScreen');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    return (
        
        <View style={styles.container}>
            <Image style={styles.textHeader} source={require('../../assets/dode.png')} />
   
          <StatusBar style="auto" />
          <TextInput
            placeholder="Username"
            style={styles.textInput}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={setCfPassword}
          />
          <Pressable onPress={UserRegister}>
            <Text style={styles.Textbt}>สมัครสมาชิก</Text>
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
    buttonStyleRe: {
        borderRadius: 15,
        backgroundColor: 'white',
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'black',
    },
    textHeader: {

        textAlign: 'center',
        marginBottom: 50,
    },
    textInput: {
        color: "grey",
        height: 40,
        width: 300,
        marginTop: 10,
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    Textbt: {
        marginTop: 40,
        fontSize: 18,
        color: "#006ee7",
        marginBottom: 20,

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