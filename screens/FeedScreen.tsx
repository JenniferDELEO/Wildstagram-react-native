import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";

export default function FeedScreen() {
  const [serverImageUrls, setServerImageUrls] = useState<string[] | void>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function getData() {
    try {
      setRefreshing(true);
      const filesUrl = await axios.get(
        "https://wildstagram.nausicaa.wilders.dev/list"
      );
      console.log("filesUrl", filesUrl.data);
      setServerImageUrls(filesUrl.data.reverse());
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  return serverImageUrls && serverImageUrls.length > 0 ? (
    <FlashList
      data={serverImageUrls}
      keyExtractor={(serverImageUrls) => serverImageUrls}
      refreshing={refreshing}
      onRefresh={getData}
      estimatedItemSize={299}
      renderItem={(itemData) => {
        console.log("item", itemData);
        return (
          <>
            <Image
              style={styles.image}
              source={{
                uri:
                  "https://wildstagram.nausicaa.wilders.dev/files/" +
                  itemData.item,
              }}
            />
          </>
        );
      }}
    />
  ) : null;
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    height: 300,
  },
});
