import {Stack} from "expo-router";
import {Routes} from "@/utils/Routes";
import {gestureHandlerRootHOC} from "react-native-gesture-handler";

function RootLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name={'index'}/>
            <Stack.Screen name={Routes.ROLE}/>

            <Stack.Screen name={Routes.CUSTOMER_AUTH}/>
            <Stack.Screen name={Routes.CUSTOMER_HOME}/>

            <Stack.Screen name={Routes.CAPTAIN_AUTH}/>
            <Stack.Screen name={Routes.CAPTAIN_HOME}/>
        </Stack>
    );
}

export default gestureHandlerRootHOC(RootLayout);
