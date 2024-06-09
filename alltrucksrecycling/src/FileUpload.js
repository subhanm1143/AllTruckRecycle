import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);

    // Function to handle file selection
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle file upload
    const onFileUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                // Upload the file to the server
                const response = await axios.post('https://alltruckrecycle.onrender.com/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('File uploaded successfully:', response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle error
            }
        }
    };

    // Function to display file details
    const fileData = () => {
        if (selectedFile) {
            return (
                <div>
                    <p>File Name: {selectedFile.name}</p>
                    <p>File Type: {selectedFile.type}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose a file before pressing the Upload button</h4>
                </div>
            );
        }
    };

    return (
        <div>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>Upload!</button>
            </div>
            {fileData()}
        </div>
    );
}

export default FileUpload;
