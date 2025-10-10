import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RatingCustomer() {
  const [rating, setRating] = useState(4);
  const [selectedIssues, setSelectedIssues] = useState([]);

  const issues = [
    "Poor Route",
    "Too many Pickups",
    "Co-rider behavior",
    "Navigation",
    "Driving",
    "Other",
  ];

  const toggleIssue = (issue) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter((i) => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rating</Text>

      {/* Rating Stars */}
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, { color: star <= rating ? "gold" : "#ccc" }]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subTitle}>
        {rating >= 4 ? "Good" : rating === 3 ? "Average" : "Bad"}
      </Text>

      {/* What went wrong */}
      <Text style={styles.question}>What went wrong?</Text>
      <View style={styles.issueContainer}>
        {issues.map((issue, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.issueButton,
              selectedIssues.includes(issue) && styles.issueSelected,
            ]}
            onPress={() => toggleIssue(issue)}
          >
            <Text
              style={[
                styles.issueText,
                selectedIssues.includes(issue) && { color: "white" },
              ]}
            >
              {issue}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.note}>Please Select one or more issues.</Text>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#000000" },
  starRow: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  star: { fontSize: 32, marginHorizontal: 5 },
  subTitle: { textAlign: "center", color: "#000000", marginBottom: 20 },
  question: { fontSize: 16, fontWeight: "500", marginBottom: 10, color: "#000000" },
  issueContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  issueButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
  },
  issueSelected: { backgroundColor: "#538cc6", borderColor: "#538cc6" },
  issueText: { fontSize: 14, color: "#000000" },
  note: { textAlign: "center", color: "#000000", marginBottom: 20 },
  submitButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#000000", fontSize: 16, fontWeight: "600" },
});
