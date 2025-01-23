import {Dimensions} from "react-native";

export const screenHeight = Dimensions.get('screen').height
export const screenWidth = Dimensions.get('screen').width

export enum Colors {
    primary = '#FFCA1F',
    background = '#FFF',
    white = '#FFF',
    text = '#222',
    theme = '#CF551F',
    secondary = '#E5EBF5',
    tertiary = '#3C75BE',
    secondary_light = '#F6F7F9',
    iOSColor = '#007AFF'
}

export enum SecureStorageKeys {
    accessToken = 'accessToken',
    refreshToken = 'refreshToken',
}

export enum WebSocketKeys {
    subscribeToZone = 'subscribeToZone',
    nearbyCaptains = 'nearbyCaptains',
    subscribeRide = 'subscribeRide',
    rideData = 'rideData',
    searchCaptain = 'searchCaptain',
    rideUpdate = 'rideUpdate',
    rideCancelled = 'rideCanceled',
    subscribeToCaptainLocation = 'subscribeToCaptainLocation',
    captainLocationUpdate = 'captainLocationUpdate',
    cancelRide = 'cancelRide',
    goOnDuty = 'goOnDuty',
    goOffDuty = 'goOffDuty',
    rideOffer = 'rideOffer',
    updateLocation = 'updateLocation',

    error = 'error',
}
