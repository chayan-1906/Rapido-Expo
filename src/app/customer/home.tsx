import {Platform, View} from "react-native";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getAccessToken, getRefreshToken} from "@/store/storage";
import {homeStyles} from "@/styles/homeStyles";
import {StatusBar} from "expo-status-bar";
import LocationBar from "@/components/customer/location-bar";
import {screenHeight} from "@/utils/Constants";
import DraggableMap from "@/app/customer/draggable-map";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import SheetContent from "@/components/customer/SheetContent";

const androidHeights = [screenHeight * 0.22, screenHeight * 0.42, screenHeight * 0.7];
const iOSHeights = [screenHeight * 0.3, screenHeight * 0.5, screenHeight * 0.7];

function CustomerHome() {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => Platform.OS === 'ios' ? iOSHeights : androidHeights, []);

    const [mapHeight, setMapHeight] = useState(screenHeight * 0.90);

    const handleSheetChanges = useCallback((index: number) => {
        /*let height = screenHeight * 0.7;
        if (index === 1) {
            height = snapPoints[1];
        }
        setMapHeight(height);*/
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
            <BottomSheet ref={bottomSheetRef} index={1} handleIndicatorStyle={{}} enableOverDrag={true} enableDynamicSizing={false} style={{zIndex: 4, backgroundColor: 'red'}} snapPoints={snapPoints}
                         onChange={handleSheetChanges}>
                <BottomSheetScrollView contentContainerStyle={homeStyles.scrollContainer}>
                    <SheetContent/>
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
}

export default CustomerHome;
