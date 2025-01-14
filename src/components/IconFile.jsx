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
    
      const fileExt = file.type.split("/")[1];
      return fileIcons[fileExt] || fileIcons.default;
}