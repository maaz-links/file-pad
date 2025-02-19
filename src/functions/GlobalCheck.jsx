export const sizeValidation = (files,size) => {

    const MAX_SIZE = size;
    const validFiles = [];
    const badFiles = [];

    for (let i = 0; i < files.length; i++) {
        if (files[i].size <= MAX_SIZE) {
            validFiles.push(files[i]);
        }
        else {
            badFiles.push(files[i]);
            // try {
            //     toast.error(`Error uploading ${files[i].name}: The file size cannot exceed more than ${formatBytes(MAX_SIZE,0)}`, {
            //         position: "top-right",
            //         autoClose: 5000,
            //         hideProgressBar: true,
            //         closeOnClick: false,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         theme: "dark",
            //     });
            //     console.log('danger called');
            // } catch (err) {
            //     console.error('wat happun', err);
            // }
        }
    }
    return [validFiles,badFiles];
}