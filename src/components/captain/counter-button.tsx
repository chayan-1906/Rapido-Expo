import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Colors} from "@/utils/Constants";
import CustomText from "@/components/shared/CustomText";
import {CountdownCircleTimer} from "react-native-countdown-circle-timer";

interface CounterButtonProps {
    title: string;
    initialCount: number;
    onCountDownEnd: () => void;
    onPress: () => void;
}

function CounterButton({onCountDownEnd, initialCount, onPress, title}: CounterButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <CustomText fontFamily={'Medium'} fontSize={12} style={styles.text}>{title}</CustomText>
            <View style={styles.counter}>
                <CountdownCircleTimer onComplete={onCountDownEnd} isPlaying duration={initialCount} size={30} strokeWidth={3}
                                      colors={['#004777', '#F7B801', '#A30000', '#A30000']} colorsTime={[12, 5, 2, 0]}/>
            </View>
        </TouchableOpacity>
    );
}

export default CounterButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.primary,
    },
    counter: {
        backgroundColor: 'white',
        borderRadius: 50,
    },
    text: {
        color: '#000',
        marginRight: 10,
    },
});
