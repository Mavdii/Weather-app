import * as Location from 'expo-location';
import { Coordinates } from '@/types/weather';

class LocationService {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  async getLastKnownLocation(): Promise<Coordinates | null> {
    try {
      const location = await Location.getLastKnownPositionAsync();
      if (!location) return null;

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting last known location:', error);
      return null;
    }
  }
}

export const locationService = new LocationService();
