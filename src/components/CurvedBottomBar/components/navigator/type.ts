import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  type?: 'down' | 'up' | string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  borderTopLeftRight?: boolean;
  circleWidth?: number;
  bgColor?: string;
  initialRouteName: string;
  strokeWidth?: number;
  swipeEnabled?: boolean;
  lazy?: boolean;
  renderCircle: ({
                   selectedTab,
                   navigate,
                 }: {
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  }) => JSX.Element;
  tabBar: ({
             routeName,
             selectedTab,
             navigate,
           }: {
    routeName: string;
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  }) => JSX.Element;
}

export type NavigatorBottomBar = React.FC<Props>

export interface MenuProps {
  containerRef: any;
  navigate: (name:string) => void;
  arrLeft : [];
  arrRight: [];
  initialRouteName: string;
  width:number;
  height:number;
  type?: 'down' | 'up' | string;
  bgColor?: string;
  strokeWidth?: number;
  tabBar: ({
             routeName,
             selectedTab,
             navigate,
           }: {
    routeName: string;
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  }) => JSX.Element;
  circleWidth?:number;
  renderCircle: ({
                   selectedTab,
                   navigate,
                 }: {
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  }) => JSX.Element;
  borderTopLeftRight?: boolean;
  style?: StyleProp<ViewStyle>;
  updateSelectedTab : (name:string) => void
}

export type NavigatorBottomMenu = React.FC<MenuProps>