import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Appbar, BottomNavigation, Provider as PaperProvider } from 'react-native-paper';

import { name as appName } from './app.json';
import VisualEditor from './views/VisualEditor';
import RawEditor from './views/RawEditor';

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'visual', title: 'Visual Editor', focusedIcon: 'eye', unfocusedIcon: 'eye-outline'},
    {key: 'raw', title: 'Raw Editor', focusedIcon: 'code-json', unfocusedIcon: 'code-braces'}
  ]);

  const renderScene = BottomNavigation.SceneMap({
    visual: () => <VisualEditor/>,
    raw: () => <RawEditor/>
  });

  return (
    <PaperProvider>
      <Appbar.Header style={{flexDirection: 'row-reverse'}}>
        <Appbar.Action icon="content-save" disabled onPress={() => {}} />
        <Appbar.Action icon="pencil-plus" onPress={() => {}} />
        <Appbar.Action icon="folder-open" onPress={() => {
          // TODO - figure out filesystem and implement this first before others...
        }} />
      </Appbar.Header>
      <BottomNavigation navigationState={{index, routes}} onIndexChange={setIndex} renderScene={renderScene}/>
    </PaperProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
