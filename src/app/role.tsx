import {Image, TouchableOpacity, View} from "react-native";
import {roleStyles} from "@/styles/roleStyles";
import CustomText from "@/components/shared/CustomText";
import {Routes} from "@/utils/Routes";
import {resetAndNavigate} from "@/utils/Helpers";

function Role() {
    const handleCustomerPress = () => {
        resetAndNavigate(Routes.CUSTOMER_AUTH);
    }

    const handleCaptainPress = () => {
        resetAndNavigate(Routes.CAPTAIN_AUTH);
    }

    return (
        <View style={roleStyles.container}>
            <Image source={require('@/assets/images/logo_t.png')} style={roleStyles.logo}/>
            <CustomText fontFamily={'Medium'} variant={'h5'}>Choose your user type</CustomText>

            {/** customer */}
            <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
                <Image source={require('@/assets/images/customer.png')} style={roleStyles.image}/>
                <View style={roleStyles.cardContent}>
                    <CustomText style={roleStyles.title}>Customer</CustomText>
                    <CustomText style={roleStyles.description}>Are you a customer? Order rides and deliveries easily.</CustomText>
                </View>
            </TouchableOpacity>

            {/** captain */}
            <TouchableOpacity style={roleStyles.card} onPress={handleCaptainPress}>
                <Image source={require('@/assets/images/captain.png')} style={roleStyles.image}/>
                <View style={roleStyles.cardContent}>
                    <CustomText style={roleStyles.title}>Captain</CustomText>
                    <CustomText style={roleStyles.description}>Are you a captain? Join us to drive and deliver.</CustomText>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default Role;
