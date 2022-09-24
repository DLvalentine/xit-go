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

// Utils (ts-ignore required for some)
// @ts-ignore
import * as xitParse from 'xit-parse';


/**
 * If/when you need to do platform determination, you can use the following (after importing):
 * const platforms : Array<string> = getPlatforms();
 * and then check to see if platforms includes the platform you need to look for.
 * This will be used in some UI stuff and MAYBE some file i/o stuff
 */
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
// TODO -> web/desktop keyboard shortcuts?
// TODO -> Since we're using TS, might as well check types
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
// NOTE/TODO -> For below, one of the other things to consider is the auto-save vs. manual save question... when/how/UI consideration. We aren't going to do
//              tabbed editing at first, so think "notepad" before we get to "notepad++" I think manual saving is fine... but it could be too ez to accidentally blow away changes.
//              See below for more.
/**
 * Status
 * [X] Web
 * [ ] Desktop
 * [X] Mobile
 * [ ] Docs/Types
 */
const pickFileHandler = async (setFileName: Function, setFilePath: Function, setFileRaw: Function, setFileObject: Function) => {
  await FilePicker.pickFiles({ types: [], readData: true, multiple: true }).then((results: any) => {
    try {
      // Check file extension, if good, set filename
      if(!results?.files[0]?.name.includes('.xit')) throw 'Uploaded file is not *.xit format!';
      setFileName(results?.files[0]?.name.split('.xit')[0]);

      // Decode data and set path (if available), raw, and object
      const decodedData : string = atob(results?.files[0]?.data);

      setFilePath(results?.files[0]?.path || null);
      setFileRaw(decodedData);
      setFileObject(xitParse.default.toObject(decodedData));
    } catch (e) {
      // TODO -> Use/update error toast(s) when implemented
      console.error(`Unable to parse file, reason: ${e}`);
    }
  });
};

/**
 * Status
 * [X] Web
 * [ ] Desktop
 * [ ] Mobile
 * [ ] Docs/Types
 */
const saveFileHandler = async (fileName: string, fileRaw: string) => {
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
    // TODO -> Use/update error toast(s) when implemented
    console.error(`Unable to save file, reason: ${e}`);
  }
};

export default App;
