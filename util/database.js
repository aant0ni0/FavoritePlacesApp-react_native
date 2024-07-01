import * as SQLite from 'expo-sqlite'; // Importuje moduł SQLite z Expo

import { Place } from '../models/place'; // Importuje model Place z określonej ścieżki

const database = SQLite.openDatabase('places.db'); // Otwiera połączenie z bazą danych SQLite o nazwie 'places.db'

export function init() {
  // Funkcja inicjalizująca bazę danych, tworząc tabelę places, jeśli jeszcze nie istnieje
  const promise = new Promise((resolve, reject) => {
    // Tworzy nową obietnicę
    database.transaction((tx) => {
      // Rozpoczyna nową transakcję w bazie danych
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY NOT NULL, // pole id typu integer, klucz główny, nie może być null
          title TEXT NOT NULL,              // pole title typu tekstowego, nie może być null
          imageUri TEXT NOT NULL,           // pole imageUri typu tekstowego, nie może być null
          address TEXT NOT NULL,            // pole address typu tekstowego, nie może być null
          lat REAL NOT NULL,                // pole lat typu real (float), nie może być null
          lng REAL NOT NULL                 // pole lng typu real (float), nie może być null
        )`,
        [],
        () => {
          resolve(); // W przypadku powodzenia, wywołuje resolve
        },
        (_, error) => {
          reject(error); // W przypadku błędu, wywołuje reject z przekazaniem błędu
        }
      );
    });
  });

  return promise; // Zwraca obietnicę
}

export function insertPlace(place) {
  // Funkcja wstawiająca nowe miejsce do tabeli places
  const promise = new Promise((resolve, reject) => {
    // Tworzy nową obietnicę
    database.transaction((tx) => {
      // Rozpoczyna nową transakcję w bazie danych
      tx.executeSql(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
        [
          place.title,         // Podstawia title miejsca
          place.imageUri,      // Podstawia imageUri miejsca
          place.address,       // Podstawia address miejsca
          place.location.lat,  // Podstawia lat lokalizacji miejsca
          place.location.lng,  // Podstawia lng lokalizacji miejsca
        ],
        (_, result) => {
          resolve(result); // W przypadku powodzenia, wywołuje resolve z wynikiem
        },
        (_, error) => {
          reject(error); // W przypadku błędu, wywołuje reject z przekazaniem błędu
        }
      );
    });
  });

  return promise; // Zwraca obietnicę
}

export function fetchPlaces() {
  // Funkcja pobierająca wszystkie miejsca z tabeli places
  const promise = new Promise((resolve, reject) => {
    // Tworzy nową obietnicę
    database.transaction((tx) => {
      // Rozpoczyna nową transakcję w bazie danych
      tx.executeSql(
        'SELECT * FROM places',
        [],
        (_, result) => {
          const places = []; // Tworzy pustą tablicę do przechowywania miejsc

          for (const dp of result.rows._array) {
            // Iteruje po wszystkich wierszach wyników zapytania
            places.push(
              new Place(
                dp.title, // Tytuł miejsca
                dp.imageUri, // URI obrazka miejsca
                {
                  address: dp.address, // Adres miejsca
                  lat: dp.lat,         // Szerokość geograficzna miejsca
                  lng: dp.lng,         // Długość geograficzna miejsca
                },
                dp.id // Identyfikator miejsca
              )
            );
          }
          resolve(places); // W przypadku powodzenia, wywołuje resolve z tablicą miejsc
        },
        (_, error) => {
          reject(error); // W przypadku błędu, wywołuje reject z przekazaniem błędu
        }
      );
    });
  });

  return promise; // Zwraca obietnicę
}

export function fetchPlaceDetails(id) {
  // Funkcja pobierająca szczegóły miejsca na podstawie identyfikatora
  const promise = new Promise((resolve, reject) => {
    // Tworzy nową obietnicę
    database.transaction((tx) => {
      // Rozpoczyna nową transakcję w bazie danych
      tx.executeSql(
        'SELECT * FROM places WHERE id = ?',
        [id], // Podstawia identyfikator miejsca do zapytania
        (_, result) => {
          const dbPlace = result.rows._array[0]; // Pobiera pierwszyn wyik z tablicy wyników
          const place = new Place(
            dbPlace.title, // Tytuł miejsca
            dbPlace.imageUri, // URI obrazka miejsca
            { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address }, // Lokalizacja i adres miejsca
            dbPlace.id // Identyfikator miejsca
          );
          resolve(place); // W przypadku powodzenia, wywołuje resolve z obiektem miejsca
        },
        (_, error) => {
          reject(error); // W przypadku błędu, wywołuje reject z przekazaniem błędu
        }
      );
    });
  });

  return promise; // Zwraca obietnicę
}
