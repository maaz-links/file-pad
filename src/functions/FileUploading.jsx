const handleSubmit = async () => {
    try {
        var currentuid = currentUID;
        const uploadFiles = async () => {
            const promises = [];  //to track for redirect
            files.forEach((file, index) => {
                const formData = new FormData();
                formData.append("filesupload", file);
                // formData.append('expiry_date', newDateFormatted);
                formData.append('file_burn_after_read', burnAfterRead);
                formData.append('uid', currentuid);
                // formData.append('ip', mirror[1]);

                const uploadPromise = axios
                    .post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then(() => {
                        //setResponseMessage('Files uploaded successfully!');
                        console.log(`${file.name} uploaded successfully.`);
                    })
                    .catch((err) => {
                        // Handle error response
                        //setResponseMessage('Error uploading files. Please try again.');
                        console.error(err);
                        console.error(`Error uploading ${file.name}:`, err);
                    })
                    .finally(() => {
                        //setIsSubmitting(false);
                        //setUploadModal(false)
                    });
                promises.push(uploadPromise);
            });
            Promise.all(promises)
                .then(() => {
                    // If All files uploaded successfully
                    Navigate('/preview'); // Redirect to /preview
                })
                .catch(() => {
                    // Handle any errors, for example file upload failed
                    //setResponseMessage('Error uploading some files. Please try again.');
                });
        };

        await uploadFiles();
    } catch (error) {
        console.error("Initial axios call failed:", error);
        //setResponseMessage("Error in initial setup. File upload canceled.");
    }
};