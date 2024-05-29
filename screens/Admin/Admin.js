import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { app } from '../../Firestore';
import { Picker } from '@react-native-picker/picker';

const db = getFirestore(app);
const auth = getAuth(app);

const Admin = ({ navigation }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [cate, setCate] = useState('');
  const [pic, setPic] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const clearFields = () => {
    setId('');
    setName('');
    setPrice('');
    setStock('');
    setCate('');
    setPic('');
  };

  const validateFields = () => {
    return id && name && price && stock && cate && pic;
  };

  const addDataToFirestore = async () => {
    if (!validateFields()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "product"), {
        id: id,
        name: name,
        price: price,
        stock: stock,
        cate: cate,
        pic: pic,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", `Document successfully created with ID: ${docRef.id}`);
      clearFields();
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Error adding document: " + e.message);
    }
  };

  const Logout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Product</Text>
      <TextInput
        style={styles.input}
        onChangeText={setId}
        value={id}
        placeholder="Enter Product ID"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Enter Product Name"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPrice}
        value={price}
        placeholder="Enter Product Price"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        onChangeText={setStock}
        value={stock}
        placeholder="Enter Product Stock"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={[styles.pickerText, cate ? styles.selectedPickerText : styles.placeholderText]}>
          {cate ? cate : "Select Category"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <Picker
          selectedValue={cate}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setCate(itemValue);
            setShowPicker(false);
          }}
        >
          <Picker.Item label="ผลิตภัณฑ์ดูแลผม" value="ผลิตภัณฑ์ดูแลผม" />
          <Picker.Item label="Computer" value="Computer" />
          <Picker.Item label="เครื่องใช้ไฟฟ้า" value="เครื่องใช้ไฟฟ้า" />
        </Picker>
      )}
      <TextInput
        style={styles.input}
        onChangeText={setPic}
        value={pic}
        placeholder="Enter Product Picture URL"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={addDataToFirestore}
      >
        <Text style={styles.saveButtonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={Logout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070420',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  picker: {
    height: 150,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerText: {
    color: '#333',
  },
  selectedPickerText: {
    color: '#000',
  },
  placeholderText: {
    color: '#aaa',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Admin;
