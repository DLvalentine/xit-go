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
  IonRow,
  IonCol,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { getPlatforms } from '@ionic/react';
import { folderOpenOutline, code, eye, download } from 'ionicons/icons';
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

// Utils (ts-ignore required for xit-parse for now)
// @ts-ignore
import * as xitParse from 'xit-parse';

setupIonicReact({
  platform: {
    /** The default `desktop` function returns false for devices with a touchscreen.
     * This is not always wanted, so this function tests the User Agent instead.
     **/
    desktop: (win) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
      return !isMobile;
    },
  },
});

// TODO -> docs
// TODO -> desktop keyboard shortcuts?
// TODO -> better handling for NEW files? (btn?)
const App: React.FC = () => {
  const [fileName, setFileName] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [fileRaw, setFileRaw] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  // TODO -> Error object/state for toast messages
  // TODO -> Autosave state for mobile/electron (default false)
  // TODO -> ^ related, timer for autosaving

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/visual">
              <Visual />
            </Route>
            <Route exact path="/raw">
              <Raw fileName={fileName} fileRaw={fileRaw} setFileRaw={setFileRaw} setFileObject={setFileObject} />
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
        <IonRow>
          <IonCol>
            <IonFabButton id="pick-file-btn" onClick={() => pickFileHandler(setFileName, setFilePath, setFileRaw, setFileObject)}>
              <IonIcon icon={folderOpenOutline} />
            </IonFabButton>
          </IonCol>
          <IonCol>
            {/* TODO -> disable save? How do we handle NEW files */}
            <IonFabButton id="save-file-btn" onClick={() => saveFileHandler(fileName || '', fileRaw || '')}>
              <IonIcon icon={download} />
            </IonFabButton>
          </IonCol>
        </IonRow>
      </IonFab>
    </IonApp>
  );
};

// TODO -> if autosave, set the timeout (in state for it too) to autosave while the file is open
// TODO -> usage of xitParse kinda sucks, should rename the default export to xitParse
// TODO -> docs
// TODO -> types, interfaces for things if needed
// NOTE/TODO -> For below, one of the other things to consider is the auto-save vs. manual save question... when/how/UI consideration. We aren't going to do
//              tabbed editing at first, so think "notepad" before we get to "notepad++" I think manual saving is fine... but it could be too ez to accidentally blow away changes.
//              See below for more.
// NOTE/TODO -> FileSystem API has some good stuff for web, not sure if we want to circle back and rewrite this or not.
const pickFileHandler = async (setFileName: Function, setFilePath: Function, setFileRaw: Function, setFileObject: Function) => {
  const platforms : Array<string> = getPlatforms();

  // Use Electron APIs for file i/o if platform is electron.
  if(platforms.includes('electron')) {
    // TODO -> implement when ready to work on Desktop
    // NOTE -> The below works fine for web/mobile, but web is going to need some extra help for file saving lol... saving is going to be a wild ride, too - for web we'll need to download instead of just.... save. ugh
    // TODO -> handle desktop differently for saving and all that
  } else {
    await FilePicker.pickFiles({ types: [], readData: true, multiple: true }).then((results: any) => {
      try {
        // Check file extension, if good, set filename
        if(!results?.files[0]?.name.includes('.xit')) throw 'Uploaded file is not *.xit format!';
        setFileName(results?.files[0]?.name.split('.xit')[0]);

        // Decode data and set path (if available), raw, and object
        const decodedData : string = atob(results?.files[0]?.data || null);

        setFilePath(results?.files[0]?.path || null); // TODO -> need more testing/verification on mobile
        setFileRaw(decodedData); // TODO -> need more testing/verification on mobile
        setFileObject(xitParse.default.toObject(decodedData)); // TODO -> need more testing/verification on mobile
      } catch (e) {
        // TODO -> Use/update error toast(s) when implemented
        console.error(`Unable to parse file, reason: ${e}`);
      }
    });
  }
};

const saveFileHandler = async (fileName: string, fileRaw: string) => {
  // TODO -> electron and mobile versions of this. For now just use filesystem API
  const options = {
    suggestedName: fileName,
    types: [
      {
        description: 'Xit files',
        accept: {
          'text/plain': ['.xit']
        }
      }
    ]
  };

  try {
    // ts-ignore needed for window global, unless we install types.
    //@ts-ignore
    const handle = await window.showSaveFilePicker(options);
    const writable = await handle.createWritable();
    await writable.write(fileRaw);
    await writable.close();
  } catch (e) {
    console.error(`Unable to save file, reason: ${e}`);
  }
};

export default App;
