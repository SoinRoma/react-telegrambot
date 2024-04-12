import {Excalidraw, MainMenu, exportToBlob } from "@excalidraw/excalidraw"
import {useEffect, useState} from "react"

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
        const response = await fetch('https://stickerpainterbot.altek.uz/sticker/create/', {
          method: 'POST',
          body: formData,
        })
        if (response.ok) {
          try {
            window.Telegram.WebApp.close()
          } catch (e) {
          }
        }
      }
    }
  }

  useEffect(()=>{
    const tg = window.Telegram.WebApp //получаем объект webapp телеграма

    tg.expand() //расширяем на все окно

    tg.MainButton.text = "Save"; //изменяем текст кнопки
    tg.MainButton.textColor = "#FFFFFF"; //изменяем цвет текста кнопки
    tg.MainButton.color = "#70b1ec"; //изменяем цвет бэкграунда кнопки
    tg.MainButton.show()

    window.Telegram.WebApp.onEvent('mainButtonClicked', function(){
      saveSticker()
    });
  }, [])

  return (
    <>
      <div style={{height: "97vh"}}>
        <Excalidraw langCode="ru-RU" excalidrawAPI={(api)=> setExcalidrawAPI(api)} >
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
