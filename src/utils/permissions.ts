import * as Permissions from 'expo-permissions';

export async function requestLocationPermission() {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  return status === 'granted';
}

export async function requestCameraPermission() {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  return status === 'granted';
}
