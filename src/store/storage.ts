import * as SecureStore from "expo-secure-store";
import {SecureStorageKeys} from "@/utils/Constants";
import {RAPIDO_SECRET_KEY, RAPIDO_STORAGE_ID} from "@/utils/config";

export const secureStorage = {
    async getItem(key: string) {
        const value = await SecureStore.getItemAsync(key);
        console.log('🔐 ', key, 'retrieved:', value ?? '', '✅');
        return value;
    },
    async setItem(key: string, value: string) {
        await SecureStore.setItemAsync(key, value);
        console.log('🔐 ', key, 'stored:', value, '✅');
    },
    async removeItem(key: string) {
        await SecureStore.deleteItemAsync(key);
        console.log('🔐 ', key, 'deleted ✅');
    },
    async clearAll() {
        try {
            const keys = Object.values(SecureStorageKeys);
            for (const key of keys) {
                await SecureStore.deleteItemAsync(key);
                console.log('Deleted secure storage key:', key);
            }
            console.log('🔐 All secure storage items cleared successfully! ✅');
        } catch (err) {
            console.log('Error clearing secure storage ❌:', err);
        }
    },
}

export async function getAccessToken() {
    const accessToken = await secureStorage.getItem(SecureStorageKeys.accessToken);
    console.log('🔐accessToken retrieved:', accessToken ?? '', '✅');
    return accessToken;
}

export async function getRefreshToken() {
    const refreshToken = await secureStorage.getItem(SecureStorageKeys.refreshToken);
    console.log('🔐refreshToken retrieved:', refreshToken ?? '', '✅');
    return refreshToken;
}

export async function storeAccessToken(token: string) {
    await secureStorage.setItem(SecureStorageKeys.accessToken, token);
    console.log('🔐accessToken stored:', await getAccessToken(), '✅');
}

export async function storeRefreshToken(token: string) {
    await secureStorage.setItem(SecureStorageKeys.refreshToken, token);
    console.log('🔐refreshToken stored:', await getRefreshToken(), '✅');
}
