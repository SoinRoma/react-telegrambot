import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

function TldrawComponent() {
  return (
    <div style={{position: 'fixed', inset: 0, marginTop: 50}}>
      <Tldraw/>
    </div>
  )
}

export default TldrawComponent