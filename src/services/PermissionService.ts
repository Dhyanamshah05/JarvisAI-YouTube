import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export class PermissionService {
  async checkMicrophonePermission(): Promise<boolean> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.MICROPHONE;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
      } else {
        return false;
      }

      const result = await check(permission);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available on this device');
          return false;
        case RESULTS.DENIED:
          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  }

  async requestMicrophonePermission(): Promise<boolean> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.MICROPHONE;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
      } else {
        return false;
      }

      const result = await request(permission);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available on this device');
          return false;
        case RESULTS.DENIED:
          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          this.showPermissionBlockedAlert();
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }

  async checkStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true; // iOS doesn't need explicit storage permission for basic operations
    }

    try {
      const result = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          return false;
        case RESULTS.DENIED:
          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking storage permission:', error);
      return false;
    }
  }

  async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const result = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          return false;
        case RESULTS.DENIED:
          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          this.showPermissionBlockedAlert();
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  }

  async checkNotificationPermission(): Promise<boolean> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.NOTIFICATIONS;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
      } else {
        return false;
      }

      const result = await check(permission);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          return false;
        case RESULTS.DENIED:
          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.NOTIFICATIONS;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
      } else {
        return false;
      }

      const result = await request(permission);
      
      switch (result) {
        case RESULTS.UNAVAILABLE:
          return false;
        case RESULTS.DENIED:
          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          this.showPermissionBlockedAlert();
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private showPermissionBlockedAlert() {
    Alert.alert(
      'Permission Required',
      'This permission is required for Jarvis to function properly. Please enable it in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Settings', 
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }
        }
      ]
    );
  }

  async checkAllPermissions(): Promise<{
    microphone: boolean;
    storage: boolean;
    notifications: boolean;
  }> {
    const [microphone, storage, notifications] = await Promise.all([
      this.checkMicrophonePermission(),
      this.checkStoragePermission(),
      this.checkNotificationPermission()
    ]);

    return {
      microphone,
      storage,
      notifications
    };
  }
}