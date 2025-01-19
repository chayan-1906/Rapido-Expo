import axios from "axios";
import {BASE_URL} from "@/services/config";
import {getAccessToken, getRefreshToken, storeAccessToken, storeRefreshToken} from "@/store/storage";
import Apis from "@/utils/Apis";
import {logout} from "@/services/authService";

export const appAxios = axios.create({
    baseURL: BASE_URL,
});

// ✅✅✅
export const refreshTokenApi = async () => {
    try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(Apis.refreshTokenApiUrl(), {
            refresh_token: refreshToken,
        });

        const responseData = response.data;
        const {access_token: newAccessToken, refresh_token: newRefreshToken} = responseData;

        await Promise.all([
            storeAccessToken(newAccessToken),
            storeRefreshToken(newRefreshToken),
        ]);

        return {accessToken: newAccessToken, refreshToken: newRefreshToken};
    } catch (error) {
        console.error('inside catch of refreshToken:', error);
        await logout();
    }
}

appAxios.interceptors.request.use(async (config) => {
    const accessToken = await getAccessToken();
    console.log('getting access token inside appAxios.interceptors.request:', accessToken);
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

appAxios.interceptors.response.use((response) => response, async (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            try {
                const newAccessToken = await refreshTokenApi();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.log('Error refreshing token:', error);
            }
        }
    }

    return Promise.reject(error);
});
