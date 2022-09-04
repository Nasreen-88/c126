
import React  from 'react';
import PickImage from './screens/Camera';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component{
  render()
  {
    let { image } = this.state;
      return (
        <View style={{ flex: 1,
              alignItems: "center",
              justifyContent: "center" }}>
            
            <Button
              title="Pick an image from camera roll"
              onPress={this._pickImage}
            />
      </View>
      );
    //return <PickImage/>
  }


  componentDidMount() {
    this.getPermissionAsync(); //call to function
    }



// defination of function
  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };




  _pickImage = async () => {
    try {
              let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All ,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
              });


              if (!result.cancelled) 
              {
                  this.setState({ image:
                  result.data });
                  console.log(result.uri)
                  this.uploadImage(result.uri);
              }
}
   catch (E) {
          console.log(E);
}
};






uploadImage = async (uri) => {
  const data = new FormData();
  let filename =  uri.split("/")[uri.split("/").length - 1]

  let type =  `image/${uri.split('.')[uri.split('.').length - 1]}`
 
      const fileToUpload = 
      {
        uri: uri,
        name: filename,
        type: type,
      };

  data.append("digit", fileToUpload);
 
  fetch("https://07afd951a187.ngrok.io/predict-digit", {
        method: "POST",
        body: data,
        headers: {
        "content-type":
      "multipart/form-data",
        },
  })

  .then((response) => response.json())

  .then((result) => {
      console.log("Success:",result);
  })

  .catch((error) => {
    console.error("Error:", error);
  });
  };
 
}


















// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
