import Feather from '@expo/vector-icons/Feather';
import {
  flex,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const Picture1 = ({ navigation , route }) => {
  
  const goToNext = () => {
    navigation.navigate("Picture2");
  };

  return (
    <scrollView style={{ height: "100%" }}>
      <View style={{ flex: 1, display: flex }}>
        <View>
           <TouchableOpacity
          onPress={()=>{}}
          style={{
            width: "50%",
            height: 50,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#2c5aa0",
              paddingTop: 5
            }}
          >
            Cancel Order
          </Text>
        </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 30,
            color: "black",
            textAlign: "center",
            paddingTop: 10,
          }}
        >
          Take a picture of item
        </Text>
        <view
          style={{
            marginLeft: "10%",
            fontSize: 15,
            textAlign: "center",
            paddingTop: 10,
          }}
        >
          <text>
            Please note: Take a picture of youre parcel close to a recognisable
            such as chair,laptop,pen etc
          </text>
        </view>
        <View>
          <Image
            style={{
              borderColor: "#0e0f0fff",
              borderWidth: 1,
              width: "80%",
              height: 380,
              alignSelf: "center",
              borderRadius: 10,
              marginTop: 40,
              backgroundColor: "white",
              paddingLeft: 10,
            }}
            source={require("../../assets/images/example.png")}
          />
        </View>
        <TouchableOpacity
          onPress={goToNext}
          style={{
            width: "50%",
            height: 50,
            backgroundColor: "#FFFFFF",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#000000",
              textAlign: "center",
              paddingTop: 10,
            }}
          >
            <Feather name="camera" size={24} color="#2c5aa0" />Take a picture
          </Text>
        </TouchableOpacity>
      </View>
    </scrollView>
  );
};

export default Picture1;
