import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SplashScreen = ({ navigation, route }) => {
  const { userRole } = route?.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate based on user role after 2 seconds
      if (userRole === "Customer") {
        navigation.replace("CustomerHome");
      } else if (userRole === "Rider") {
        navigation.replace("HomeRider");
      } else {
        navigation.replace("Select");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, userRole]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon name="cube-outline" size={120} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Object{'\n'}Transfer{'\n'}System</Text>
        <Text style={styles.subtitle}>Fast • Safe • Reliable</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538cc6",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default SplashScreen;
