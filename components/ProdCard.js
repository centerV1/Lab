import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

const ProdCard = ({ item, addProd }) => {
  return (
    <TouchableOpacity onPress={() => addProd(item)}>
      <Card style={styles.card}>
        <Image
          source={{ uri: item.pic }}
          style={styles.image}
          onError={() => console.log('Image loading error')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.stock}>จำนวนคงเหลือ: {item.stock}</Text>
          <Text style={styles.price}>ราคา: ${item.price}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 10,
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 3,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  textContainer: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stock: {
    color: 'gray',
  },
  price: {
    color: 'blue',
  },
});

export default ProdCard;
