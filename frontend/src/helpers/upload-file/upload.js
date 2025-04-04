import { storage } from "../../Auth/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};
