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


function decodeOnce(codeReader, selectedDeviceId) {
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'previewQr').then((result) => {
        console.log(result);
        return result;
    })
        .finally(() => {
            codeReader.scannerEnabled = false;
            stopStreamedVideo(document.getElementById('previewQr'));
        })
        .catch((err) => {
        console.error(err)
        //document.getElementById('result').textContent = err
    })
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