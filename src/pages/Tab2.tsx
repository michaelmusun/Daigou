import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
  IonText,
} from "@ionic/react";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
// import * as canvas2ImagePlugin from 'cordova-plugin-canvas2image';
// import canvas2ImagePlugin from "cordova-plugin-canvas2image";
import { camera, archive, trash, close } from "ionicons/icons";
import { usePhotoGallery, Photo } from "../hooks/usePhotoGallery";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";

const Tab2: React.FC = () => {
  const [barcode, setBarcode] = useState("-1");
  const { deletePhoto, photos, takePhoto } = usePhotoGallery(barcode);
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();

  // https://stackoverflow.com/questions/50009585/error-error-uncaught-in-promise-cordova-not-available-with-ionic-serve
  // I know that cordova plugins are not available with ionic serve
  const openScanner = async () => {
    const scannedBC = await BarcodeScanner.scan();
    setBarcode(scannedBC.text);
    console.log(`Barcode data: ${scannedBC.text}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
          <IonCol>
            <IonText>{barcode}</IonText>
          </IonCol>
          <IonCol>
            <IonButton onClick={openScanner}>Scan Barcode</IonButton>
          </IonCol>
        </IonRow>
        <IonGrid>
          <IonRow>
            {/* Location: mtp:/HD1905/Internal shared storage/Android/data/io.ionic.starter/files/Pictures/ */}
            {/* filter out photos that match barcode, then map those to display in the grid on screen */}
            {photos
              .filter(
                (photo, index) =>
                  barcode ==
                  photo.filepath.split("/").slice(-1)[0].split("_")[0]
              )
              .map((photo, index) => (
                <IonCol size="6" key={index}>
                  <IonImg
                    onClick={() => setPhotoToDelete(photo)}
                    src={photo.base64 ?? photo.webviewPath}
                  />
                  {photo.filepath}
                </IonCol>
              ))}
          </IonRow>
        </IonGrid>

        {/* Displays list of photo filepaths for debugging*/}
        {/* <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
                <IonCol size="6" key={index}>
                  {photo.filepath}
                </IonCol>            
            ))}
          </IonRow>
        </IonGrid> */}

        {/* Take Photo Button */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

        {/* Canvas2Image button*/}
        {/* <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => 
              canvas2ImagePlugin.saveImageDataToLibrary(
                function(msg:any){
                    console.log(msg);
                },
                function(err:any){
                    console.log(err);
                },
                document.getElementById('myCanvas')
              )
            }>
            <IonIcon icon={archive}></IonIcon>
          </IonFabButton>
        </IonFab> */}

        {/* trying to get base64 from photo, will try instead to do anonymously below */}
        {/* const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
    let base64Data: string;
      base64Data = await base64FromPath(photo.webPath!);
  }; */}

        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
            {
              text: "Delete",
              role: "destructive",
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete);
                  setPhotoToDelete(undefined);
                }
              },
            },
            {
              text: "Cancel",
              icon: close,
              role: "cancel",
            },
            {
              text: "Save to Gallery",
              role: "save",
              icon: archive,
              handler: () => {
                // I removed the argument 'img_' from Base64ToGallery
                if (photoToDelete) {
                  // const base64Data:string = (async () => {
                  //   let b64data = await base64FromPath(photoToDelete.webviewPath!);
                  //   return b64data;
                  // });

                  const download_photo = async () => {
                    const base64Data = await base64FromPath(
                      photoToDelete.webviewPath!
                    );
                    // return b64D;
                    // return Promise.resolve(b64D);

                    console.log("Photo's base64: ", base64Data);
                    console.log("Photo's base64: ", photoToDelete.webviewPath);
                    Base64ToGallery.base64ToGallery(base64Data).then(
                      (res) => console.log("Saved image to gallery ", res),
                      (err) =>
                        console.log("Error saving image to gallery ", err)
                    );
                  };
                  download_photo();
                  setPhotoToDelete(undefined);
                }
              },
            },
          ]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
