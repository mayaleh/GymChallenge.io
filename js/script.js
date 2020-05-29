window.saveAsFile = (filename, bytesBase64) => {
    var link = document.createElement('a');
    link.download = filename;
    link.href = "data:application/octet-stream;base64," + bytesBase64;
    document.body.appendChild(link); // Needed for Firefox
    link.click();
    document.body.removeChild(link);
};

window.scanQrCode = () => {
    codeReader = new ZXing.BrowserQRCodeReader();
    return codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            return decodeOnce(codeReader, videoInputDevices[0].deviceId).then(res => { return res; });
        });
};


window.generateQrCode = (input) => {
    console.log("generateQrCode", input);
    const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
    // you can get a SVG element.
    const svgElement = codeWriter.write(input, 300, 300);
    // or render it directly to DOM.
    codeWriter.writeToDom('#qrCodeResult', input, 300, 300);
};


window.toggleCol = (id) => {
    console.log("toggle col fired", id);
    let elements = document.getElementsByClassName("exercisegr-" + id);
    console.log(elements);
    for (let item of elements) {
        console.log(item.id);
    }

};

function decodeOnce(codeReader, selectedDeviceId) {
    return codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'previewQr')
        .then((result, err) => {
            console.log(result);

            codeReader.scannerEnabled = false;
            stopStreamedVideo(document.getElementById('previewQr'));

            return result.text;
        });
        //.finally(() => {
        //    codeReader.scannerEnabled = false;
        //    stopStreamedVideo(document.getElementById('previewQr'));
        //}).catch((err) => {
        //    console.error(err)
        //    //document.getElementById('result').textContent = err
        //});
}


function decodeContinuously(codeReader, selectedDeviceId) {
    codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'previewQr', (result, err) => {
        if (result) {
            // properly decoded qr code
            console.log('Found QR code!', result)
            //document.getElementById('result').textContent = result.text
        }

        if (err) {
            // As long as this error belongs into one of the following categories
            // the code reader is going to continue as excepted. Any other error
            // will stop the decoding loop.
            //
            // Excepted Exceptions:
            //
            //  - NotFoundException
            //  - ChecksumException
            //  - FormatException

            if (err instanceof ZXing.NotFoundException) {
                console.log('No QR code found.')
            }

            if (err instanceof ZXing.ChecksumException) {
                console.log('A code was found, but it\'s read value was not valid.')
            }

            if (err instanceof ZXing.FormatException) {
                console.log('A code was found, but it was in a invalid format.')
            }
        }
    })
}


function stopStreamedVideo(videoElem) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
        track.stop();
    });

    videoElem.srcObject = null;
}

$(document).ready(() => {

    $("#menu-toggle").on("click", (e) => {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});
