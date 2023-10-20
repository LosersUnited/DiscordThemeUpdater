window.onload = async () => {
    document.getElementById('file-input').addEventListener('change', function(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            console.log('Stealing file...');
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                const fileContents = event.target.result;
                console.log('File Contents:', fileContents);
            };
            fileReader.readAsText(selectedFile);
        }
    });

    await fetch('./classes.json')
        .then(response => response.json())
        .then(data => {
            console.log('JSON Data:', data);
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON:', error);
        });
};
