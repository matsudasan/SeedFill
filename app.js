const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
const buff = []
const black = [0, 0, 0, 255]
const white = [255, 255, 255, 255]
let x, y
Start = (e) => {
  x = e.offsetX
  y = e.offsetY

  buff.push({ x, y })
  while (buff.length > 0) {
    const point = buff.pop()
    //console.log(point)
    Paint(point.x, point.y)
  }
}

Color = (x, y) => {
  const data = []
  const imagedata = ctx.getImageData(x, y, 1, 1)
  data[0] = imagedata.data[0]
  data[1] = imagedata.data[1]
  data[2] = imagedata.data[2]
  data[3] = imagedata.data[3]
  return data
}

Paint = (x, y) => {
  //console.log(x,y)
  const color = Color(x, y)
  if (JSON.stringify(color) !== JSON.stringify(white)) {
    //console.log(JSON.stringify(color))
    return
  }

  //console.log(x, y)
  //console.log(color)

  let leftX = x - 1
  while (leftX >= 0) { //左側を探索
    if (JSON.stringify(Color(leftX - 1, y)) !== JSON.stringify(white)) {
      break
    }
    leftX--
  }

  let rightX = x
  while (rightX < canvas.width) { //右側を探索
    if (JSON.stringify(Color(rightX + 1, y)) !== JSON.stringify(white)) {
      break
    }
    rightX++
  }

  //console.log(leftX,rightX)

  const imagedata = ctx.getImageData(0,0,canvas.width,canvas.height)
  for(let i=leftX; i<=rightX; i++){
    //const imagedata = ctx.getImageData(i, y, 1, 1)
    const index = (i + y * imagedata.width) * 4
    imagedata.data[index]=0
    imagedata.data[index+1]=0
    imagedata.data[index+2]=0
    imagedata.data[index+3]=255
    //ctx.putImageData(imagedata, i, y)
    //ctx.putImageData(imagedata,1,1)
  }
  ctx.putImageData(imagedata,0,0)



  if (y - 1 >= 0) { //下のラインを探索
    Scanline(leftX, rightX, y - 1)
  }

  if (y + 1 < canvas.width) {//上のラインを探索
    Scanline(leftX, rightX, y + 1)
  }
}

Scanline = (leftX, rightX, y) => {
  for (let i = leftX; i < rightX; i++) {
    if (JSON.stringify(Color(i, y)) !== JSON.stringify(white)) {
      continue
    }

    if (rightX < leftX) {
      continue
    }

    buff.push({ x: i - 1, y: y })
  }
}

//canvasの初期化
ctx.fillStyle = "white"
ctx.fillRect(0, 0, canvas.width, canvas.height)

/*ctx.strokeStyle = "blue"
ctx.strokeRect(50, 50, 150, 100)
*/

ctx.moveTo(10, 50)
ctx.lineTo(40, 30)
ctx.lineTo(40, 70)
ctx.closePath()
ctx.stroke()

console.log(ctx.getImageData(49, 100, 10, 1))
console.log(ctx.getImageData(50, 100, 1, 1))

canvas.addEventListener('click', Start)