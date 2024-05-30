import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput, ActivityIndicator } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

import PokemonItem from '../components/PokemonItem';
import FormularioPokemon from '../components/FormularioPokemon';

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cantidadPokemon, setCantidadPokemon] = useState(10);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cantidadPokemon}`);
      const data = await response.json();
      const pokemonData = await Promise.all(
        data.results.map(async (result, index) => {
          const pokemonResponse = await fetch(result.url);
          const pokemonInfo = await pokemonResponse.json();
          const abilities = pokemonInfo.abilities.map(abilityObj => abilityObj.ability);
          return { ...result, id: index + 1, abilities };
        })
      );
      setPokemon(pokemonData);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filteredPokemon = pokemon.filter((item) => item.name.includes(text.toLowerCase()));
      setPokemon(filteredPokemon);
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [cantidadPokemon]);

  return (
    <View style={styles.container}>
      <FormularioPokemon
        tituloFormulario='Listado de Pokemones usando Fetch'
        labelInput='Ingrese la cantidad de pokemon a cargar: '
        placeHolderInput='20'
        valor={cantidadPokemon}
        setValor={setCantidadPokemon}
      />
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon"
        value={search}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pokemon}
          renderItem={({ item }) => <PokemonItem item={item} />}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  list: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 5,
    width: WIDTH / numColumns - 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  image: {
    width: 80,
    height: 80,
  },
  loading: {
    marginTop: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
