import {Platform, View} from "react-native";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getAccessToken, getRefreshToken} from "@/store/storage";
import {homeStyles} from "@/styles/homeStyles";
import {StatusBar} from "expo-status-bar";
import LocationBar from "@/components/customer/location-bar";
import {screenHeight} from "@/utils/Constants";
import DraggableMap from "@/app/customer/draggable-map";

const androidHeights = [screenHeight * 0.12, screenHeight * 0.42];
const iOSHeights = [screenHeight * 0.2, screenHeight * 0.5];

function CustomerHome() {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => Platform.OS === 'ios' ? iOSHeights : androidHeights, []);

    const [mapHeight, setMapHeight] = useState(snapPoints[1]);

    const handleSheetChanges = useCallback((index: number) => {
        let height = screenHeight * 0.8;
        if (index === 1) {
            height = screenHeight * 0.5;
        }
        setMapHeight(height);
    }, []);

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
        <View style={homeStyles.container}>
            <StatusBar style={'light'} backgroundColor={'orange'} translucent={false}/>
            <LocationBar/>
            <DraggableMap height={mapHeight}/>
        </View>
    );
}

export default CustomerHome;
