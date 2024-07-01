// Importowanie niezbędnych modułów z biblioteki 'react' i 'react-native'
import { useEffect, useState } from 'react';
import { ScrollView, Image, View, Text, StyleSheet } from 'react-native';

// Importowanie komponentów zewnętrznych
import OutlinedButton from '../components/UI/OutlinedButton';
import { Colors } from '../constants/colors';
import { fetchPlaceDetails } from '../util/database';

// Definicja głównej funkcji komponentu
function PlaceDetails({ route, navigation }) {
  // Utworzenie stanu dla przechowywania szczegółów miejsca
  const [fetchedPlace, setFetchedPlace] = useState();

  // Funkcja do wyświetlania miejsca na mapie
  function showOnMapHandler() {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  }

  // Pobranie ID wybranego miejsca z parametrów trasy
  const selectedPlaceId = route.params.placeId;

  // Użycie efektu do ładowania danych miejsca po załadowaniu komponentu
  useEffect(() => {
    async function loadPlaceData() {
      // Pobranie szczegółów miejsca z bazy danych
      const place = await fetchPlaceDetails(selectedPlaceId);
      // Aktualizacja stanu miejscem
      setFetchedPlace(place);
      // Ustawienie tytułu nawigacji na tytuł miejsca
      navigation.setOptions({
        title: place.title,
      });
    }

    // Wywołanie funkcji ładowania danych
    loadPlaceData();
  }, [selectedPlaceId]);

  // Jeśli miejsce nie zostało jeszcze pobrane, wyświetl komunikat o ładowaniu
  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  // Główny widok komponentu
  return (
    <ScrollView>
      // Wyświetlanie obrazu miejsca
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          // Wyświetlanie adresu miejsca
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        // Przycisk do wyświetlania miejsca na mapie
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

// Eksportowanie komponentu
export default PlaceDetails;

// Definicja stylów
const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
