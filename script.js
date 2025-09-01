let fileHandle;

// accepted files types
const acceptedFileTypes = [
    {
        description: 'Text and Code Files',
        accept: {
            'text/plain': ['.txt'],
            'text/csv': ['.csv'],
            'application/json': ['.json'],
            'text/html': ['.html'],
            'application/javascript': ['.js'],
            'text/css': ['.css']
        }
    }
];

const textarea = document.getElementById('textarea');
const saveBtn = document.getElementById('saveFile');
const saveAsBtn = document.getElementById('saveAsFile');

// Update buttons
function updateButtonStates() {
    if (textarea.value.trim().length > 0) {
        saveAsBtn.disabled = false;
        saveBtn.disabled = fileHandle ? false : true;
    } else {
        saveBtn.disabled = true;
        saveAsBtn.disabled = true;
    }
}

// Read file
async function button() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: acceptedFileTypes,
            excludeAcceptAllOption: true,
            multiple: false
        });

        const file = await fileHandle.getFile();
        const text = await file.text();
        textarea.value = text;
        updateButtonStates();
    } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
    }
}

// Save to current file
async function save() {
    if (!fileHandle) return;

    try {
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(textarea.value);
        await writableStream.close();
        alert('File saved successfully!');
    } catch (err) {
        console.error('Save failed:', err);
        alert('Failed to save file.');
    }
}

// Save As new file
async function saveAs() {
    try {
        fileHandle = await window.showSaveFilePicker({
            types: acceptedFileTypes,
            excludeAcceptAllOption: true
        });
        await save();
        updateButtonStates();
    } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
    }
}

textarea.addEventListener('input', updateButtonStates);

// Initial button states
updateButtonStates();
