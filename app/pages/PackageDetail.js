import { useState } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const PackageDetail = ({ navigation, route }) => {
  const { categoryId, categoryName } = route?.params || {};

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [packageType, setPackageType] = useState(""); // small/medium/large
  const [weight, setWeight] = useState("");
  const [packagePhoto, setPackagePhoto] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const packageSizes = [
    { id: "small", label: "Small", icon: "cube-outline", description: "Up to 5kg" },
    { id: "medium", label: "Medium", icon: "cube", description: "5kg - 15kg" },
    { id: "large", label: "Large", icon: "cube-sharp", description: "15kg+" },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPackagePhoto(result.assets[0].uri);
    }
  };

  const findRider = () => {
    // Validation
    if (!pickupLocation.trim()) {
      Alert.alert("Error", "Please enter pickup location");
      return;
    }
    if (!dropLocation.trim()) {
      Alert.alert("Error", "Please enter drop location");
      return;
    }
    if (!packageType) {
      Alert.alert("Error", "Please select package size");
      return;
    }
    if (!weight.trim()) {
      Alert.alert("Error", "Please enter package weight");
      return;
    }

    // Clean weight value (remove any non-numeric characters except decimal point)
    const cleanWeight = weight.replace(/[^0-9.]/g, '');
    
    if (!cleanWeight || parseFloat(cleanWeight) <= 0) {
      Alert.alert("Error", "Please enter a valid weight (numbers only)");
      return;
    }

    // Navigate to Track Order screen
    // Note: packagePhoto (blob URL) won't persist across navigation
    // In production, upload to Firebase Storage first
    navigation.navigate("TrackOrder", {
      categoryId,
      categoryName,
      pickupLocation,
      dropLocation,
      packageType,
      weight: cleanWeight,
      packagePhoto: packagePhoto, // This is just for display, won't work in production
      additionalNotes,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Package Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Category Badge */}
        {categoryName && (
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={16} color="#2c5aa0" />
            <Text style={styles.categoryText}>{categoryName}</Text>
          </View>
        )}

        {/* Pickup Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              value={pickupLocation}
              onChangeText={setPickupLocation}
              style={styles.input}
              placeholder="Enter pickup address"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Drop Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Drop Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="flag" size={20} color="#FF3B30" style={styles.inputIcon} />
            <TextInput
              value={dropLocation}
              onChangeText={setDropLocation}
              style={styles.input}
              placeholder="Enter drop address"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Package Size Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Package Size</Text>
          <View style={styles.sizeContainer}>
            {packageSizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[
                  styles.sizeCard,
                  packageType === size.id && styles.sizeCardSelected,
                ]}
                onPress={() => setPackageType(size.id)}
              >
                <Ionicons
                  name={size.icon}
                  size={32}
                  color={packageType === size.id ? "#2c5aa0" : "#666"}
                />
                <Text style={[
                  styles.sizeLabel,
                  packageType === size.id && styles.sizeLabelSelected,
                ]}>
                  {size.label}
                </Text>
                <Text style={styles.sizeDescription}>{size.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Weight (kg)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="scale-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={weight}
              onChangeText={(text) => {
                // Only allow numbers and decimal point
                const cleaned = text.replace(/[^0-9.]/g, '');
                setWeight(cleaned);
              }}
              style={styles.input}
              placeholder="e.g., 5 or 2.5"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Package Photo (Optional)</Text>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            {packagePhoto ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: packagePhoto }} style={styles.photoPreview} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => setPackagePhoto(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#666" />
                <Text style={styles.photoText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            style={[styles.inputContainer, styles.textArea]}
            placeholder="Any special instructions..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Find Rider Button */}
        <TouchableOpacity style={styles.findRiderButton} onPress={findRider}>
          <Ionicons name="bicycle" size={24} color="#FFFFFF" />
          <Text style={styles.findRiderText}>Find Rider</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#538cc6',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c5aa0",
    marginLeft: 6,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 100,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: "flex-start",
  },
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sizeCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  sizeCardSelected: {
    borderColor: "#2c5aa0",
    backgroundColor: "#E3F2FD",
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  sizeLabelSelected: {
    color: "#2c5aa0",
  },
  sizeDescription: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  photoButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  photoPlaceholder: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  photoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  photoPreviewContainer: {
    position: "relative",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  removePhotoButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginLeft: 8,
  },
  findRiderButton: {
    flexDirection: "row",
    backgroundColor: "#2c5aa0",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  findRiderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },
});

export default PackageDetail;