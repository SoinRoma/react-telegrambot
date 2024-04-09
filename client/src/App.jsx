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
          getDimensions: (width, height) => {
            const max = width > height ? width : height
            const scale = 512 / max
            return {width: width > height ? 512 : width * scale, height: height > width ? 512 : height * scale, scale}
          },
          exportPadding: 10,
        })
        const file = new File([blob], "name.png", {type: 'image/png'})
        const initData = window.Telegram.WebApp.initData
        const formData = new FormData()
        formData.append('file', file)
        formData.append('initData', initData)
        await fetch('https://stickerpainterbot.altek.uz/sticker/create/', {
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
        <Excalidraw  langCode="ru-RU" excalidrawAPI={(api)=> setExcalidrawAPI(api)}>
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
