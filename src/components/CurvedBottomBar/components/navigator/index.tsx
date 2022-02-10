import React, {Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {Dimensions, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import Svg, {Path} from 'react-native-svg';
import {useDeviceOrientation} from '../../../useDeviceOrientation';
import {getPath, getPathUp} from './path';
import {styles} from './styles';
import {NavigatorBottomBar, NavigatorBottomMenu, MenuProps} from './type';

const defaultProps = {
  bgColor: 'gray',
  type: 'down',
  borderTopLeftRight: false,
  strokeWidth: 0
};

//bad approach
let tabSelected = ''

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
  } = props;
  // console.log('BottomNavigation Render')

  const children = props?.children as any[];
  const refPageView: any = useRef(null);
  const containerRef: any = useRef(null);
  const menuRef: any = useRef(null);

  const getRouteName = () => {
    return tabSelected
  }

  const navigate = (name: string) => {
    updateSelectedTab(name)
    const index = children.findIndex(e => e.props?.name == name);
    if (index >= 0) {
      refPageView?.current?.setPageWithoutAnimation(index);
    }
  };

  const setStyle = (style: any) => {
    containerRef?.current?.setNativeProps({style: [styles.container, style]})
  };

  useImperativeHandle(ref, () => {
    return {navigate: navigate, getRouteName: () => (tabSelected), setStyle,};
  }, [tabSelected]);

  const selectedInitialTabIndex = useMemo(() => {
    const index = children.findIndex(e => e.props?.name == initialRouteName);
    if (index >= 0) {
      return index;
    }
    return 0;
  }, [initialRouteName]);

  const onPageSelected = (index: number) => {
    updateSelectedTab(children[index].props?.name)
  };

  const updateSelectedTab = useCallback((name) => {
    tabSelected = name
    menuRef?.current?.updateSelectedTab(name)
  }, [menuRef, menuRef?.current])

  const _renderTab = (item: any, index: number) => {
    return (<View
      key={index.toString()}
      style={{flex: 1}}>
      {item.props.renderHeader && item.props.renderHeader({
        navigate: (routeName: string) => {
          navigate(routeName)
        }
      })}
      {item.props.component({
        navigate: (routeName: string) => {
          navigate(routeName)
        }
      })}
    </View>)
  };

  useEffect(() => {
    navigate(initialRouteName);
  }, []);

  return (<View style={{flex: 1}}>
      <PagerView
        ref={refPageView}
        style={{flex: 1}}
        initialPage={selectedInitialTabIndex}
        scrollEnabled={swipeEnabled}
        onPageSelected={e => onPageSelected(e.nativeEvent.position)}
      >
        {children.map(_renderTab)}
      </PagerView>
      <BottomMenu
        ref={menuRef}
        containerRef={containerRef}
        navigate={navigate}
        style={[styles.container, style]}
        width={width}
        height={height}
        arrLeft={children.filter((item) => item?.props?.position === 'left')}
        arrRight={children.filter((item) => item?.props?.position === 'right')}
        type={type}
        bgColor={bgColor}
        strokeWidth={strokeWidth}
        tabBar={tabBar}
        circleWidth={circleWidth}
        renderCircle={renderCircle}
        borderTopLeftRight={borderTopLeftRight}
      />
    </View>
  );
});

const BottomMenu = React.forwardRef((props: MenuProps, ref: Ref<NavigatorBottomMenu>) => {
  const {
    containerRef,
    navigate,
    arrLeft,
    arrRight,
    initialRouteName,
    width,
    height,
    type,
    bgColor,
    strokeWidth,
    tabBar,
    circleWidth,
    renderCircle,
    borderTopLeftRight,
    style
  } = props
  const [selectedTab, setSelectedTab] = useState()
  const orientation = useDeviceOrientation();
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const iconContainerRef = useRef(null);

  const [itemLeft, setItemLeft] = useState([]);
  const [itemRight, setItemRight] = useState([]);

  useImperativeHandle(ref, () => {
    return {updateSelectedTab: updateSelectedTab};
  });

  useEffect(() => {
    const {width: w, height: h} = Dimensions.get('window');
    if (!width) {
      const d = type === 'down' ? getPath(w, height, circleWidth >= 50 ? circleWidth : 50, borderTopLeftRight) : getPathUp(w, height + 30, circleWidth >= 50 ? circleWidth : 50, borderTopLeftRight);

      svgRef?.current?.setNativeProps({width: w})
      pathRef?.current?.setNativeProps({d})
      iconContainerRef?.current?.setNativeProps({style: [styles.main, {width: w}, type === 'up' && {top: 30}]})
    }
  }, [type, orientation, svgRef, svgRef?.current, pathRef, pathRef?.current, iconContainerRef, iconContainerRef?.current]);

  const _renderButtonCenter = useCallback(() => {
    return renderCircle({selectedTab, navigate});
  }, [selectedTab, navigate]);

  function updateSelectedTab(name) {
    setSelectedTab(name)
  }

  useEffect(() => {
    setItemLeft(arrLeft);
    setItemRight(arrRight);
  }, []);

  return (<View ref={containerRef} style={[styles.container, style]}>
    <Svg ref={svgRef} height={height + (type === 'down' ? 0 : 30)}>
      <Path ref={pathRef} fill={bgColor} stroke="#DDDDDD" strokeWidth={strokeWidth}/>
    </Svg>
    <View ref={iconContainerRef}>
      <View style={[styles.rowLeft, {height: height}]}>
        {itemLeft.map((item: any, index) => {
          const routeName: string = item?.props?.name;

          return (
            <View style={{flex: 1}} key={index}>
              {tabBar({
                routeName,
                selectedTab: selectedTab,
                navigate: (selectedTab: string) => {
                  navigate(selectedTab);
                },
              })}
            </View>
          );
        })}
      </View>
      {_renderButtonCenter()}
      <View style={[styles.rowRight, {height: height}]}>
        {itemRight.map((item: any, index) => {
          const routeName = item?.props?.name;
          return (
            <View style={{flex: 1}} key={index}>
              {tabBar({
                routeName,
                selectedTab: selectedTab,
                navigate: (selectedTab: string) => {
                  navigate(selectedTab);
                },
              })}
            </View>
          );
        })}
      </View>
    </View>
  </View>)
})

BottomBarComponent.defaultProps = defaultProps;

export default BottomBarComponent;
