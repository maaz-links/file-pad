import pngIcon from '/src/assets/img/png-icon-small.png';
import zipIcon from '/src/assets/img/zip-icon.png';
import songIcon from '/src/assets/img/song-icon.png';
import videoIcon from '/src/assets/img/icon-video.png';
import docIcon from '/src/assets/img/icon-doc.png';
import pptIcon from '/src/assets/img/icon-ppt.png';
import txtIcon from '/src/assets/img/icon-txt.png';
import xlsIcon from '/src/assets/img/icon-xls.png';
import csvIcon from '/src/assets/img/icon-csv.png';
import pdfIcon from '/src/assets/img/icon-pdf.png';
import genericIcon from '/src/assets/img/icon-generic.png';

export const IconFile = (file) => {
  const fileIcons = {
    png: pngIcon,
    jpg: pngIcon,
    jpeg: pngIcon,
    gif: pngIcon,

    zip: zipIcon,
    mp3: songIcon,

    mp4: videoIcon,
    mkv: videoIcon,
    avi: videoIcon,
    mov: videoIcon,
    webm: videoIcon,

    doc: docIcon,
    docx: docIcon,
    ppt: pptIcon,
    pptx: pptIcon,
    txt: txtIcon,
    xls: xlsIcon,
    xlsx: xlsIcon,
    csv: csvIcon,
    pdf: pdfIcon,

    default: genericIcon // Placeholder for other files
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