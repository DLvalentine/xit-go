// React + Ionic + Capacitor imports
import { Redirect, Route } from 'react-router-dom';
import { useState } from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonFab, 
  IonFabButton,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { add, code, eye } from 'ionicons/icons';
import { FilePicker } from '@capawesome/capacitor-file-picker';

// Pages/Components
import Visual from './pages/visual/Visual';
import Raw from './pages/raw/Raw';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Utils (ts-ignore required for some)
// @ts-ignore
import * as xitParse from 'xit-parse';

setupIonicReact();

/**
 * TODO -> 
 *   1. FAB, start simple with just the local filesystem file load.
 *   2. On file load, parse xit into object, save both raw and object representation into state (useState)
 */
const App: React.FC = () => {
  const [fileRaw, setFileRaw] = useState('');
  const [fileObject, setFileObject] = useState({});

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/visual">
              <Visual />
            </Route>
            <Route exact path="/raw">
              <Raw />
            </Route>
            <Route exact path="/">
              <Redirect to="/visual" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="visual" href="/visual">
              <IonIcon icon={eye} />
              <IonLabel>Visual Editor</IonLabel>
            </IonTabButton>
            <IonTabButton tab="raw" href="/raw">
              <IonIcon icon={code} />
              <IonLabel>Raw Editor</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => pickFile(setFileRaw, setFileObject)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </IonApp>
  );
};

// TODO -> rename(?), improve with filtering, etc.
// TODO -> file type filter not going to work since it only supports IANA media type, so we'll need to roll our own and verify
// TODO -> types?
// TODO -> usage of xitParse kinda sucks, should rename the default export to xitParse
const pickFile = async (setFileRaw: Function, setFileObject: Function) => {
  await FilePicker.pickFiles({readData: true}).then((results: any) => {
    const decodedData = atob(results?.files[0]?.data);
    setFileRaw(decodedData);
    setFileObject(xitParse.default.toObject(decodedData));
  });
};

export default App;