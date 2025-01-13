import {Alert, Image, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {authStyles} from "@/styles/authStyles";
import {useState} from "react";
import {commonStyles} from "@/styles/commonStyles";
import {MaterialIcons} from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import PhoneInput from "@/components/shared/PhoneInput";
import CustomButton from "@/components/shared/CustomButton";
import {loginApi} from "@/services/authService";
import {useWS} from "@/services/WSProvider";

function CaptainAuth() {
    const [phone, setPhone] = useState('');
    const {updateAccessToken} = useWS();

    const handleNext = async () => {
        if (!phone || phone.trim().length !== 10) {
            Alert.alert('Please enter a valid phone number');
            return;
        }

        await loginApi({role: 'captain', phone}, updateAccessToken);
    }

    return (
        <SafeAreaView style={authStyles.container}>
            <ScrollView contentContainerStyle={authStyles.container}>
                <View style={commonStyles.flexRowBetween}>
                    <Image source={require('@/assets/images/captain_logo.png')} style={authStyles.logo}/>
                    <TouchableOpacity style={authStyles.flexRowGap}>
                        <MaterialIcons name={'help'} size={18} color={'grey'}/>
                        <CustomText fontFamily={'Medium'} variant={'h7'}>Help</CustomText>
                    </TouchableOpacity>
                </View>

                <CustomText fontFamily={'Medium'} variant={'h5'}>Good to see you, Captain!</CustomText>
                <CustomText fontFamily={'Regular'} variant={'h6'} style={commonStyles.lightText}>Enter your phone number to proceed</CustomText>

                <PhoneInput value={phone} onChangeText={setPhone}/>
            </ScrollView>

            <View style={authStyles.footerContainer}>
                <CustomText variant={'h7'} fontFamily={'Regular'} style={[commonStyles.lightText, {textAlign: 'center', marginHorizontal: 20}]}>
                    By continuing, you agree to the terms and privacy policy of Rapido
                </CustomText>
                <CustomButton title={'Next'} onPress={handleNext} loading={false} disabled={false}/>
            </View>
        </SafeAreaView>
    );
}

export default CaptainAuth;
