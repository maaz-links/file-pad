//Some functions are mostly used during axios onUploadProgress event to calculate data to display
//Or they are used to convert data into particular format

//Get actual expirydate after increment in ISOstring, converted into unix in backend
export function formatDate(min) {
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + min);
    return futureDate.toISOString();
}

export const calculateSpeedAndTime = (loaded, total, startTime) => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    const speed = (loaded / elapsed / 1024).toFixed(2); // KB/s
    const remaining = ((total - loaded) / (loaded / elapsed)).toFixed(2); // seconds
    return { speed, remaining };
};

export const calculateAverageSpeed = (data) => {
    if (!data.length) return 0;
    const totalSpeed = data.reduce((sum, item) => sum + parseFloat(item.speed), 0);
    console.log('speeder', totalSpeed / data.length); //log
    return totalSpeed / data.length;
};
export const calculateTotalRemainingTime = (data) => {
    if (!data.length) return 0;
    const maxTime = data.reduce((max, item) => {
        const time = parseFloat(item.remaining);
        return time > max ? time : max;
    }, 0);
    return maxTime;
};

export const hhmmss = (seconds) => {
    seconds = parseInt(seconds);
    const hours = Math.floor(seconds / 3600); // Get total hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get total minutes
    const remainingSeconds = seconds % 60; // Get remaining seconds

    // Format the output as hh:mm:ss,
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

//For UID, unused
export function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export const calculateLoadedFiles = (data) => {
    const values = Object.values(data);
    if (!values.length) return 0;
    const totalLoaded = values.reduce((sum, item) => sum + item.loaded, 0);
    return totalLoaded;
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

