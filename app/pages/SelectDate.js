import React from "react";
import { ScrollView, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
const SelectDate = ({ navigation }) => {
  const [date, setDate] = React.useState(new Date());
  return (
    <ScrollView style={{ Height: "100%" }}>
      <DatePicker
        date={date}
        mode="date" // or "time" | "datetime"
        onDateChange={setDate}
        style={{ alignSelf: "center" }}
      />
    </ScrollView>
  );
};

export default SelectDate;
