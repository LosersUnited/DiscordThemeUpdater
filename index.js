window.onload = () => {
    fetch('./classes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(classMappings => {
            console.log('Class Mappings:', classMappings);

            document.getElementById('file-input').addEventListener('change', function(e) {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                    const fileReader = new FileReader();
                    fileReader.onload = function(event) {
                        let fileContents = event.target.result;

                        const changes = [];
                        classMappings.forEach(mapping => {
                            for (const oldClass in mapping) {
                                if (mapping.hasOwnProperty(oldClass)) {
                                    const newClass = mapping[oldClass];
                                    const regex = new RegExp(`\\s\\.${escapeRegExp(oldClass)}(?=[\\s,:{])`, 'g');
                                    const count = (fileContents.match(regex) || []).length;
                                    if (count > 0) {
                                        changes.push({
                                            oldClass,
                                            newClass,
                                            count
                                        });
                                    }
                                    fileContents = fileContents.replace(regex, ` ${newClass}`);
                                }
                            }
                        });

                        console.log('Changes Made:');
                        changes.forEach(change => {
                            console.log(`Replaced "${change.oldClass}" with "${change.newClass}" ${change.count} times.`);
                        });

                        console.log('Modified File Contents:', fileContents);

                        const modifiedBlob = new Blob([fileContents], { type: 'text/plain' });

                        const downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(modifiedBlob);
                        downloadLink.download = 'Modified.theme.css';
                        downloadLink.click();
                    };
                    fileReader.readAsText(selectedFile);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing class mappings:', error);
        });
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
