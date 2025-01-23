import {Text, View} from "react-native";

type VehicleType = 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';

interface RideItem {
    _id: string;
    vehicle?: VehicleType;
    pickup?: { address: string };
    drop?: { address: string };
    fare?: number;
}

function CaptainRidesItem({removeIt, item}: { removeIt: () => void; item: RideItem }) {
    return (
        <View>
            <Text>CaptainRidesItem</Text>
        </View>
    );
}

export default CaptainRidesItem;
