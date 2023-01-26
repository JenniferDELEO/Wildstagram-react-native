import React, { useCallback, useState } from "react";
import { Image, StyleSheet, FlatList, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import singleFileUploader from "single-file-uploader";
import Constants from "expo-constants";

export default function ImagesScreen() {
  const [imagesURI, setImagesURI] = useState<string[] | void>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function getData() {
    try {
      setRefreshing(true);
      const images: string[] = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + "ImageManipulator"
      );
      setImagesURI(images);
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

  return imagesURI && imagesURI.length > 0 ? (
    <FlatList
      data={imagesURI}
      keyExtractor={(imagesURI) => imagesURI}
      refreshing={refreshing}
      onRefresh={getData}
      renderItem={(itemData) => {
        console.log("item", itemData);
        console.log(
          FileSystem.cacheDirectory + "ImageManipulator/" + itemData.item
        );
        return (
          <>
            <Image
              style={styles.image}
              source={{
                uri:
                  FileSystem.cacheDirectory +
                  "ImageManipulator/" +
                  itemData.item,
              }}
            />
            <Button
              title="upload"
              onPress={async () => {
                try {
                  await singleFileUploader({
                    distantUrl:
                      "https://wildstagram.nausicaa.wilders.dev/upload",
                    expectedStatusCode: 201,
                    filename: itemData.item,
                    filetype: "image/jpg",
                    formDataName: "fileData",
                    localUri:
                      FileSystem.cacheDirectory +
                      "ImageManipulator/" +
                      itemData.item,
                    token: Constants?.manifest?.extra?.token,
                  });
                  alert("Uploaded");
                } catch (err) {
                  console.log(err);
                  alert("Error");
                }
              }}
            />
            <Button
              title="Delete"
              onPress={async () => {
                try {
                  await FileSystem.deleteAsync(
                    FileSystem.cacheDirectory +
                      "ImageManipulator/" +
                      itemData.item
                  );
                  alert("Deleted");
                } catch (error) {
                  console.log(error);
                  alert("Error");
                }
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
    height: 500,
  },
});
