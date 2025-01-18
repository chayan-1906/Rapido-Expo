import {Text, TouchableOpacity, View} from "react-native";
import {logout} from "@/services/authService";

function CaptainHome() {

    return (
        <View>
            <Text>Captain Home</Text>
            <TouchableOpacity style={{backgroundColor: 'red', padding: 20}} onPress={logout}>
                <Text style={{fontSize: 20}}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CaptainHome;
