import React, { useRef, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { Button, StyleSheet, Text, View } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraScreen() {
  const [typeCamera, setTypeCamera] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<any>(null);

  async function takePhoto() {
    const pictureMetadata = cameraRef.current
      ? await cameraRef.current.takePictureAsync()
      : null;
    console.log("pictureMetadata", pictureMetadata);
    console.log(
      await ImageManipulator.manipulateAsync(pictureMetadata.uri, [
        { resize: { width: 800 } },
      ])
    );
  }

  function toggleCameraType() {
    setTypeCamera((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
    console.log(typeCamera);
  }

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <>
      <Camera style={styles.camera} ref={cameraRef} type={typeCamera} />
      <Button title="Flip camera" onPress={toggleCameraType} />
      <Button onPress={() => takePhoto()} title="Take a picture" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
});
