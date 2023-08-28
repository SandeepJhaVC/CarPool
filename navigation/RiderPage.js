import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import Rider from "../screens/Rider"; // Import the Rider component

const RiderPage = () => {
  useFocusEffect(
    React.useCallback(() => {
      // Logic to run when the RiderPage is focused
      console.log("RiderPage is focused");
    }, [])
  );

  return <Rider />;
};

export default RiderPage;