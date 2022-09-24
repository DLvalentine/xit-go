import { IonContent, IonPage, IonTextarea} from '@ionic/react';
import './raw.css';

// Utils (ts-ignore required for xit-parse for now)
// @ts-ignore
import * as xitParse from 'xit-parse';

const Raw: React.FC<any> = (props: {fileName: string, fileRaw: string, setFileRaw: Function, setFileObject: Function}) => {
  // TODO -> container formatting (I'd like to have it set in for example), margins
  // TODO -> Would be nice to have line numbers, code font, syntax highlighting, etc. -> might not be wise to use ionic textarea? Think on it after getting basics done
  return (
    <IonPage id="raw-editor" >
      <IonContent fullscreen>
        <h1>Raw Editor{props.fileName ? `: ${props.fileName}` : ''}</h1>
        <IonTextarea value={(props.fileName && props.fileRaw) ? props.fileRaw : 'Use the button at top-right to open an Xit file.'} 
                     disabled={!props.fileName}
                     autoGrow 
                     spellcheck
                     debounce={200}
                     onIonChange={(e) => handleIonChange(e, props.setFileRaw, props.setFileObject)}>
        </IonTextarea>
      </IonContent>
    </IonPage>
  );
};

const handleIonChange = (event: any, setFileRaw: Function, setFileObject: Function) => {
  const data = event.detail.value || '';
  setFileRaw(data);
  setFileObject(xitParse.default.toObject(data));
};

export default Raw;
