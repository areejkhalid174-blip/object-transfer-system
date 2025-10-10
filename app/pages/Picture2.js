import {
  flex,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Picture2 = ({ navigation }) => {
  const goToNext = () => {
    navigation.navigate("Payment");
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
              height: 180,
              alignSelf: "center",
              borderRadius: 10,
              marginTop: 40,
              backgroundColor: "white",
              paddingLeft: 10,
            }}
            source={require("../../assets/images/chair.png")}
          />
        </View>

        <TextInput
          style={{
            borderColor: "#0a0c0cff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Take another picture of item"
        />
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
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </scrollView>
  );
};

export default Picture2;
