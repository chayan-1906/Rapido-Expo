import {Image, TouchableOpacity, View} from "react-native";
import {uiStyles} from "@/styles/uiStyles";
import {useRouter} from "expo-router";
import {Routes} from "@/utils/Routes";
import {navigate} from "@/utils/Helpers";
import {Ionicons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";
import {commonStyles} from "@/styles/commonStyles";

const cubes = [
    {name: 'Bikes', imageUri: require('@/assets/icons/bike.png')},
    {name: 'Auto', imageUri: require('@/assets/icons/auto.png')},
    {name: 'Cab Economy', imageUri: require('@/assets/icons/cab.png')},
    {name: 'Parcel', imageUri: require('@/assets/icons/parcel.png')},
    {name: 'Cab Premium', imageUri: require('@/assets/icons/cab_premium.png')},
]

function SheetContent() {
    const router = useRouter();

    return (
        <View>
            <TouchableOpacity style={uiStyles.searchBarContainer} onPress={() => navigate(router, Routes.CUSTOMER_SELECT_LOCATIONS)}>
                <Ionicons name={'search-outline'} size={RFValue(16)} color={'black'}/>
                <CustomText fontFamily={'Medium'} fontSize={12}>Where are you going?</CustomText>
            </TouchableOpacity>

            <View style={commonStyles.flexRowBetween}>
                <CustomText fontFamily={'Medium'} fontSize={12}>Explore</CustomText>
                <TouchableOpacity style={commonStyles.flexRow}>
                    <CustomText fontFamily={'Regular'} fontSize={11}>View All</CustomText>
                    <Ionicons name={'chevron-forward'} size={RFValue(12)} color={'black'}/>
                </TouchableOpacity>
            </View>

            <View style={uiStyles.cubes}>
                {cubes?.slice(0, 4).map((item, index) => (
                    <TouchableOpacity key={index} style={uiStyles.cubeContainer}>
                        <View style={uiStyles.cubeIconContainer}>
                            <Image source={item?.imageUri} style={uiStyles.cubeIcon}/>
                        </View>
                        <CustomText fontFamily={'Medium'} fontSize={9.5} style={{textAlign: 'center'}}>{item?.name}</CustomText>
                    </TouchableOpacity>
                ))}
            </View>

            {/*<View style={uiStyles.adSection}>
                <Image source={require('@/assets/images/ad_banner.jpg')} style={uiStyles.adImage}/>
            </View>*/}
            <View style={uiStyles.bannerContainer}>
                <Image source={require('@/assets/icons/rapido.jpg')} style={uiStyles.banner}/>
            </View>
        </View>
    );
}

export default SheetContent;
