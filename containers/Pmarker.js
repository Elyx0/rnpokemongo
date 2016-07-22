import React, {Component} from 'react';
import { View, Text, Image } from 'react-native';
import moment from 'moment';
export default class Pmarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer:false,
      dissapearTime:props.dissapearTime,
    }
  }
  componentDidMount() {
    this.updateTimer();
  }
  updateTimer() {
    this.setState({timer:setTimeout(()=>{
      this.updateTimer();
    },1000)});
  }
  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
  render() {
    const imageSize = 25;
    const m = moment;
    const time = m.duration(this.props.dissapearTime - Date.now());
    //debugger;
    return(
      <View style={{position:'relative',width:80,height:60,alignItems:'center'}}>
        <View style={{borderWidth:1,paddingLeft:10,paddingRight:10,backgroundColor:'rgba(0,0,0,0.5)',borderRadius:10}}><Text style={{color:'white'}}>{`${time.get('minutes')}:${time.get('seconds')}`}</Text></View>
      </View>
    );
  }
}
