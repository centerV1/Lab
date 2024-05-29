import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProdCard from '../../components/ProdCard';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../../Firestore';

const db = getFirestore(app);
const auth = getAuth(app);
const Stack = createStackNavigator();

const App = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
        fetchCart(user.uid);
      } else {
        setUser(null);
        setCart([]);
      }
    });

    return unsubscribe;
  }, []);

  const fetchCart = async (userId) => {
    try {
      const cartRef = doc(db, "cart", userId);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        setCart(cartDoc.data().items);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "product"));
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ ...doc.data(), id: doc.id });
        });
        console.log('Fetched data:', products);
        setData(products);
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };

    fetchData();
  }, []);

  const addProd = async (prod) => {
    if (!user) {
      alert('Please log in to add items to your cart');
      return;
    }

    try {
      const cartRef = doc(db, "cart", user.uid);
      const cartDoc = await getDoc(cartRef);

      let updatedCart = [];
      if (cartDoc.exists()) {
        updatedCart = [...cartDoc.data().items, prod];
        await updateDoc(cartRef, { items: updatedCart });
        alert('Please log in to add items to your cart');
      } else {
        updatedCart = [prod];
        await setDoc(cartRef, { items: updatedCart });
        alert('Please log in to add items to your cart');
      }

      setCart(updatedCart);
    } catch (e) {
      console.log(e);
    }
  };

  const filterProducts = () => {
    if (filter === 'All') {
      return data;
    } else if (filter === 'IN STOCK') {
      return data.filter(item => parseInt(item.stock) > 0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.whiteText]} onPress={() => setFilter('All')}>
          <Text style={styles.whiteText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.whiteText]} onPress={() => setFilter('IN STOCK')}>
          <Text style={styles.whiteText}>In Stock</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView style={styles.productList}>
          {filterProducts().map((item, index) => (
            <ProdCard key={index} item={item} addProd={addProd} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffacd',
    marginTop: StatusBar.currentHeight || 0,
  },
  filterContainer: {
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#D1C4E9',
  },
  filterButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  whiteText: {
    color: 'white',
  },
  contentContainer: {
    flex: 3,
  },
  productList: {
    flex: 1,
  },
  blueBackground: {
    backgroundColor: '#2196f3',
  },
});

export default App;
