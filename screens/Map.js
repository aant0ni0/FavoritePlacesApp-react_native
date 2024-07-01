// Importowanie niezbędnych modułów z biblioteki 'react' i 'react-native'
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Importowanie komponentów zewnętrznych
import IconButton from '../components/UI/IconButton';

// Definicja głównej funkcji komponentu
function Map({ navigation, route }) {
  // Pobranie początkowej lokalizacji z parametrów trasy, jeśli istnieje
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  // Utworzenie stanu dla przechowywania wybranej lokalizacji
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // Definicja regionu mapy
  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Funkcja do wybierania lokalizacji na mapie
  function selectLocationHandler(event) {
    if (initialLocation) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  // Funkcja do zapisywania wybranej lokalizacji
  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'No location picked!',
        'You have to pick a location (by tapping on the map) first!'
      );
      return;
    }

    navigation.navigate('AddPlace', {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  // Użycie efektu do ustawienia prawego przycisku nagłówka
  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    }
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  // Główny widok komponentu
  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

// Eksportowanie komponentu
export default Map;

// Definicja stylów
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
