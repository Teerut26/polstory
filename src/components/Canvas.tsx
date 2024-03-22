import { useEffect, useRef } from "react"

interface Props {
    imageBase64?: string
}

export default function Canvas(props: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {

        const scale = 1 ?? 0.8
        const zoomFactor = 0.88;
        const baseFontSize = 35;
        const baseGap = 60 * scale
        const canvas_width = 1133 * scale
        const canvas_height = 2016 * scale
        const fontSize = baseFontSize * scale;

        const canvas = canvasRef.current
        if (!canvas?.getContext("2d")) {
            return
        }
        canvas.width = canvas_width
        canvas.height = canvas_height
        const context = canvas.getContext("2d")

        if (!context) {
            return
        }



        //Our first draw
        context.fillStyle = '#a12929'
        context.fillRect(0, 0, canvas_width, canvas_height)
        // context.drawImage()
    }, [])
    return (
        <canvas ref={canvasRef} className="w-full" />
    )
}