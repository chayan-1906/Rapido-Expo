import * as SecureStore from "expo-secure-store";
import {SecureStorageKeys} from "@/utils/Constants";
import {RAPIDO_SECRET_KEY, RAPIDO_STORAGE_ID} from "@/utils/config";

export async function storeToken() {
    const tokenStorage = RAPIDO_SECRET_KEY ?? '';
    await SecureStore.setItemAsync('token-storage', tokenStorage);
    console.log('🔐token-storage stored:', RAPIDO_SECRET_KEY ?? '', '✅');
}

export async function storeStorageId() {
    await SecureStore.setItemAsync(RAPIDO_STORAGE_ID ?? '', RAPIDO_SECRET_KEY ?? '');
    console.log('🔐storage stored:', RAPIDO_SECRET_KEY ?? '', '✅')
}

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
                console.log(`Deleted secure storage key: ${key}`);
            }
            console.log('🔐 All secure storage items cleared successfully! ✅');
        } catch (err) {
            console.log('Error clearing secure storage ❌:', err);
        }
    },
}
