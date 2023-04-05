import * as React from 'react';
import { useRef, useState } from 'react';
import { Text, View, PanResponder, Dimensions,Image } from 'react-native';
import { styles } from './Dashboard';
import Images from '../../common/Images'
import { Shadow } from '../../common/Shadow';
const CHILD_A = 'CHILD_A';
const CHILD_B = 'CHILD_B';
const CHILD_A_HEIGHT = 100;
const CHILD_B_HEIGHT = 200;

const width = Dimensions.get('window')

const all_items = [
  { type: CHILD_A, text: 'A', height: CHILD_A_HEIGHT },
  // { type: CHILD_B, text: 'B', height:CHILD_B_HEIGHT },
  // { type: CHILD_A, text: 'C', height:CHILD_A_HEIGHT },
];

const Parent = props => {

  const {
    slideIcon,
    onEndReach,
    imageIcon
  } = props


  const [y, setY] = useState(0);
  const [index, setIndex] = useState(null);
  const [items, setItems] = useState(all_items);

  // const [slideIcon, setSlideIcon] = useState(false)
  // const [refresh, setRefresh] = useState(setValue)

  const setPosition = (index, y) => {
    const _items = items;
    _items[index]['position'] = y;
    setItems(_items)
  }

  const onEndReachSuccess = (value) => {
    alert("jhgdfgshgf------- 1" )
    console.log("change ---- ", value);
    console.log("change ---- ", slideIcon);
    // setSlideIcon(!slideIcon)
    // setRefresh(!refresh)
    // onEndReach()
  }
  
  // const heights = items.map((item) =>
  //   item.type === CHILD_A ? CHILD_A_HEIGHT : CHILD_B_HEIGHT
  // );

  // let heightsSum = 0;
  // const heightsCumulative = heights.map(
  //   (elem) => (heightsSum = heightsSum + elem)
  // );

  return (
    <View style={{ marginTop: 0}}>
      {/* <Text>Index: {index}</Text>
      <Text>Y: {y}</Text> */}
      <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: "center", backgroundColor: 'white', marginTop: 30,...Shadow }}>
       <View style={{marginLeft:"2%", alignItems: "center",}}>
        <Text
          style={[
            styles.punch,
            { color: slideIcon == false ? '#BF0202' : '#40B422' },
          ]}>
          {slideIcon == false ? 'Punch Out' : 'Punch In'}
        </Text>
        <Text style={styles.bottomSliderText}>
          {slideIcon == false
            ? 'Punching out will end your shift'
            : 'Punching in will start your shift'}
        </Text>
        </View>
      </View>

      <View style={{ height:60, justifyContent: 'center', marginTop: -60, backgroundColor: 'transparent' }}>
        {items.map((item, itemIndex) => {
          const isBeingDragged = itemIndex === index;
          const top = isBeingDragged ? item.position + y : item.position;
            
             
             
          return <Child 
                top={top}
                // onRelease={(value) => onEndReachSuccess(value)}
                onRelease={onEndReach}
                isBeingDragged={isBeingDragged}
                height={item.height}
                backgroundColor='green'
                childBackgroundColor="green"
                position={item.position}
                setPosition={setPosition}
                index={itemIndex}
                setIndex={setIndex}
                setY={setY}
                imageIcon={imageIcon}
              // text={item.text}
              />

        })}
      </View>

    </View>
  );
};

const DragHandle = ({ index, setIndex, onRelease, setY, children }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        setIndex(index);
      },
      onPanResponderMove: (evt, gestureState) => {
        setY(gestureState.dx <= 0 ? 0 : gestureState.dx); // This does not work :(
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx >= 290) {
          onRelease(true)
        }

        setY(0);
        setIndex(null);
      },
      // onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })
  ).current;
  return (
    <View
      {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

const Child = ({ top, isBeingDragged, position, onRelease, imageIcon, height, backgroundColor, childBackgroundColor, setPosition, text2, index, setIndex, setY, text }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        setIndex(index);
      },
      onPanResponderMove: (evt, gestureState) => {
        setY(gestureState.dx <= 0 ? 0 : gestureState.dx); // This does not work :(
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx >= 290) {
          onRelease()
        }

        setY(0);
        setIndex(null);
      },
      // onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })
  ).current;
  return (
    <View
      style={{
        left: top <= 0 ? 0 : top > width.width - 95 ? width.width - 95 : top,
        width: '100%',
        position: position ? 'absolute' : 'relative',
        zIndex: isBeingDragged ? 1 : 0,
       
      }}
      key={index}
      onLayout={(e) => position !== undefined ? null : setPosition(index, e.nativeEvent.layout.y)}
    >
      <View
      {...panResponder.panHandlers}>
      <View 
          // style={{ backgroundColor: 'red', width: 60, height: 60, borderRadius: 30 }}
        />
 <Image style={{height:50,width:50,resizeMode:'contain'}} source={imageIcon}></Image>
    </View>

      {/* <DragHandle index={index} onRelease={onRelease} setIndex={setIndex} setY={setY}>
        <View
          style={{ backgroundColor: 'red', width: 60, height: 60, borderRadius: 30 }}
        />
      </DragHandle> */}
      {/* <Text>Child {text2}: {index+1}</Text> */}
    </View>
    // </View>
  );
};

export default Parent;



