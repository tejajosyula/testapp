var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    video = document.querySelector('#webcam'),
    button = document.getElementById('camera--trigger'),
    cameraOutput = document.querySelector('#camera--output');
function cameraStart(){
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
            video.play();
          })
          .catch(function (err0r) {
            console.log("Something went wrong!");
          });
          video.addEventListener('loadeddata',function(){
              draw(this,context,640,480);
          },false);
      }
      async function draw(video,context, width, height){
        context.drawImage(video,0,0,width,height);
        const model = await blazeface.load();
        const returnTensors = false;
        const predictions = await model.estimateFaces(video, returnTensors);
        if (predictions.length > 0){
            //console.log(predictions);
            for (let i=0; i<predictions.length; i++){
                const start = predictions[i].topLeft;
                const end = predictions[i].bottomRight;
                var probability = predictions[i].probability;
                const size = [end[0] - start[0], end[1] - start[1]];
                context.beginPath();
                context.strokeStyle = "green";
                context.lineWidth = "4";
                context.rect(start[0], start[1],size[0], size[1]);
                context.stroke();
                var prob = (probability[0]*100).toPrecision(5).toString();
                var text = prob+"%";
                context.fillStyle = "red";
                context.font = "13pt sans-serif";
                context.fillText(text,start[0]+5,start[1]+20);
            }
        }
        setTimeout(draw,1000,video,context,width,height);
    }
    button.onclick = function() {
        //console.log("labdababababa");
        context.drawImage(video,0,0)
        cameraOutput.src = canvas.toDataURL("image/webp");
        cameraOutput.classList.add("taken");
        const img = document.getElementById('camera--output');
        cocoSsd.load().then(model => {
        model.detect(img).then(predictions => {
      console.log('Predictions: ', predictions);
    });
  });
};
}
cameraStart();