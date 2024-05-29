import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { getFirestore, collection, addDoc, setDoc, doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from '../../Firestore';

const db = getFirestore(app);
const auth = getAuth(app);

const Cart = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetchCartRealTime(user.uid);
      } else {
        setUser(null);
        setCart([]);
      }
    });

    return unsubscribe;
  }, []);

  const fetchCartRealTime = (userId) => {
    const cartRef = doc(db, "cart", userId);
    return onSnapshot(cartRef, (doc) => {
      if (doc.exists()) {
        setCart(doc.data().items);
      } else {
        setCart([]);
      }
    }, (error) => {
      console.error('Error fetching cart:', error);
    });
  };

  const removeFromCart = async (itemToRemove) => {
    try {
      if (user) {
        const cartRef = doc(db, "cart", user.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          const currentCart = cartDoc.data().items;
          const updatedCart = currentCart.filter(item => item.id !== itemToRemove.id);
          await updateDoc(cartRef, { items: updatedCart });
          alert('Delete');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOrder = async () => {
    try {
      if (user) {
        const orderData = { items: cart, orderDate: new Date() };
        await addDoc(collection(db, "orders"), orderData);

        const cartRef = doc(db, "cart", user.uid);
        await setDoc(cartRef, { items: [] });

        setCart([]);
        Alert.alert("Order placed successfully");
      } else {
        Alert.alert("Please log in to place an order");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to place order: " + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.whiteText}>Order</Text>
      </TouchableOpacity>
      <View style={styles.cartList}>
        {cart.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => removeFromCart(item)}>
            <Text style={styles.cartItem}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffacd',
    padding: 16,
  },
  cartList: {
    flex: 1,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
  },
  cartItem: {
    fontSize: 14,
    marginVertical: 2,
  },
  whiteText: {
    color: 'white',
    textAlign: 'center',
  },
  orderButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 172,
    backgroundColor: '#D1C4E9',
    marginBottom: 10,
  },
});

export default Cart;
