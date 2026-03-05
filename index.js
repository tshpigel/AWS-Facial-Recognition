const canv = document.querySelector("canvas");
const ctx = canv.getContext('2d');
const e = document.querySelector("#res #elip");
const cool = document.querySelector("#res #an");
const pe = document.querySelector("#pe");

const AWSURL = 'https://ja5hc6egg5xnye36qt6zhvkbza0kdqkq.lambda-url.us-east-1.on.aws/';

const video = document.querySelector("video");
navigator.mediaDevices.getUserMedia({
    video: { width: 900, height: 506.25 }
}).then((mediaStream) => {
    video.srcObject = mediaStream;
    video.addEventListener("loadedmetadata", () => { video.play() });
}).catch(({name, message}) => console.error);

let inr = true;

document.body.addEventListener("keydown", async evt => {
    // if(evt.key === ' ' && !inr) document.querySelector('#err').style.display = 'inline-block';

    if(evt.key === ' ' && inr) {
        const v = document.querySelector("video");
        const tw = v.videoWidth;
        const th = v.videoHeight;
        canv.width = tw;
        canv.height = th;
        ctx.fillRect(0, 0, tw, th);
        ctx.drawImage(v, 0, 0, tw, th);
        v.style.backgroundImage = `url(${canv.toDataURL()})`;
        v.style.backgroundSize = 'cover';

        let s;
        inr = false;
        html2canvas(canv).then(c => {
            pe.textContent = '';
            cool.textContent = 'Analyzing';
            s = setInterval(() => {
                if(e.textContent.length < 3) e.textContent += '.';
                else e.textContent = '.';
            }, 400);
            c.style.display = 'none';
            document.body.appendChild(c);
            return c;
        }).then(async c => {
            const base64 = String(c.toDataURL()).slice(22);
            try {
                const data = await fetch(AWSURL, {
                    'method': 'POST',
                    'headers': {
                        "Origin": "origin"
                    },
                    'body': base64
                });

                const text = await data.text();

                console.log(text);
                // const dname = text.slice(10, -4);
        
                clearInterval(s);
                e.textContent = '';
                pe.textContent = 'Press \'Space\' to Analyze Face';
                cool.textContent = text !== 'Internal Server Error' ?
                    `Hello ${text.replace('-', ' ')}` : 
                    'Unable to detect face';
                
                inr = true;
            } catch(e) {
                console.error(e);
                cool.textContent = 'An error occurred';
            }
        });

        ctx.clearRect(0, 0, tw, th);
    }
});