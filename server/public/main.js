const ws = new WebSocket(`ws://${window.location.host}/capture`);
const button = document.querySelector('button');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    let cropping = false;
    let willCropp = false;

    let crop = localStorage.getItem('crop') ? JSON.parse(localStorage.getItem('crop')) : {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    };

    button.addEventListener('click', () => {
      if (willCropp) return;
      willCropp = true;
      setTimeout(() => {
        alert('Photo nécessaire, veuillez placer le téléphone dans le socle. La photo sera prise 5s après votre confirmation.');

        setTimeout(() => {
          cropping = true;

          const cropper = new Cropper(canvas, {
            aspectRatio: 16 / 9,
            crop(event) {
              crop = event.detail;
            }
          })
  
          alert('Veuillez recadrer l\'image et rappuyer sur le bouton');
  
          const listener = button.addEventListener('click', () => {
            localStorage.setItem('crop', JSON.stringify(crop));
            button.removeEventListener('click', listener);
            cropper.destroy();
            location.reload();
          });
        }, 5000);
      });
    });
  
    function captureFrame() {
      if (cropping) return;

      imageCapture.grabFrame()
        .then((/** @type {ImageBitmap} */ imageBitmap) => {
          canvas.width = 1080;
          canvas.height = 720;
          if (willCropp)
            ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
          else
            ctx.drawImage(imageBitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            ws.send(blob);
          }, 'image/jpeg');

          // Repeat the frame capture process
          setTimeout(() => requestAnimationFrame(captureFrame), 100);
        })
        .catch((error) => {
          console.error('Error capturing frame:', error);
        });
    }

    // Start capturing frames
    captureFrame();
  })
  .catch((error) => {
    console.error('Error accessing camera:', error);
  });
