const video = document.querySelector('video');
const recordBtn = document.querySelector('.record-btn');
const videosContainer = document.getElementById('videos');

let recorder;
let chunks = [];
let recordingFlag = false;

const constraints = {
    audio: true,
    video: true
};

// Access the camera and microphone
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);

        recorder.addEventListener('start', () => {
            chunks = [];
        });

        recorder.addEventListener('dataavailable', (event) => {
            chunks.push(event.data);
        });

        recorder.addEventListener('stop', () => {
            const blob = new Blob(chunks, {
                type: 'video/mp4'
            });
            const videoURL = URL.createObjectURL(blob);

            // Create a new video card
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');

            // Video element
            const videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.controls = true;

            // Details (Duration Placeholder)
            const details = document.createElement('div');
            details.classList.add('details');
            const title = document.createElement('p');
            title.innerText = `Recorded Video`;
            const duration = document.createElement('p');
            duration.innerText = `Duration: Calculating...`;

            videoElement.onloadedmetadata = () => {
                duration.innerText = `Duration: ${videoElement.duration.toFixed(2)} seconds`;
            };

            details.appendChild(title);
            details.appendChild(duration);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerText = 'Delete';
            deleteBtn.addEventListener('click', () => {
                videosContainer.removeChild(videoCard);
            });

            // Append elements to video card
            videoCard.appendChild(videoElement);
            videoCard.appendChild(details);
            videoCard.appendChild(deleteBtn);

            // Add video card to videos container
            videosContainer.appendChild(videoCard);
        });
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
    });

// Toggle recording
recordBtn.addEventListener('click', () => {
    if (!recorder) return;

    recordingFlag = !recordingFlag;

    if (recordingFlag) {
        recorder.start();
        recordBtn.innerText = 'Stop Recording';
    } else {
        recorder.stop();
        recordBtn.innerText = 'Start Recording';
    }
});