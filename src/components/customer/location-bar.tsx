import {useCustomerStore} from "@/store/customerStore";
import {useWS} from "@/services/WSProvider";
import {Text, TouchableOpacity, View} from "react-native";
import {uiStyles} from "@/styles/uiStyles";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import {Colors} from "@/utils/Constants";
import {useRouter} from "expo-router";
import {Routes} from "@/utils/Routes";
import {navigate} from "@/utils/Helpers";
import CustomText from "@/components/shared/CustomText";

function LocationBar() {
    const {location} = useCustomerStore();
    const {disconnect} = useWS();
    const router = useRouter();

    return (
        <View style={uiStyles.absoluteTop}>
            <SafeAreaView/>
            <View style={uiStyles.container}>
                <TouchableOpacity>
                    <Ionicons name={'menu-outline'} size={RFValue(18)} color={Colors.text}/>
                </TouchableOpacity>

                <TouchableOpacity style={uiStyles.locationBar} onPress={() => navigate(router, Routes.CUSTOMER_SELECT_LOCATIONS)}>
                    <View style={uiStyles.dot}/>
                    <CustomText numberOfLines={1} style={uiStyles.locationText}>{location?.address || 'Getting address...'}</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default LocationBar;
