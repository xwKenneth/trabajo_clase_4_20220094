import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';

export default function JokeScreen() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJoke = () => {
    setLoading(true);
    fetch('https://api.chucknorris.io/jokes/random')
      .then((response) => response.json())
      .then((data) => {
        setJoke(data.value);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.jokeText}>{joke}</Text>
          <Button title="Nueva broma" onPress={fetchJoke} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  jokeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
