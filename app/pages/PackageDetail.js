import { useState, useEffect } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../Helper/cloudinaryHelper";
import { addData, getAllData } from "../Helper/firebaseHelper";

const PackageDetail = ({ navigation, route }) => {
  const { categoryId, categoryName } = route?.params || {};

  // Parcel type selection: null = not selected, "withinCity" = within city, "outOfCity" = out of city
  const [parcelType, setParcelType] = useState(null);
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [originLat, setOriginLat] = useState(null);
  const [originLng, setOriginLng] = useState(null);
  const [destinationLat, setDestinationLat] = useState(null);
  const [destinationLng, setDestinationLng] = useState(null);
  const [distance, setDistance] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [packageType, setPackageType] = useState(""); // small/medium/large
  const [weight, setWeight] = useState("");
  const [packagePhoto, setPackagePhoto] = useState(null);
  const [packagePhotoUrl, setPackagePhotoUrl] = useState(null); // Cloudinary URL
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState(null); // Cloudinary URL
  const [uploadingPaymentProof, setUploadingPaymentProof] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // For within-city orders
  const [totalKm, setTotalKm] = useState("");
  const [priceOf1Km, setPriceOf1Km] = useState(null);
  const [loadingCityPrice, setLoadingCityPrice] = useState(false);

  // Get user from Redux
  const user = useSelector((state) => state.home?.user);

  const packageSizes = [
    { id: "small", label: "Small", icon: "cube-outline", description: "Up to 5kg" },
    { id: "medium", label: "Medium", icon: "cube", description: "5kg - 15kg" },
    { id: "large", label: "Large", icon: "cube-sharp", description: "15kg+" },
  ];

  // Fetch cityPrice when within-city is selected
  useEffect(() => {
    const fetchCityPrice = async () => {
      if (parcelType === "withinCity") {
        setLoadingCityPrice(true);
        try {
          const cityPriceData = await getAllData("cityPrice");
          if (cityPriceData && cityPriceData.length > 0) {
            // Get the first document's priceOf1Km
            const price = cityPriceData[0].priceOf1Km;
            setPriceOf1Km(price ? parseFloat(price) : null);
          } else {
            Alert.alert("Error", "City price data not found. Please contact support.");
            setPriceOf1Km(null);
          }
        } catch (error) {
          console.error("Error fetching city price:", error);
          Alert.alert("Error", "Failed to load city price. Please try again.");
          setPriceOf1Km(null);
        } finally {
          setLoadingCityPrice(false);
        }
      } else {
        // Reset when switching away from within-city
        setPriceOf1Km(null);
        setTotalKm("");
        setCalculatedPrice(null);
      }
    };

    fetchCityPrice();
  }, [parcelType]);

  // Calculate price for within-city orders
  useEffect(() => {
    if (parcelType === "withinCity" && totalKm && priceOf1Km) {
      const km = parseFloat(totalKm);
      if (!isNaN(km) && km > 0) {
        const price = km * priceOf1Km;
        setCalculatedPrice(price.toFixed(2));
        setDistance(km); // Set distance as km for within-city
      } else {
        setCalculatedPrice(null);
        setDistance(null);
      }
    }
  }, [totalKm, priceOf1Km, parcelType]);

  // Listen for city selection from CitySelector
  useEffect(() => {
    if (route.params?.originCity) {
      setOriginCity(route.params.originCity);
      setOriginLat(route.params.originLat);
      setOriginLng(route.params.originLng);
    }
    if (route.params?.destinationCity) {
      setDestinationCity(route.params.destinationCity);
      setDestinationLat(route.params.destinationLat);
      setDestinationLng(route.params.destinationLng);
    }
    if (route.params?.distance) {
      setDistance(route.params.distance);
    }
    if (route.params?.calculatedPrice) {
      setCalculatedPrice(route.params.calculatedPrice);
    }
    if (route.params?.senderName) {
      setSenderName(route.params.senderName);
    }
    if (route.params?.senderAddress) {
      setSenderAddress(route.params.senderAddress);
    }
    if (route.params?.senderPhone) {
      setSenderPhone(route.params.senderPhone);
    }
    if (route.params?.receiverName) {
      setReceiverName(route.params.receiverName);
    }
    if (route.params?.receiverAddress) {
      setReceiverAddress(route.params.receiverAddress);
    }
    if (route.params?.receiverPhone) {
      setReceiverPhone(route.params.receiverPhone);
    }
    // Clear the params to avoid applying it again on re-render
    navigation.setParams({
      originCity: undefined,
      originLat: undefined,
      originLng: undefined,
      destinationCity: undefined,
      destinationLat: undefined,
      destinationLng: undefined,
      distance: undefined,
      calculatedPrice: undefined,
      senderName: undefined,
      senderAddress: undefined,
      senderPhone: undefined,
      receiverName: undefined,
      receiverAddress: undefined,
      receiverPhone: undefined,
    });
  }, [route.params?.originCity, route.params?.destinationCity]);

  // Navigate to city selector screen
  const openCitySelector = () => {
    navigation.navigate("MapSelector", {
      returnScreen: "PackageDetail",
    });
  };

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
      const imageUri = result.assets[0].uri;
      setPackagePhoto(imageUri); // Set local preview
      
      // Upload to Cloudinary
      setUploadingImage(true);
      try {
        const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
        setPackagePhotoUrl(cloudinaryUrl); // Save Cloudinary URL
        Alert.alert('Success', 'Image uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
        setPackagePhoto(null); // Clear preview on error
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const pickPaymentProof = async () => {
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
      const imageUri = result.assets[0].uri;
      setPaymentProof(imageUri); // Set local preview
      
      // Upload to Cloudinary
      setUploadingPaymentProof(true);
      try {
        const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
        setPaymentProofUrl(cloudinaryUrl); // Save Cloudinary URL
        Alert.alert('Success', 'Payment proof uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Upload Failed', 'Failed to upload payment proof. Please try again.');
        setPaymentProof(null); // Clear preview on error
      } finally {
        setUploadingPaymentProof(false);
      }
    }
  };

  const placeOrder = async () => {
    // Validation for parcel type selection
    if (!parcelType) {
      Alert.alert("Error", "Please select parcel type (Within city or Out of city)");
      return;
    }

    // Validation for out-of-city orders
    if (parcelType === "outOfCity") {
      if (!originCity || !destinationCity) {
        Alert.alert("Error", "Please select origin and destination cities");
        return;
      }
    }

    // Validation for within-city orders
    if (parcelType === "withinCity") {
      if (!totalKm.trim()) {
        Alert.alert("Error", "Please enter total kilometers");
        return;
      }
      const km = parseFloat(totalKm);
      if (isNaN(km) || km <= 0) {
        Alert.alert("Error", "Please enter a valid number of kilometers");
        return;
      }
      if (!priceOf1Km) {
        Alert.alert("Error", "City price data not available. Please try again.");
        return;
      }
    }
    if (!senderName.trim() || !senderAddress.trim() || !senderPhone.trim()) {
      Alert.alert("Error", "Please fill in all sender details");
      return;
    }
    if (!receiverName.trim() || !receiverAddress.trim() || !receiverPhone.trim()) {
      Alert.alert("Error", "Please fill in all receiver details");
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
    if (!paymentProofUrl) {
      Alert.alert("Error", "Please upload payment proof");
      return;
    }

    // Clean weight value (remove any non-numeric characters except decimal point)
    const cleanWeight = weight.replace(/[^0-9.]/g, '');
    
    if (!cleanWeight || parseFloat(cleanWeight) <= 0) {
      Alert.alert("Error", "Please enter a valid weight (numbers only)");
      return;
    }

    if (!user || !user.uid) {
      Alert.alert("Error", "User not logged in. Please login first.");
      return;
    }

    // Place order
    setPlacingOrder(true);
    try {
      const orderData = {
        userId: user.uid,
        customerName: user.firstName + " " + user.lastName || user.email,
        customerEmail: user.email,
        categoryId: categoryId || null,
        categoryName: categoryName || "General Delivery",
        parcelType: parcelType, // "withinCity" or "outOfCity"
        originCity: parcelType === "outOfCity" ? originCity : null,
        originLat: parcelType === "outOfCity" ? originLat : null,
        originLng: parcelType === "outOfCity" ? originLng : null,
        destinationCity: parcelType === "outOfCity" ? destinationCity : null,
        destinationLat: parcelType === "outOfCity" ? destinationLat : null,
        destinationLng: parcelType === "outOfCity" ? destinationLng : null,
        distance: distance || 0,
        totalKm: parcelType === "withinCity" ? parseFloat(totalKm) : null,
        priceOf1Km: parcelType === "withinCity" ? priceOf1Km : null,
        price: calculatedPrice ? parseFloat(calculatedPrice) : null,
        packageType,
        weight: cleanWeight,
        packagePhoto: packagePhotoUrl || null,
        paymentProof: paymentProofUrl || null,
        additionalNotes: additionalNotes || "",
        senderName: senderName || "",
        senderAddress: senderAddress || "",
        senderPhone: senderPhone || "",
        receiverName: receiverName || "",
        receiverAddress: receiverAddress || "",
        receiverPhone: receiverPhone || "",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const orderId = await addData("orders", orderData);
      
      // Navigate directly to OrderConfirmation screen
      navigation.navigate("OrderConfirmation", {
        orderId,
        ...orderData,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
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

        {/* Parcel Type Selection */}
        {!parcelType && (
          <View style={styles.section}>
            <Text style={styles.label}>Select Parcel Type</Text>
            <View style={styles.parcelTypeContainer}>
              <TouchableOpacity
                style={styles.parcelTypeCard}
                onPress={() => setParcelType("withinCity")}
              >
                <Ionicons name="location" size={32} color="#2c5aa0" />
                <Text style={styles.parcelTypeLabel}>Within the City</Text>
                <Text style={styles.parcelTypeDescription}>Local delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.parcelTypeCard}
                onPress={() => setParcelType("outOfCity")}
              >
                <Ionicons name="map-outline" size={32} color="#2c5aa0" />
                <Text style={styles.parcelTypeLabel}>Out of City</Text>
                <Text style={styles.parcelTypeDescription}>Inter-city delivery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Show selected parcel type with option to change */}
        {parcelType && (
          <View style={styles.section}>
            <View style={styles.selectedParcelTypeContainer}>
              <View style={styles.selectedParcelTypeInfo}>
                <Ionicons 
                  name={parcelType === "withinCity" ? "location" : "map-outline"} 
                  size={20} 
                  color="#2c5aa0" 
                />
                <Text style={styles.selectedParcelTypeText}>
                  {parcelType === "withinCity" ? "Within the City" : "Out of City"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                setParcelType(null);
                // Reset all related fields
                setOriginCity("");
                setDestinationCity("");
                setOriginLat(null);
                setOriginLng(null);
                setDestinationLat(null);
                setDestinationLng(null);
                setDistance(null);
                setCalculatedPrice(null);
                setTotalKm("");
                setPriceOf1Km(null);
                setSenderName("");
                setSenderAddress("");
                setSenderPhone("");
                setReceiverName("");
                setReceiverAddress("");
                setReceiverPhone("");
              }}>
                <Text style={styles.changeParcelTypeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* City Selection - Only show for out-of-city orders */}
        {parcelType === "outOfCity" && (
        <View style={styles.section}>
          <Text style={styles.label}>Origin & Destination</Text>
          <TouchableOpacity 
            style={styles.citySelectorButton}
            onPress={openCitySelector}
          >
            <View style={styles.citySelectorContent}>
              <View style={styles.cityInfoContainer}>
                <View style={[styles.cityRow, { marginBottom: 12 }]}>
                  <Ionicons name="location" size={20} color="#4CAF50" />
                  <View style={styles.cityTextContainer}>
                    <Text style={styles.cityLabel}>Origin</Text>
                    <Text style={styles.cityValue}>
                      {originCity || "Select origin city"}
                    </Text>
                  </View>
                </View>
                <View style={styles.cityRow}>
                  <Ionicons name="flag" size={20} color="#FF3B30" />
                  <View style={styles.cityTextContainer}>
                    <Text style={styles.cityLabel}>Destination</Text>
                    <Text style={styles.cityValue}>
                      {destinationCity || "Select destination city"}
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </TouchableOpacity>
          
          {/* Sender & Receiver Info Display */}
          {(senderName || receiverName) && (
            <View style={styles.infoDisplayContainer}>
              {senderName && (
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={16} color="#4CAF50" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Sender:</Text>
                    <Text style={styles.infoValue}>{senderName}</Text>
                    {senderPhone && (
                      <Text style={styles.infoSubValue}>{senderPhone}</Text>
                    )}
                  </View>
                </View>
              )}
              {receiverName && (
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={16} color="#FF3B30" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Receiver:</Text>
                    <Text style={styles.infoValue}>{receiverName}</Text>
                    {receiverPhone && (
                      <Text style={styles.infoSubValue}>{receiverPhone}</Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
          
          {/* Price Display */}
          {calculatedPrice && distance && (
            <View style={styles.priceDisplayContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Distance:</Text>
                <Text style={styles.priceValue}>{distance.toFixed(2)} km</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Price:</Text>
                <Text style={styles.totalPriceValue}>₹{calculatedPrice}</Text>
              </View>
            </View>
          )}
        </View>
        )}

        {/* Within City - KM Input and Price Calculation */}
        {parcelType === "withinCity" && (
          <View style={styles.section}>
            <Text style={styles.label}>Distance & Price</Text>
            
            {loadingCityPrice ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingText}>Loading price data...</Text>
              </View>
            ) : (
              <>
                {/* Total KM Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="navigate-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    value={totalKm}
                    onChangeText={(text) => {
                      // Only allow numbers and decimal point
                      const cleaned = text.replace(/[^0-9.]/g, '');
                      setTotalKm(cleaned);
                    }}
                    style={styles.input}
                    placeholder="Enter total kilometers"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unitText}>km</Text>
                </View>

                {/* Price Display */}
                {priceOf1Km && (
                  <View style={styles.priceInfoContainer}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Price per km:</Text>
                      <Text style={styles.priceValue}>₹{priceOf1Km}</Text>
                    </View>
                    {totalKm && calculatedPrice && (
                      <>
                        <View style={styles.priceRow}>
                          <Text style={styles.priceLabel}>Total km:</Text>
                          <Text style={styles.priceValue}>{totalKm} km</Text>
                        </View>
                        <View style={[styles.priceRow, styles.totalPriceRow]}>
                          <Text style={styles.totalPriceLabel}>Total Price:</Text>
                          <Text style={styles.totalPriceValue}>₹{calculatedPrice}</Text>
                        </View>
                      </>
                    )}
                  </View>
                )}

                {/* Sender & Receiver Details Input for Within City */}
                <View style={styles.section}>
                  <Text style={styles.label}>Sender Details</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={senderName}
                      onChangeText={setSenderName}
                      style={styles.input}
                      placeholder="Sender name"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={[styles.inputContainer, { marginTop: 10 }]}>
                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={senderAddress}
                      onChangeText={setSenderAddress}
                      style={styles.input}
                      placeholder="Sender address"
                      placeholderTextColor="#999"
                      multiline
                    />
                  </View>
                  <View style={[styles.inputContainer, { marginTop: 10 }]}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={senderPhone}
                      onChangeText={setSenderPhone}
                      style={styles.input}
                      placeholder="Sender phone"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Receiver Details</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={receiverName}
                      onChangeText={setReceiverName}
                      style={styles.input}
                      placeholder="Receiver name"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={[styles.inputContainer, { marginTop: 10 }]}>
                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={receiverAddress}
                      onChangeText={setReceiverAddress}
                      style={styles.input}
                      placeholder="Receiver address"
                      placeholderTextColor="#999"
                      multiline
                    />
                  </View>
                  <View style={[styles.inputContainer, { marginTop: 10 }]}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={receiverPhone}
                      onChangeText={setReceiverPhone}
                      style={styles.input}
                      placeholder="Receiver phone"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        )}

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
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={pickImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <View style={styles.photoPlaceholder}>
                <ActivityIndicator size="large" color="#2c5aa0" />
                <Text style={styles.photoText}>Uploading...</Text>
              </View>
            ) : packagePhoto ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: packagePhoto }} style={styles.photoPreview} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => {
                    setPackagePhoto(null);
                    setPackagePhotoUrl(null);
                  }}
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

        {/* Payment Proof Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Proof (Required)</Text>
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={pickPaymentProof}
            disabled={uploadingPaymentProof}
          >
            {uploadingPaymentProof ? (
              <View style={styles.photoPlaceholder}>
                <ActivityIndicator size="large" color="#2c5aa0" />
                <Text style={styles.photoText}>Uploading...</Text>
              </View>
            ) : paymentProof ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: paymentProof }} style={styles.photoPreview} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => {
                    setPaymentProof(null);
                    setPaymentProofUrl(null);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="receipt-outline" size={40} color="#666" />
                <Text style={styles.photoText}>Upload Payment Proof</Text>
                <Text style={styles.photoSubText}>Screenshot or photo of payment</Text>
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

        {/* Place Order Button */}
        <TouchableOpacity 
          style={[styles.placeOrderButton, placingOrder && styles.placeOrderButtonDisabled]} 
          onPress={placeOrder}
          disabled={placingOrder || uploadingImage || uploadingPaymentProof || !paymentProofUrl}
        >
          {placingOrder ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.placeOrderText}>Placing Order...</Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.placeOrderText}>Place Order</Text>
            </>
          )}
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
  photoSubText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
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
  placeOrderButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
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
  placeOrderButtonDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.7,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  citySelectorButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  citySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cityInfoContainer: {
    flex: 1,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  cityLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  cityValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  priceDisplayContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c5aa0",
  },
  infoDisplayContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  infoSubValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  parcelTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  parcelTypeCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  parcelTypeCardSelected: {
    borderColor: "#2c5aa0",
    backgroundColor: "#E3F2FD",
  },
  parcelTypeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c5aa0",
    marginTop: 10,
  },
  parcelTypeDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  selectedParcelTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  selectedParcelTypeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedParcelTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  changeParcelTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c5aa0",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 10,
  },
  priceInfoContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
});

export default PackageDetail;