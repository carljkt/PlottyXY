let buttonCopyCoords = ''

function copyToText(coords) {
    // Get the text field
    const [northCoords, eastCoords] = coords

    const parsedCoords = northCoords.map((north, index) => {
        return [north, eastCoords[index]]
    })

    const textCoords = parsedCoords.map(coordinates => {
        return `${coordinates[0]}\t${coordinates[1]}`
    }).join('\n')

    buttonCopyCoords = textCoords

    // Copy the text inside the text field
    navigator.clipboard.writeText(textCoords);
}

document.getElementById('copy').addEventListener('click', () => {

    navigator.clipboard.writeText(buttonCopyCoords);

    Notification('Success', `Copied coords to clipboard`, 'good')
})

document.getElementById('paste').addEventListener('click', async () => {
    let pasteArea = document.getElementById('pasteArea')
    pasteArea.value = '';

    const text = await navigator.clipboard.readText()
    console.log(text)

    pasteArea.value = text;

    // Text to Coords Array
    const coordsArray = getCoordinatesFromText(text)
    // Coords Array to Table
    if (coordsArray.length) {
        // Build Table
        buildTable(coordsArray)
    }
})


const area = document.getElementById('pasteArea');
if (area.addEventListener) {
    area.addEventListener('input', function () {
        console.log(area.value)
        // event handling code for sane browsers
        // Text to Coords Array
        const coordsArray = getCoordinatesFromText(area.value)
        // Coords Array to Table

        if (coordsArray?.length) {
            // Build Table
            buildTable(coordsArray)
        }
    }, false);
} else if (area.attachEvent) {
    area.attachEvent('onpropertychange', function () {
        // IE-specific event handling code
        const coordsArray = getCoordinatesFromText(area.value)
        // Coords Array to Table
        if (coordsArray.length) {
            // Build Table
            buildTable(coordsArray)
        }
    });
}


function getCoordinatesFromText(text) {


    const northCoords = [...text.matchAll(/Y\=.\d*\.?\d+/g)].map(v => Math.round(parseFloat(v[0].split('=')[1])))
    const eastCoords = [...text.matchAll(/X\=.\d*\.?\d+/g)].map(v => Math.round(parseFloat(v[0].split('=')[1])))



    if (!northCoords.length && !eastCoords.length) return

    console.log([northCoords, eastCoords])

    return [northCoords, eastCoords]
};

function textToJSON(text) {
    const lines = text.trim().split('\n');
    const headers = lines.shift().split('\t');
    const jsonData = lines.map((line) => {
        const values = line.split('\t');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = parseFloat(values[index].trim());
        });
        return entry;
    });

    return jsonData;
}

function validate(input) {
    const [northCoords, eastCoords] = getCoordinatesFromText(input)

    if (!northCoords.length && !eastCoords.length) return false

    return true
}

function buildTable(coords) {
    copyToText(coords)
    const table = document.getElementById('coordsTable')
    table.innerHTML = ''

    for (let i = 0; i < coords[0].length; i++) {
        const row = `<tr>
                        <td>${i + 1}</td>
				        <td>${coords[0][i]}</td>
				        <td>${coords[1][i]}</td>
				    </tr >`

        table.innerHTML += row
    }

    Notification('Success', `Copied ${coords[0].length} coords to clipboard`, 'good')
}