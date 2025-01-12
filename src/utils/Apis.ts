import {BASE_URL} from "@/services/config";

const Apis = {
    refreshTokenApiUrl: () => `${BASE_URL}/auth/refreshToken`,
    loginApiUrl: () => `${BASE_URL}/auth/login`,
}

export default Apis;
