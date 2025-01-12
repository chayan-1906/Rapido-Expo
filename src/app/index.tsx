import {Alert, Image, View} from "react-native";
import {commonStyles} from "@/styles/commonStyles";
import {splashStyles} from "@/styles/splashStyles";
import CustomText from "@/components/shared/CustomText";
import {useFonts} from "expo-font";
import {useEffect, useState} from "react";
import {getAccessToken, getRefreshToken} from "@/store/storage";
import resetAndNavigate from "@/utils/Helpers";
import {jwtDecode} from "jwt-decode";
import {Routes} from "@/utils/Routes";
import {refreshTokenApi} from "@/services/apiInterceptors";
import {useCustomerStore} from "@/store/customerStore";
import {useCaptainStore} from "@/store/captainStore";

interface DecodedToken {
    exp: number;
}

function Main() {
    const [loaded] = useFonts({
        Bold: require('../assets/fonts/NotoSans-Bold.ttf'),
        Regular: require('../assets/fonts/NotoSans-Regular.ttf'),
        Medium: require('../assets/fonts/NotoSans-Medium.ttf'),
        Light: require('../assets/fonts/NotoSans-Light.ttf'),
        SemiBold: require('../assets/fonts/NotoSans-SemiBold.ttf'),
    });

    const {user: customer} = useCustomerStore();
    const {user: captain} = useCaptainStore();
    const [hasNavigated, setHasNavigated] = useState(false);

    const tokenCheck = async () => {
        const accessToken = await getAccessToken() as string;
        const refreshToken = await getRefreshToken() as string;

        if (accessToken) {
            const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
            const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

            const currentTime = Date.now() / 1000;
            if (decodedRefreshToken?.exp < currentTime) {
                console.log('refresh token expired 🔌');
                resetAndNavigate(Routes.ROLE);
                Alert.alert('Session expired, please login again');
            }

            if (decodedAccessToken?.exp < currentTime) {
                console.log('access token expired ⚠︎');
                try {
                    await refreshTokenApi();
                } catch (error) {
                    console.log('error in getting refresh token: ❌', error);
                    Alert.alert('Could not retrieve refresh token');
                }
            }

            if (customer) {
                resetAndNavigate(Routes.CUSTOMER_HOME);
            } else if (captain) {
                resetAndNavigate(Routes.CAPTAIN_HOME);
            }
        } else {
            resetAndNavigate(Routes.ROLE);
        }
    }

    useEffect(() => {
        if (loaded && !hasNavigated) {
            const timeoutId = setTimeout(() => {
                tokenCheck();
                setHasNavigated(true);
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [loaded, hasNavigated]);

    return (
        <View style={commonStyles.container}>
            <Image source={require('@/assets/images/logo_t.png')} style={splashStyles.img}/>
            <CustomText variant={'h5'} fontFamily={'Medium'} style={splashStyles.text}>Made in 🇮🇳</CustomText>
        </View>
    );
}

export default Main;
