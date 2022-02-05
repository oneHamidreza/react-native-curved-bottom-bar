import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Svg, { Path } from 'react-native-svg';
import { useDeviceOrientation } from '../../../useDeviceOrientation';
import { getPath, getPathUp } from './path';
import { styles } from './styles';
import { NavigatorBottomBar } from './type';

const defaultProps = {
  bgColor: 'gray',
  type: 'down',
  borderTopLeftRight: false,
  strokeWidth: 0
};

const BottomBarComponent: NavigatorBottomBar = React.forwardRef((props, ref) => {
  const {
    type,
    style,
    width = null,
    height = 65,
    circleWidth = 50,
    bgColor,
    initialRouteName,
    tabBar,
    renderCircle,
    borderTopLeftRight,
    strokeWidth,
    swipeEnabled = false,
    lazy = false,
  } = props;

  const [selectedTab, setselectedTab] = useState<string>(initialRouteName);
  const [itemLeft, setItemLeft] = useState([]);
  const [itemRight, setItemRight] = useState([]);
  const [maxWidth, setMaxWidth] = useState<any>(width);
  const children = props?.children as any[];
  const orientation = useDeviceOrientation();
  const refPageView: any = useRef(null);
  const containerRef: any = useRef(null);
  const [lazyList] = useState<Boolean[]>([...Array(children.length)].map((item, index) => {
    return false;
  }));

  useImperativeHandle(ref, () => {
    return { navigate: navigate, getRouteName: selectedTab, setStyle, };
  });

  const navigate = (routeName: string) => {
    setRouteName(routeName);
  };

  const setStyle = (style: any) => {
    containerRef?.current?.setNativeProps({style:[styles.container, style]})
  };


  useEffect(() => {
    const { width: w, height: h } = Dimensions.get('window');
    if (!width) {
      setMaxWidth(w);
    }
  }, [orientation]);

  const _renderButtonCenter = () => {
    return renderCircle({ selectedTab, navigate });
  };

  const selectedTabIndex = useMemo(() => {
    const index = children.findIndex(e => e.props?.name == initialRouteName);
    if (index >= 0) {
      return index;
    }
    return 0;
  }, [initialRouteName]);

  useEffect(() => {
    const arrLeft: any = children.filter((item) => item?.props?.position === 'left');
    const arrRight: any = children.filter((item) => item?.props?.position === 'right');

    setItemLeft(arrLeft);
    setItemRight(arrRight);
    setRouteName(initialRouteName);
  }, []);

  const setRouteName = (name: string) => {
    setselectedTab(name);
    const index = children.findIndex(e => e.props?.name == name);
    if (index >= 0) {
      refPageView.current.setPageWithoutAnimation(index);
    }
  };

  const onPageSelected = (index: number) => {
    setselectedTab(children[index].props?.name);
  };

  const tabSelected = useMemo(() => {
    const selectIndex = children.findIndex(e => e.props?.name == selectedTab);
    lazyList[selectIndex] = true;
    return lazyList
  }, [selectedTab]);

  const _renderTab = (item: any, index: number) => {
    if (lazy) {
      return (<View
        key={index.toString()}
        style={{ flex: 1 }}>
        {item.props.renderHeader && item.props.renderHeader({ navigate: (routeName: string) => { setRouteName(routeName) } })}
        {tabSelected[index] && item.props.component({ navigate: (routeName: string) => { setRouteName(routeName) } })}
      </View>)
    } else {
      return (<View
        key={index.toString()}
        style={{ flex: 1 }}>
        {item.props.renderHeader && item.props.renderHeader({ navigate: (routeName: string) => { setRouteName(routeName) } })}
        {item.props.component({ navigate: (routeName: string) => { setRouteName(routeName) } })}
      </View>)
    }
  };

  const d = type === 'down' ? getPath(maxWidth, height, circleWidth >= 50 ? circleWidth : 50, borderTopLeftRight) : getPathUp(maxWidth, height + 30, circleWidth >= 50 ? circleWidth : 50, borderTopLeftRight);
  if (d) {
    return (
      <View style={{ flex: 1 }}>
        <PagerView
          ref={refPageView}
          style={{ flex: 1 }}
          initialPage={selectedTabIndex}
          scrollEnabled={lazy ? false : swipeEnabled}
          onPageSelected={e => onPageSelected(e.nativeEvent.position)}
        >
          {children.map(_renderTab)}
        </PagerView>

        <View ref={containerRef} style={[styles.container, style]}>
          <Svg width={maxWidth} height={height + (type === 'down' ? 0 : 30)}>
            <Path fill={bgColor} stroke="#DDDDDD" strokeWidth={strokeWidth} {...{ d }} />
          </Svg>
          <View style={[styles.main, { width: maxWidth }, type === 'up' && { top: 30 }]}>
            <View style={[styles.rowLeft, { height: height }]}>
              {itemLeft.map((item: any, index) => {
                const routeName: string = item?.props?.name;

                return (
                  <View style={{ flex: 1 }} key={index}>
                    {tabBar({
                      routeName,
                      selectedTab: selectedTab,
                      navigate: (selectedTab: string) => {
                        setRouteName(selectedTab);
                      },
                    })}
                  </View>
                );
              })}
            </View>
            {_renderButtonCenter()}
            <View style={[styles.rowRight, { height: height }]}>
              {itemRight.map((item: any, index) => {
                const routeName = item?.props?.name;
                return (
                  <View style={{ flex: 1 }} key={index}>
                    {tabBar({
                      routeName,
                      selectedTab: selectedTab,
                      navigate: (selectedTab: string) => {
                        setRouteName(selectedTab);
                      },
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
  return null;
});

BottomBarComponent.defaultProps = defaultProps;

export default BottomBarComponent;
