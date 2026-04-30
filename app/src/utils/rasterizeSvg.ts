export async function rasterizeSvg(svgEl: SVGSVGElement): Promise<string> {
  const { width, height } = svgEl.getBoundingClientRect()
  const scale = 2

  const svgString = new XMLSerializer().serializeToString(svgEl)
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
  const blobUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext("2d")!
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(blobUrl)
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(blobUrl)
      reject(e)
    }
    img.src = blobUrl
  })
}