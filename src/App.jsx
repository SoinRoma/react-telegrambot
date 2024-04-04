import {Excalidraw, MainMenu, exportToBlob } from "@excalidraw/excalidraw"
import {useState} from "react"

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)

  async function saveSticker() {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements()
      if (elements || elements.length) {
        const blob = await exportToBlob({
          elements,
          appState: {
            exportWithDarkMode: false,
            exportBackground: false,
          },
          files: excalidrawAPI.getFiles(),
          getDimensions: (width, height) => { return {width: width, height: height}},
          exportPadding: 5,
        })
        const file = new File([blob], "name.png", {type: 'image/png'})
        const formData = new FormData()
        formData.append('file', file)
        await fetch('https://3a20-84-54-115-9.ngrok-free.app/sticker/create/', {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        })
      }
    }
  }

  return (
    <>
      <div style={{height: "97vh"}}>
        <Excalidraw langCode="ru-RU" excalidrawAPI={(api)=> setExcalidrawAPI(api)}>
          <MainMenu>
            <MainMenu.Item onSelect={() => saveSticker()}>Сохранить стикер</MainMenu.Item>
            <MainMenu.DefaultItems.ClearCanvas/>
            <MainMenu.DefaultItems.ChangeCanvasBackground/>
          </MainMenu>
        </Excalidraw>
      </div>
    </>
  );
}

export default App
