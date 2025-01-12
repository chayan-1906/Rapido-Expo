import {Text, View} from "react-native";
import {useEffect} from "react";
import {getAccessToken, getRefreshToken} from "@/store/storage";

function CustomerHome() {
    useEffect(() => {
        async function accessToken() {
            const accesssToken = await getAccessToken();
            console.log(accesssToken);
        }

        async function refreshToken() {
            const refreshhToken = await getRefreshToken();
            console.log(refreshhToken);
        }

        accessToken();
        refreshToken();
    }, []);

    return (
        <View>
            <Text>Customer Home</Text>
        </View>
    );
}

export default CustomerHome;
