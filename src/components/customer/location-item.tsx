import {Image, TouchableOpacity, View} from "react-native";
import {commonStyles} from "@/styles/commonStyles";
import {locationStyles} from "@/styles/locationStyles";
import {uiStyles} from "@/styles/uiStyles";
import CustomText from "@/components/shared/CustomText";
import {Ionicons} from "@expo/vector-icons";

function LocationItem({item, onPress}: { item: any, onPress: () => void }) {
    const {title, description} = item;

    return (
        <TouchableOpacity style={[commonStyles.flexRowBetween, locationStyles.container]} onPress={onPress}>
            <View style={commonStyles.flexRow}>
                <Image source={require('@/assets/icons/map_pin2.png')} style={uiStyles.mapPinIcon}/>

                <View style={{width: '83%'}}>
                    <CustomText fontFamily={'Medium'} fontSize={12} numberOfLines={1}>{title}</CustomText>
                    <CustomText fontFamily={'Medium'} fontSize={10} numberOfLines={1} style={{opacity: 0.7, marginTop: 2}}>{description}</CustomText>
                </View>
            </View>

            <Ionicons name={'heart-outline'} size={20} color={'#CCC'}/>
        </TouchableOpacity>
    );
}

export default LocationItem;
