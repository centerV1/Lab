import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signOut } from 'firebase/auth';
import { auth, db } from '../../Firestore';

const ProfileScreen = ({ navigation }) => {
  const user = getAuth().currentUser;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPic, setEditPic] = useState(false);
  const [img, setImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { uid } = user;
        try {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              name: data.name,
              imageUrl: data.picture
            });
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
          Alert.alert('Error', 'Failed to fetch profile data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const pickImage = async () => {
    try {
      console.log('Launching Image Picker...');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setEditPic(true);
        setImg(uri);

        console.log('Image URI:', uri);

        // Resize the image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log('Resized image URI:', manipulatedImage.uri);

        const response = await fetch(manipulatedImage.uri);
        console.log('Fetching image...');
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        console.log('Blob created successfully');

        const filename = `UserPhoto/${Date.now().toString(36)}.jpg`;
        const storage = getStorage();
        const storageRef = ref(storage, filename);

        console.log('Uploading image...');
        await uploadBytes(storageRef, blob);
        console.log('Image uploaded to Firebase Storage');

        const url = await getDownloadURL(storageRef);
        console.log('Download URL:', url);

        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { picture: url });
        console.log('Document updated with new image URL');

        setProfile({ ...profile, imageUrl: url });
        setEditPic(false);
        setImg(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', `Failed to upload image: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again later.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No profile data found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image style={styles.profileImage} source={{ uri: editPic ? img : profile.imageUrl }} />
        <TouchableOpacity style={styles.pencilContainer} onPress={pickImage}>
          <Image source={require('../../assets/pencil.png')} style={styles.pencil} />
        </TouchableOpacity>
      </View>
      <View style={styles.boxdescription}>
        <Text style={styles.headerusertext}>Username</Text>
        <Text style={styles.profileName}>{profile.name}</Text>
      </View>
      <View style={styles.containerbutton}>
        <TouchableOpacity style={styles.buttonlogout} onPress={handleLogout}>
          <Text style={styles.textother1}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070420',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "white",
  },
  pencilContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  pencil: {
    width: 30,
    height: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "white",
  },
  containerbutton: {
    flexDirection: "row",
    justifyContent: 'center',
    width: '60%',
    marginTop: 20,
  },
  buttonlogout: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 30,
    backgroundColor: "#E30000",
  },
  boxdescription: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  headerusertext: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
  textother1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ProfileScreen;
