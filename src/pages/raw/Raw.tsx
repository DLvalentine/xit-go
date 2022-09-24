import { IonContent, IonPage, IonTextarea} from '@ionic/react';
import './raw.css';

// Utils (ts-ignore required for some)
// @ts-ignore
import * as xitParse from 'xit-parse';

/**
 * Status
 * [X] Web
 * [ ] Desktop
 * [X] Mobile
 * [ ] Docs/Types
 */

const Raw: React.FC<any> = (props: {fileName: string, fileRaw: string, setFileRaw: Function, setFileObject: Function}) => {
  // TODO -> Syntax highlighting would be really nice, but I'd have to hand-roll it, and it might not be compatible with textarea...
  // NOTE -> If I end up doing syntax highlighting, it might be best to replace IonTextarea with CodeMirror https://codemirror.net/
  return (
    <IonPage id="raw-editor-page" >
      <IonContent fullscreen>
        <h1>Raw Editor{props.fileName ? `: ${props.fileName.charAt(0).toUpperCase() + props.fileName.slice(1)}` : ''}</h1>
        <IonTextarea id="raw-editor" value={props.fileName ? props.fileRaw : 'Use the folder button at top-right to open an Xit file.'} 
                     disabled={!props.fileName}
                     style={props.fileName ? {'--background': 'gainsboro', fontFamily: 'consolas', boxShadow: '4px 3px 2px grey', border: '1px solid grey'} : {}}
                     autoGrow 
                     spellcheck
                     debounce={200}
                     onKeyDown={(e) => handleKeyDown(e)}
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

const handleKeyDown = (event: any) => {
  if(event.code === 'Tab') {
    event.preventDefault();
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    event.target.value = event.target.value.substring(0, start) + '    ' + event.target.value.substring(end); // PSYCHE! We're using spaces. Four of em.
    event.target.setSelectionRange(end + 4, end + 4);
  }
};

export default Raw;
