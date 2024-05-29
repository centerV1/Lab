import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, SafeAreaView, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { app } from '../Firestore'; // Ensure this path is correct based on your project structure
import { getAuth } from 'firebase/auth';

const db = getFirestore(app);
const auth = getAuth();

const Info = ({ item, onBack }) => {
  const user = auth.currentUser;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const q = query(collection(db, "Reviews"), where("itemId", "==", item.id));
    const querySnapshot = await getDocs(q);
    const reviewsList = [];
    querySnapshot.forEach((doc) => {
      reviewsList.push(doc.data());
    });
    setReviews(reviewsList);
  };

  const handleReviewSubmit = async () => {
    if (!review || rating === 0) {
      Alert.alert("Error", "Please enter a review and select a rating.");
      return;
    }

    const newReview = {
      userId: user.uid,
      username: user.email, // assuming username is email
      review,
      rating,
      itemId: item.id,
      timestamp: new Date()
    };

    try {
      await setDoc(doc(collection(db, "Reviews")), newReview);
      Alert.alert("Success", "Review added!");
      setReview('');
      setRating(0);
      fetchReviews();
    } catch (e) {
      console.error("Error adding review: ", e);
      Alert.alert("Error", "Failed to add review.");
    }
  };

  const addToMyList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "MyList"));
      let maxIndex = 0;

      querySnapshot.forEach((doc) => {
        const docId = doc.id;
        const match = docId.match(/document(\d+)/);
        if (match) {
          const currentIndex = parseInt(match[1], 10);
          if (currentIndex > maxIndex) {
            maxIndex = currentIndex;
          }
        }
      });

      const newDocId = `document${maxIndex + 1}`;

      await setDoc(doc(db, "MyList", newDocId), {
        userId: user.uid,
        ...item
      });

      Alert.alert("Success", "Movie added to your list!");
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Failed to add movie to your list.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button title="Go Back" onPress={onBack} color="#f0f8ff" />
            <Button title="Add to My List" onPress={addToMyList} color="#006ee7" />
          </View>
          <Image source={{ uri: item.pic }} style={styles.image} />
          <Text style={styles.titleText}>{item.name}</Text>
          <Text style={styles.descriptionText}>{item.cat}</Text>
          <Text style={styles.descriptionText}>{item.story}</Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Leave a Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review"
            value={review}
            onChangeText={setReview}
          />
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Rating:</Text>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.star, { color: rating >= star ? 'orange' : 'gray' }]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Submit Review" onPress={handleReviewSubmit} color="#006ee7" />
        </View>

        <View style={styles.reviewList}>
          <Text style={styles.reviewTitle}>Reviews</Text>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{review.username}</Text>
              <Text style={styles.reviewText}>{review.review}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={[styles.star, { color: review.rating >= star ? 'orange' : 'gray' }]}>
                    ★
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070420',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  reviewSection: {
    padding: 20,
  },
  reviewTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    color: 'white',
    marginRight: 10,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  reviewList: {
    padding: 20,
  },
  reviewItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewText: {
    marginBottom: 5,
  },
});

export default Info;
