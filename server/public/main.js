const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/capture`);
const button = document.querySelector('button');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

navigator.serviceWorker.ready.then(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" }, width: 1080, height: 600}})
    .then((stream) => {
        const video = document.createElement('video');

        let cropping = false;
        let willCropp = false;
        let started = false;
        
        let crop = localStorage.getItem('crop') ? JSON.parse(localStorage.getItem('crop')) : {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
        };
        
        button.addEventListener('click', () => {
            if (!started) {
                video.play();
                button.innerText = 'Recadrer';
                started = true;
                return
            }

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
        
        
        video.autoplay = true;
        video.srcObject = stream;
        video.onplay = () => {
            console.log('playing')
            setInterval(() => {
                if (cropping) return;
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                if (willCropp)
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                else
                    ctx.drawImage(video, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                    ws.send(blob, { type: 'image/jpeg' });
                })
            }, 100);
        };
    })
    .catch((error) => {
        console.error('Error accessing camera:', error);
    });
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}
