export const IconFile = (file) => {
    const fileIcons = {
        //by ext
        png: "/src/assets/img/png-icon-small.png",
        zip: "/src/assets/img/zip-icon.png",
        mp4: "/src/assets/img/song-icon.png",
        pdf: "/src/assets/img/icon-pdf.png",  
        default: "/src/assets/img/icon-generic.png" // Placeholder for other files
      };
      // Icon size must be small like 42x42, otherwise it will mess with flex containers
    
      const getFileExtension = (file) => {
        if (file instanceof File) {
          // If it's a file object, get the extension from file.type
          return file.type.split("/")[1];
        } else if (typeof file === "string") {
          // If it's a file path (string), extract the extension from the path
          const fileName = file.split("/").pop(); // Get the file name from path
          const ext = fileName.split(".").pop(); // Get the extension
          return ext;
        }
        return null; // If file is neither a File object nor a string path
      };
    
      const fileExt = getFileExtension(file);
      return fileIcons[fileExt] || fileIcons.default;

      // const fileExt = file.type.split("/")[1];
      // return fileIcons[fileExt] || fileIcons.default;
}