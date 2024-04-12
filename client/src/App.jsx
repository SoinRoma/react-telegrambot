import {Excalidraw, MainMenu, exportToBlob } from "@excalidraw/excalidraw"
import {useEffect, useState} from "react"
import './index.css'

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)

  async function saveSticker(excalidrawAPI) {
    console.log(excalidrawAPI)
    if (excalidrawAPI) {
      console.log('Есть excalidrawAPI')
      const elements = excalidrawAPI.getSceneElements()
      if (elements || elements.length) {
        console.log('Есть elements')
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
        console.log('До отправки!')
        const response = await fetch('https://stickerpainterbot.altek.uz/sticker/create/', {
          method: 'POST',
          body: formData,
        })
        if (response.ok) {
          try {
            console.log('После отправки')
            window.Telegram.WebApp.close()
          } catch (e) {
            console.log('Ошибка')
            console.log(e)
          }
        }
      }
    }
  }

  useEffect(()=>{
    const tg = window.Telegram.WebApp //получаем объект webapp телеграма

    tg.expand() //расширяем на все окно

    tg.MainButton.text = "Save"//изменяем текст кнопки
    tg.MainButton.textColor = "#FFFFFF" //изменяем цвет текста кнопки
    tg.MainButton.color = "#70b1ec" //изменяем цвет бэкграунда кнопки
    tg.MainButton.show()

    window.Telegram.WebApp.onEvent('mainButtonClicked', function(){
      tg.MainButton.showProgress(true)
      saveSticker(excalidrawAPI)
    })
  }, [])

  return (
    <>
      <div className="your-app">
        <Excalidraw langCode="ru-RU" excalidrawAPI={(api)=> setExcalidrawAPI(api)} >
          <MainMenu>
            <MainMenu.Item onSelect={() => saveSticker(excalidrawAPI)}>Сохранить стикер</MainMenu.Item>
            <MainMenu.DefaultItems.ClearCanvas/>
            <MainMenu.DefaultItems.ChangeCanvasBackground/>
          </MainMenu>
        </Excalidraw>
      </div>
    </>
  );
}

export default App
