'use strict';
import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, Image, View, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import * as mapActions from '../actions/mapActions';
import { pokemonsImages, pokemonsNames } from '../assets/pokemons';
import Pmarker from './Pmarker';
function mapStateToProps(state) {
  return {
    mapInfo: state.mapReducer,
  }
}

class MapWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRef:null,
    };
  }
  componentDidMount() {
    //return; //Remove me
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //var initialPosition = JSON.stringify(position);
        console.log(position);
        this.props.dispatch(mapActions.init(position));

      },
      (error) => {console.log(error)},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      this.props.dispatch(mapActions.updatePosition(position));
      //this.setState({lastPosition});
    },(error) => {console.log(error)},
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000});
    console.log(this.refs);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  renderMapOrLoading(mapInfo) {
    //return (
    //   <MapView
    //     ref="myMap"
    //     style={styles.map}
    //     showsUserLocation={true}
    //     followsUserLocation={true}
    //   //  onRegionChange={this.onRegionChange}
    //     region={{
    //       latitude: 45.527499999999996,
    //       longitude: -73.59399833333333,
    //       latitudeDelta: 0.005,
    //       longitudeDelta: 0.0051,
    //     }}>
    //       <MapView.Marker coordinate={{latitude:45.527659922320694,longitude:-73.59428243747833}} image={pokemonsImages[1]}/>
    //       <MapView.Marker coordinate={{latitude:45.527659922320694,longitude:-73.59428243747833}}>
    //       <Pmarker />
    //       </MapView.Marker>
    //         {/*<View style={{width:25,height:25,borderWidth:0,alignItems:'center',justifyContent:'center',backgroundColor:'red'}}>
    //           <Image
    //             resizeMode={Image.resizeMode.contain}
    //             style={{
    //               width: 25,
    //               height: 25,
    //               //borderWidth:2,
    //               //borderRadius:25/2,
    //               //overflow:'hidden',
    //               backgroundColor:'blue',
    //             }}
    //             source={{uri:"http://pokeapi.co/media/sprites/pokemon/1.png"}}
    //             />
    //         </View>
    //       </MapView.Marker>*/}
    //     </MapView>
    // );

    if (mapInfo.region && mapInfo.position) {
      console.log(mapInfo.position);
      //debugger;
      return (<MapView
        ref="myMap"
        style={styles.map}
        showsUserLocation={true}
        //followsUserLocation={true}
        onRegionChangeComplete={(position)=>{
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            const old = mapInfo.region.coords;
            if (!old || (old.latitude != position.latitude || old.longitude != position.longitude)) {
              console.log('UPDATE MARKERS',old,position,mapInfo);
              this.props.dispatch(mapActions.updateRegion({coords:position}));
            }

          },1000);

        }}
        region={{
          latitude: mapInfo.region.coords.latitude,
          longitude: mapInfo.region.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
        {mapInfo.markers.map((marker,i) => (
          <MapView.Marker
            key={i}
            coordinate={{latitude:marker.Latitude,longitude:marker.Longitude}}
            >
            <Pmarker {...marker} />
          </MapView.Marker>
        ))}

        {mapInfo.markers.map((marker,i) => (
          <MapView.Marker
            key={`img-${i}`}
            title={pokemonsNames[marker.PokedexTypeId-1]}
            description="2minutes walk"
            coordinate={{latitude:marker.Latitude,longitude:marker.Longitude}}
            image={pokemonsImages[marker.PokedexTypeId]}
            />
        ))}

        <MapView.Marker key='me' coordinate={mapInfo.position.coords} />
      </MapView>)

    } else {
      return (<View style={{alignSelf:'stretch',flex:1,alignItems:'center',justifyContent:'center'}}><Text>Finding your location...</Text></View>)
    }
  }

  renderToolBar(mapInfo) {
    if (!mapInfo.position || !mapInfo.region) return null;
    return (<View style={{position:'absolute',left:0,right:0,bottom:40,alignSelf:'stretch',alignItems:'center',justifyContent:'center'}}>
    <TouchableOpacity style={{
        padding:10,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'rgba(0,0,0,.5)',
        borderRadius:15,
      }} onPress={() => {
        console.log('PRESSED!',this.refs);
        this.refs.myMap.animateToRegion({
          latitude: mapInfo.position.coords.latitude,
          longitude: mapInfo.position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }}><Text style={{

        fontSize:20,
        color:'white',
      }}>·</Text></TouchableOpacity>
    </View>);
  }

  render() {
    const mapInfo = this.props.mapInfo.toJS();
    console.log(mapInfo);
    return (
      <View style={styles.container}>
        {this.renderMapOrLoading(mapInfo)}
        {this.renderToolBar(mapInfo)}
      </View>
    );
  }
}

export default connect(mapStateToProps)(MapWrapper);
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
