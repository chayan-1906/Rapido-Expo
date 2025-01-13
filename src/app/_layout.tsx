import {Stack} from "expo-router";
import {Routes} from "@/utils/Routes";
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {WSProvider} from "@/services/WSProvider";

function RootLayout() {
    return (
        <WSProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name={'index'}/>
                <Stack.Screen name={Routes.ROLE}/>

                <Stack.Screen name={Routes.CUSTOMER_AUTH}/>
                <Stack.Screen name={Routes.CUSTOMER_HOME}/>
                <Stack.Screen name={Routes.CUSTOMER_SELECT_LOCATIONS}/>

                <Stack.Screen name={Routes.CAPTAIN_AUTH}/>
                <Stack.Screen name={Routes.CAPTAIN_HOME}/>
            </Stack>
        </WSProvider>
    );
}

export default gestureHandlerRootHOC(RootLayout);
