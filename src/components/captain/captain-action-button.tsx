import {View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {rideStyles} from "@/styles/rideStyles";
import {commonStyles} from "@/styles/commonStyles";
import CustomText from "@/components/shared/CustomText";
import {orderStyles} from "@/styles/captainStyles";
import SwipeButton from "rn-swipe-button";
import {RFValue} from "react-native-responsive-fontsize";

function CaptainActionButton({ride, title, onPress, color}: { ride: any; color?: string, title: string, onPress?: () => void }) {
    const CheckoutButton = () => {
        return (
            <Ionicons name={'arrow-forward-sharp'} style={{bottom: 2}} size={32} color={'#FFF'}/>
        );
    }

    return (
        <View style={rideStyles?.swipeableContainerCaptain}>
            <View style={commonStyles?.flexRowBetween}>
                <CustomText fontSize={11} style={{marginTop: 10, marginBottom: 3}} numberOfLines={1} fontFamily={'Medium'}>Meet the customer</CustomText>
                <CustomText fontSize={11} style={{marginTop: 10, marginBottom: 3}} numberOfLines={1} fontFamily={'Medium'}>
                    +91 {ride?.customer?.phone && ride?.customer?.phone?.slice(0, 5) + ' ' + ride?.customer?.phone?.slice(5)}
                </CustomText>
            </View>

            <View style={orderStyles.flexRowBase}>
                <View>
                    <View style={orderStyles.dropHollowCircle}/>
                    <View style={orderStyles.continuousLine}/>
                </View>

                <View style={orderStyles?.infoText}>
                    <CustomText fontSize={11} numberOfLines={1} fontFamily={'SemiBold'}>{ride?.pickup?.address?.slice(0, 10)}</CustomText>
                    <CustomText fontSize={9.5} numberOfLines={2} fontFamily={'Medium'} style={orderStyles.label}>{ride?.pickup?.address}</CustomText>
                </View>
            </View>

            <View style={orderStyles.flexRowBase}>
                <View style={orderStyles.dropHollowCircle}/>

                <View style={orderStyles?.infoText}>
                    <CustomText fontSize={11} numberOfLines={1} fontFamily={'SemiBold'}>{ride?.drop?.address?.slice(0, 10)}</CustomText>
                    <CustomText fontSize={9.5} numberOfLines={2} fontFamily={'Medium'} style={orderStyles.label}>{ride?.drop?.address}</CustomText>
                </View>
            </View>

            <SwipeButton
                containerStyles={rideStyles.swipeButtonContainer} height={30} shouldResetAfterSuccess={true}
                resetAfterSuccessAnimDelay={200} onSwipeSuccess={onPress} railBackgroundColor={color} railStyles={rideStyles.railStyles}
                railBorderColor={'transparent'} railFillBackgroundColor={'rgba(255, 255, 255, 0.6)'} railFillBorderColor={'rgba(255, 255, 255, 0.6)'}
                titleColor={'#FFF'} titleFontSize={RFValue(13)} titleStyles={rideStyles.titleStyles} thumbIconComponent={CheckoutButton}
                thumbIconStyles={rideStyles.thumbIconStyles} title={title.toUpperCase()} titleMaxLines={1}
                thumbIconBackgroundColor={'transparent'} thumbBorderColor={'transparent'} thumbIconHeight={50} thumbIconWidth={60}
            />
        </View>
    );
}

export default CaptainActionButton;
