import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col, Container, Row } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Editor from '../components/Editor'
import song_icon from '../assets/img/song-icon.png'
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

export default function CreatePad() {

  const { burnAfterRead, expiryDateIncrement, mirror } = useOutletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [files, setFiles] = useState([]);

  //new
  const [progress, setProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [totalRemainingTime, setTotalRemainingTime] = useState(0);
  const [uploadDetails, setUploadDetails] = useState([]);
  //new

  const infoCards = [
    {
      icon: (<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.360352 3.8137C0.360352 2.8538 0.765502 1.93322 1.48668 1.25447C2.20785 0.575715 3.18597 0.194397 4.20586 0.194397H21.1261C22.146 0.194397 23.1241 0.575715 23.8453 1.25447C24.5665 1.93322 24.9716 2.8538 24.9716 3.8137V8.15686C24.9716 9.11676 24.5665 10.0373 23.8453 10.7161C23.1241 11.3948 22.146 11.7762 21.1261 11.7762H4.20586C3.18597 11.7762 2.20785 11.3948 1.48668 10.7161C0.765502 10.0373 0.360352 9.11676 0.360352 8.15686V3.8137Z" fill="#AFAFAF" />
        <path d="M0.360352 16.4209C0.360352 15.461 0.765502 14.5405 1.48668 13.8617C2.20785 13.183 3.18597 12.8016 4.20586 12.8016H21.1261C22.146 12.8016 23.1241 13.183 23.8453 13.8617C24.5665 14.5405 24.9716 15.461 24.9716 16.4209V20.7641C24.9716 21.724 24.5665 22.6446 23.8453 23.3233C23.1241 24.0021 22.146 24.3834 21.1261 24.3834H4.20586C3.18597 24.3834 2.20785 24.0021 1.48668 23.3233C0.765502 22.6446 0.360352 21.724 0.360352 20.7641V16.4209ZM17.2806 17.1448C17.2806 16.7608 17.1185 16.3926 16.8301 16.1211C16.5416 15.8496 16.1503 15.6971 15.7424 15.6971C15.3344 15.6971 14.9432 15.8496 14.6547 16.1211C14.3662 16.3926 14.2042 16.7608 14.2042 17.1448C14.2042 17.5288 14.3662 17.897 14.6547 18.1685C14.9432 18.44 15.3344 18.5925 15.7424 18.5925C16.1503 18.5925 16.5416 18.44 16.8301 18.1685C17.1185 17.897 17.2806 17.5288 17.2806 17.1448ZM21.8952 17.1448C21.8952 16.7608 21.7331 16.3926 21.4447 16.1211C21.1562 15.8496 20.765 15.6971 20.357 15.6971C19.949 15.6971 19.5578 15.8496 19.2693 16.1211C18.9809 16.3926 18.8188 16.7608 18.8188 17.1448C18.8188 17.5288 18.9809 17.897 19.2693 18.1685C19.5578 18.44 19.949 18.5925 20.357 18.5925C20.765 18.5925 21.1562 18.44 21.4447 18.1685C21.7331 17.897 21.8952 17.5288 21.8952 17.1448Z" fill="#AFAFAF" />
      </svg>),
      title: 'Storage',
      des: `Choose what works best for your use our fee tempowy storage for quick sharm, or upgrade to our reliable multi-region storage for long Terms needs. At just $3 per 10 monthly, we offer one of the inest competitive rates wh ensuring your files are always accesible`,
    },
    {
      icon: (<svg width="29" height="25" viewBox="0 0 29 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.8808 0.324972C14.7671 0.391823 14.6134 0.565636 14.5265 0.70602L14.3727 0.960052V3.77446V6.58219L13.4903 6.6691C10.7026 6.92313 8.47648 7.64511 6.51775 8.93533C5.54842 9.5771 4.01754 11.1213 3.32898 12.1575C2.6471 13.1737 2.28611 13.8689 1.85158 14.9987C0.989208 17.2048 0.467773 20.2465 0.467773 23.0809V24.1438L0.802026 24.4781L1.13628 24.8057L1.56412 24.7789C2.07887 24.7455 2.0655 24.7589 2.96799 23.6893C4.82643 21.4765 6.14339 20.4203 8.05532 19.6047C9.0046 19.2036 10.0809 18.8961 11.2307 18.7089C12.1466 18.5618 13.3833 18.4415 13.9917 18.4415H14.3727V21.2292V24.0235L14.5265 24.2775C14.6134 24.4179 14.7671 24.5917 14.8808 24.6586C15.1281 24.8257 15.6696 24.8324 15.9571 24.672C16.1576 24.565 27.4019 13.8489 27.9969 13.2071C28.2643 12.9129 28.2776 12.8728 28.2776 12.4918C28.2776 12.1107 28.2643 12.0706 27.9969 11.7765C27.4019 11.1347 16.1576 0.418564 15.9571 0.304918C15.6696 0.151161 15.1281 0.157846 14.8808 0.324972Z" fill="#AFAFAF" />
      </svg>),
      title: 'Distribution',
      des: `${responseMessage} Share your content effortlessly, whether it's with a few friends or a global audience. Our high performance CDN ensures quick downloads worldwide, with straightforward pricing at 52/18 of traffic Perfect for content creation and business a like`,
    },
    {
      icon: (<svg width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.2622 3.27073H14.4187L11.3424 0.194397H3.65153C1.95955 0.194397 0.575195 1.57875 0.575195 3.27073V9.4234H31.3385V6.34707C31.3385 4.65508 29.9542 3.27073 28.2622 3.27073Z" fill="#AFAFAF" />
        <path d="M28.2622 3.27124H3.6515C1.95952 3.27124 0.575165 4.65559 0.575165 6.34757V21.7292C0.575165 23.4212 1.95952 24.8056 3.6515 24.8056H28.2622C29.9542 24.8056 31.3385 23.4212 31.3385 21.7292V6.34757C31.3385 4.65559 29.9542 3.27124 28.2622 3.27124Z" fill="#AFAFAF" />
      </svg>),
      title: 'Content Management',
      des: `Organize your files exactly how you want them Our powerful file manager includes everything you need multi-account rapport, quick search custom tagging, detailed descript password protection, and flexible sharing permissions to keep you in control`,
    },
    {
      icon: (<svg width="28" height="25" viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.49512 0.6C1.18262 0.737499 1.00137 0.924999 0.832617 1.28125L0.682617 1.59375V12.5V23.4062L0.832617 23.7188C1.00137 24.0812 1.18887 24.2687 1.50762 24.4062C1.71387 24.4875 3.08262 24.5 14.0576 24.5C25.0326 24.5 26.4014 24.4875 26.6076 24.4062C26.9264 24.2687 27.1139 24.0812 27.2826 23.7188L27.4326 23.4062V12.5V1.59375L27.2826 1.28125C27.1139 0.918749 26.9264 0.731249 26.6076 0.59375C26.4014 0.512499 25.0326 0.5 14.0451 0.5C3.17012 0.50625 1.68887 0.518749 1.49512 0.6ZM17.8076 5.91875C17.8076 5.95 16.7326 8.93125 15.4201 12.5437L13.0326 19.125H11.6701C10.9201 19.125 10.3076 19.1062 10.3076 19.075C10.3076 19.05 11.3826 16.0687 12.6951 12.45L15.0826 5.875H16.4451C17.1951 5.875 17.8076 5.89375 17.8076 5.91875ZM8.55762 11.0938L7.15137 12.5L8.55762 13.9062L9.96387 15.3125L9.02637 16.25L8.08887 17.1875L5.74512 14.8438L3.40137 12.5L5.74512 10.1562L8.08887 7.8125L9.02637 8.75L9.96387 9.6875L8.55762 11.0938ZM22.3701 14.8438L20.0264 17.1875L19.0889 16.25L18.1514 15.3125L19.5576 13.9062L20.9639 12.5L19.5576 11.0938L18.1514 9.6875L19.0889 8.75L20.0264 7.8125L22.3701 10.1562L24.7139 12.5L22.3701 14.8438Z" fill="#AFAFAF" />
      </svg>),
      title: 'API Acess',
      des: `Take your file management to the next level with our developer-friendly APL Automate uploads manage content, and integrate Gofile santly your projects. Perfect for developers and creators looking to build cundom solutions`,
    },
    {
      icon: (<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0.5C13.5913 0.5 15.1174 1.13214 16.2426 2.25736C17.3679 3.38258 18 4.9087 18 6.5C18 8.0913 17.3679 9.61742 16.2426 10.7426C15.1174 11.8679 13.5913 12.5 12 12.5C10.4087 12.5 8.88258 11.8679 7.75736 10.7426C6.63214 9.61742 6 8.0913 6 6.5C6 4.9087 6.63214 3.38258 7.75736 2.25736C8.88258 1.13214 10.4087 0.5 12 0.5ZM12 15.5C18.63 15.5 24 18.185 24 21.5V24.5H0V21.5C0 18.185 5.37 15.5 12 15.5Z" fill="#AFAFAF" />
      </svg>),
      title: 'No Account',
      des: `Start sharing les instantly no regnitration needed. When you're ready for more, свае account to unlock additional latines the permanent storage, muti account management, and advanced sharing options`,
    },
    {
      icon: (<svg width="25" height="31" viewBox="0 0 25 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.9678 11V8C19.9678 3.8 16.6678 0.5 12.4678 0.5C8.26777 0.5 4.96777 3.8 4.96777 8V11C2.41777 11 0.467773 12.95 0.467773 15.5V26C0.467773 28.55 2.41777 30.5 4.96777 30.5H19.9678C22.5178 30.5 24.4678 28.55 24.4678 26V15.5C24.4678 12.95 22.5178 11 19.9678 11ZM7.96777 8C7.96777 5.45 9.91777 3.5 12.4678 3.5C15.0178 3.5 16.9678 5.45 16.9678 8V11H7.96777V8Z" fill="#AFAFAF" />
      </svg>),
      title: 'Reliable',
      des: `Your files deserve the best protection, We ne andustry-standard incryption for all transfers and store your data across multiple secure locations. Rest eary knowing your content is safe and always available when you need K`,
    },
    {
      icon: (<svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.575195" y="0.315369" width="24.6113" height="26.3692" rx="7.17828" fill="#AFAFAF" />
      </svg>
      ),
      title: 'User Friendly Design',
      des: `We've made file sharing as simple as it should be. Sipload with a single click, organze with intuitive tools, and access powerful features when you need them. Our dean ineuntace makes it easy for everyone, from first-tane vrs topower aners`,
    },
    {
      icon: (<svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.1777 2.37891C10.5303 2.4878 10.8674 2.6278 11.1888 2.79891L12.6145 1.94335C12.7632 1.85419 12.9373 1.81724 13.1094 1.83838C13.2815 1.85952 13.4415 1.93752 13.5642 2.06002L14.356 2.8518C14.4784 2.97445 14.5565 3.13451 14.5776 3.30657C14.5987 3.47862 14.5618 3.6528 14.4726 3.80146L13.6171 5.22713C13.7882 5.54861 13.9282 5.88565 14.0371 6.23824L15.6494 6.64191C15.8176 6.68404 15.9669 6.78117 16.0736 6.91786C16.1802 7.05455 16.2382 7.22296 16.2382 7.39635V8.5148C16.2382 8.68818 16.1802 8.8566 16.0736 8.99329C15.9669 9.12998 15.8176 9.22711 15.6494 9.26924L14.0371 9.67291C13.9282 10.0255 13.7882 10.3625 13.6171 10.684L14.4726 12.1097C14.5618 12.2583 14.5987 12.4325 14.5776 12.6046C14.5565 12.7766 14.4784 12.9367 14.356 13.0594L13.5642 13.8511C13.4415 13.9736 13.2815 14.0516 13.1094 14.0728C12.9373 14.0939 12.7632 14.057 12.6145 13.9678L11.1888 13.1122C10.8674 13.2834 10.5303 13.4234 10.1777 13.5322L9.77406 15.1446C9.73193 15.3128 9.6348 15.4621 9.49811 15.5687C9.36142 15.6754 9.19301 15.7333 9.01962 15.7334H7.90117C7.72778 15.7333 7.55937 15.6754 7.42268 15.5687C7.28599 15.4621 7.18886 15.3128 7.14673 15.1446L6.74306 13.5322C6.3936 13.4242 6.05507 13.2836 5.73195 13.1122L4.30628 13.9678C4.15763 14.057 3.98344 14.0939 3.81139 14.0728C3.63933 14.0516 3.47927 13.9736 3.35662 13.8511L2.56484 13.0594C2.44235 12.9367 2.36434 12.7766 2.3432 12.6046C2.32206 12.4325 2.35901 12.2583 2.44817 12.1097L3.30373 10.684C3.13234 10.3609 2.99172 10.0224 2.88373 9.67291L1.27139 9.26924C1.10333 9.22714 0.954138 9.13013 0.847477 8.9936C0.740816 8.85707 0.682795 8.68883 0.682617 8.51557V7.39713C0.682622 7.22374 0.740563 7.05532 0.847238 6.91863C0.953913 6.78194 1.1032 6.68482 1.27139 6.64268L2.88373 6.23902C2.99262 5.88643 3.13262 5.54939 3.30373 5.22791L2.44817 3.80224C2.35901 3.65358 2.32206 3.4794 2.3432 3.30734C2.36434 3.13529 2.44235 2.97523 2.56484 2.85257L3.35662 2.06002C3.47927 1.93752 3.63933 1.85952 3.81139 1.83838C3.98344 1.81724 4.15763 1.85419 4.30628 1.94335L5.73195 2.79891C6.05343 2.6278 6.39047 2.4878 6.74306 2.37891L7.14673 0.766573C7.18883 0.598511 7.28584 0.449316 7.42237 0.342655C7.5589 0.235994 7.72714 0.177973 7.90039 0.177795H9.01884C9.19223 0.1778 9.36064 0.235742 9.49733 0.342416C9.63402 0.449091 9.73115 0.598381 9.77328 0.766573L10.1777 2.37891ZM8.46039 11.0667C9.28551 11.0667 10.0768 10.7389 10.6603 10.1555C11.2437 9.57201 11.5715 8.78069 11.5715 7.95557C11.5715 7.13046 11.2437 6.33913 10.6603 5.75569C10.0768 5.17224 9.28551 4.84446 8.46039 4.84446C7.63528 4.84446 6.84395 5.17224 6.26051 5.75569C5.67706 6.33913 5.34928 7.13046 5.34928 7.95557C5.34928 8.78069 5.67706 9.57201 6.26051 10.1555C6.84395 10.7389 7.63528 11.0667 8.46039 11.0667Z" fill="#AFAFAF" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23.4164 11.4678C23.769 11.5767 24.106 11.7167 24.4275 11.8878L25.8532 11.0322C26.0018 10.9431 26.176 10.9061 26.3481 10.9272C26.5201 10.9484 26.6802 11.0264 26.8028 11.1489L27.5946 11.9407C27.7171 12.0633 27.7951 12.2234 27.8162 12.3954C27.8374 12.5675 27.8004 12.7417 27.7113 12.8903L26.8557 14.316C27.0268 14.6375 27.1668 14.9745 27.2757 15.3271L28.888 15.7308C29.0562 15.7729 29.2055 15.87 29.3122 16.0067C29.4189 16.1434 29.4768 16.3118 29.4768 16.4852V17.6037C29.4768 17.7771 29.4189 17.9455 29.3122 18.0822C29.2055 18.2188 29.0562 18.316 28.888 18.3581L27.2757 18.7618C27.1668 19.1144 27.0268 19.4514 26.8557 19.7729L27.7113 21.1986C27.8004 21.3472 27.8374 21.5214 27.8162 21.6934C27.7951 21.8655 27.7171 22.0256 27.5946 22.1482L26.8028 22.94C26.6802 23.0625 26.5201 23.1405 26.3481 23.1616C26.176 23.1828 26.0018 23.1458 25.8532 23.0567L24.4275 22.2011C24.106 22.3722 23.769 22.5122 23.4164 22.6211L23.0127 24.2334C22.9706 24.4016 22.8734 24.5509 22.7368 24.6576C22.6001 24.7643 22.4317 24.8222 22.2583 24.8222H21.1398C20.9664 24.8222 20.798 24.7643 20.6613 24.6576C20.5246 24.5509 20.4275 24.4016 20.3854 24.2334L19.9817 22.6211C19.6322 22.5131 19.2937 22.3725 18.9706 22.2011L17.5449 23.0567C17.3963 23.1458 17.2221 23.1828 17.05 23.1616C16.878 23.1405 16.7179 23.0625 16.5953 22.94L15.8035 22.1482C15.681 22.0256 15.603 21.8655 15.5818 21.6934C15.5607 21.5214 15.5977 21.3472 15.6868 21.1986L16.5424 19.7729C16.371 19.4498 16.2304 19.1112 16.1224 18.7618L14.51 18.3581C14.342 18.316 14.1928 18.219 14.0861 18.0825C13.9795 17.9459 13.9214 17.7777 13.9213 17.6044V16.486C13.9213 16.3126 13.9792 16.1442 14.0859 16.0075C14.1926 15.8708 14.3419 15.7737 14.51 15.7316L16.1224 15.3279C16.2313 14.9753 16.3713 14.6383 16.5424 14.3168L15.6868 12.8911C15.5977 12.7424 15.5607 12.5683 15.5818 12.3962C15.603 12.2242 15.681 12.0641 15.8035 11.9414L16.5953 11.1489C16.7179 11.0264 16.878 10.9484 17.05 10.9272C17.2221 10.9061 17.3963 10.9431 17.5449 11.0322L18.9706 11.8878C19.2921 11.7167 19.6291 11.5767 19.9817 11.4678L20.3854 9.85544C20.4275 9.68738 20.5245 9.53818 20.661 9.43152C20.7976 9.32486 20.9658 9.26684 21.139 9.26666H22.2575C22.4309 9.26667 22.5993 9.32461 22.736 9.43128C22.8727 9.53796 22.9698 9.68725 23.0119 9.85544L23.4164 11.4678ZM21.699 20.1556C22.5242 20.1556 23.3155 19.8278 23.8989 19.2443C24.4824 18.6609 24.8102 17.8696 24.8102 17.0444C24.8102 16.2193 24.4824 15.428 23.8989 14.8446C23.3155 14.2611 22.5242 13.9333 21.699 13.9333C20.8739 13.9333 20.0826 14.2611 19.4992 14.8446C18.9157 15.428 18.5879 16.2193 18.5879 17.0444C18.5879 17.8696 18.9157 18.6609 19.4992 19.2443C20.0826 19.8278 20.8739 20.1556 21.699 20.1556Z" fill="#AFAFAF" />
      </svg>),
      title: 'Growing Together',
      des: `Gofile is in BETA and actively evolving. We're constantly adding new features and improvements based on your leedtuck. Have Ideas or suggestions? We'd love to hear them wachon and help shape the future of Gofile`,
    },
  ]
  const Navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropItem, setDropItem] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [fullScreenEdit, setFullScreenEdit] = useState(false);




  const onDrop = (acceptedFiles) => {
    setUploadModal(true)
    setFiles(acceptedFiles); //insreting files in state
    console.log(acceptedFiles);
    //console.log(files);
    setIsDragOver(false)
    //setFiles([...e.target.files]);
    console.log(acceptedFiles.length)
    setOverallProgress(0);
    setTotalRemainingTime(0);
    setAvgSpeed(0);

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setDropItem(base64String);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    //handleSubmit();
  };

  const onDragEnter = () => {
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf,.doc',
    onDragEnter,
    onDragLeave,
  });

  const calculateSpeedAndTime = (loaded, total, startTime) => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    const speed = (loaded / elapsed / 1024).toFixed(2); // KB/s
    const remaining = ((total - loaded) / (loaded / elapsed)).toFixed(2); // seconds
    return { speed, remaining };
  };

  const calculateAverageSpeed = (data) => {
    if (!data.length) return 0;
    const totalSpeed = data.reduce((sum, item) => sum + parseFloat(item.speed), 0);
    console.log('speeder', totalSpeed / data.length);
    return totalSpeed / data.length;
  };
  const calculateTotalRemainingTime = (data) => {
    if (!data.length) return 0;
    //const totalRemaining = data.reduce((sum, item) => sum + item.remaining, 0);
    // const totalRemaining = data.reduce((maxObj, currentObj) => {
    //   return currentObj.remaining > maxObj.remaining ? currentObj : maxObj;
    // }, data[0]);
    // console.log('timer', totalRemaining);
    // return totalRemaining;
    const maxTime = data.reduce((max, item) => {
      const time = parseFloat(item.remaining);  // Ensure speed is a number
      return time > max ? time : max;
    }, 0); 
    return maxTime;
  };

  const hhmmss = (seconds) => {
    seconds = parseInt(seconds);
    const hours = Math.floor(seconds / 3600); // Get total hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get total minutes
    const remainingSeconds = seconds % 60; // Get remaining seconds
  
    // Format the output as hh:mm:ss, ensuring two digits for each part
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const calculateLoadedFiles = (data) => {
    const values = Object.values(data);
    if (!values.length) return 0;
    const totalLoaded = values.reduce((sum, item) => sum + item.loaded, 0);
    return totalLoaded;
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };


  const handleSubmit = async () => {
    //event.preventDefault();
    setIsSubmitting(true);
    setResponseMessage('');
    //await new Promise(resolve => setTimeout(resolve, 300));
    //Get actual expirydate
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const currentDate = new Date();
    const daysToAdd = expiryDateIncrement; //State
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    const newDateFormatted = formatDate(currentDate);

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    let loadedSize = 0;
    let avgSpeeder = 0;
    let timeLeft = 0;
    setProgress({});
    setUploadDetails([]);
    setOverallProgress(0);
    const startTimes = files.map(() => Date.now());
    const promises = []; //to track for redirect
    const tempDetails = files.map((file) => ({
      name: file.name,
      speed: "0 KB/s",
      remaining: "Calculating...",
    }));
    setUploadDetails(tempDetails);

    

files.forEach((file, index) => {
      const formData = new FormData();
      formData.append("filesupload", file);
      formData.append('expiry_date', newDateFormatted);
      formData.append('burn_after_read', burnAfterRead); 
      formData.append('uid', 'zxcvb');   // Example value
      formData.append('ip',mirror[1]);
      
      const uploadPromise = axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            //console.log(progressEvent.loaded, progress[file.name]?.loaded);
            //loadedSize += progressEvent.loaded - (progress[file.name]?.loaded || 0);
            //console.log(loadedSize, totalSize);
            const { speed, remaining } = calculateSpeedAndTime(
              loaded,
              total,
              startTimes[index]
            );

            // setProgress((prevProgress) => ({
            //   ...prevProgress,
            //   [file.name]: { loaded, total },
            // }));
            
            setProgress((prevProgress) => {
              const updProg = {
              ...prevProgress,
              [file.name]: { loaded, total },
            };
            console.log('prog',updProg);
            loadedSize = calculateLoadedFiles(updProg);
            return updProg;
            });

            setUploadDetails((prevDetails) => {
              const updatedDetails = [...prevDetails];
              updatedDetails[index] = { name: file.name, speed, remaining };
              console.log('wat',updatedDetails);
              avgSpeeder = calculateAverageSpeed(updatedDetails);
              timeLeft = calculateTotalRemainingTime(updatedDetails);
              return updatedDetails;
            });
            
            const overallProgressValue = Math.round((loadedSize / totalSize) * 100);
            setOverallProgress(overallProgressValue);
            setAvgSpeed(avgSpeeder);
            setTotalRemainingTime(timeLeft);
            // const newLoadedSize = Object.values(progress).reduce(
            //   (sum, fileProgress) => sum + (fileProgress?.loaded || 0),
            //   loaded
            // );
            // loadedSize = newLoadedSize;
            // const overallProgressValue = Math.round((loadedSize / totalSize) * 100);
            // setOverallProgress(overallProgressValue);
          },
        })
        .then(() => {
          setResponseMessage('Files uploaded successfully!');
          console.log(`${file.name} uploaded successfully.`);
        })
        .catch((err) => {
          // Handle error response
          setResponseMessage('Error uploading files. Please try again.');
          console.error(err);
          console.error(`Error uploading ${file.name}:`, err);
        })
        .finally(() => {
          setIsSubmitting(false);
          //setUploadModal(false)
        });
        promises.push(uploadPromise);
    });
    Promise.all(promises)
      .then(() => {
        // All files uploaded successfully
        Navigate('/preview'); // Redirect to /preview
      })
      .catch(() => {
        // Handle any errors (e.g., if any file upload failed)
        setResponseMessage('Error uploading some files. Please try again.');
      });
  };


  useEffect(() => {
    if (uploadModal || (files.length > 0)){
      handleSubmit();
    }
    if (uploadModal || fullScreenEdit) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }

    
  }, [uploadModal, fullScreenEdit])

  const toggleFullScreen = () => {
    setFullScreenEdit(!fullScreenEdit)
  };

  // useEffect(() => {
  //   if (uploadModal) {
  //     setInterval(() => Navigate('/preview'), 3000)
  //   } else {
  //     return;
  //   }
  //   return () => {
  //     return;
  //   }
  // }, [uploadModal, Navigate])


  return (
    <>
      <div className='home px-2 my-4'>
        <div className={`home-shape position-fixed z-3 bg-opacity-25 top-0 left-0 w-100 h-100 bg-black ${isDragOver ? 'blurred' : ''}`}></div>
        <Container fluid>
          <Row className='mb-3 mb-md-4'>
            <Col xs={12} lg={6}>
              <div className={`doc-upload ${isDragOver ? 'blurred position-relative z-3' : ''}`}>
                <div {...getRootProps()} className={`doc-upload-inner`}>
                  <input {...getInputProps()} id="upload_doc" className="d-none" accept='.pdf,.png,.jpg' />
                  <div className="doc-upload-info text-center">
                    <svg width="84" height="76" viewBox="0 0 84 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.8786 23.2599C21.5996 22.9813 21.3784 22.6505 21.2274 22.2863C21.0764 21.9221 20.9987 21.5317 20.9987 21.1375C20.9987 20.7432 21.0764 20.3529 21.2274 19.9887C21.3784 19.6245 21.5996 19.2936 21.8786 19.015L39.8782 1.01534C40.1568 0.736418 40.4877 0.515144 40.8519 0.364174C41.2161 0.213204 41.6065 0.135498 42.0007 0.135498C42.3949 0.135498 42.7853 0.213204 43.1495 0.364174C43.5137 0.515144 43.8445 0.736418 44.1232 1.01534L62.1228 19.015C62.6857 19.5779 63.002 20.3414 63.002 21.1375C63.002 21.9336 62.6857 22.697 62.1228 23.2599C61.5599 23.8228 60.7964 24.1391 60.0004 24.1391C59.2043 24.1391 58.4408 23.8228 57.8779 23.2599L45.0006 10.3789V42.1371C45.0006 42.9327 44.6846 43.6958 44.122 44.2584C43.5594 44.821 42.7963 45.137 42.0007 45.137C41.2051 45.137 40.442 44.821 39.8794 44.2584C39.3168 43.6958 39.0008 42.9327 39.0008 42.1371V10.3789L26.1235 23.2599C25.8449 23.5389 25.514 23.7601 25.1498 23.9111C24.7856 24.0621 24.3953 24.1398 24.001 24.1398C23.6068 24.1398 23.2164 24.0621 22.8522 23.9111C22.488 23.7601 22.1572 23.5389 21.8786 23.2599ZM83.9999 45.137V69.1366C83.9999 70.7279 83.3678 72.254 82.2426 73.3792C81.1174 74.5044 79.5913 75.1365 78 75.1365H6.00136C4.41009 75.1365 2.88399 74.5044 1.75879 73.3792C0.633594 72.254 0.00146484 70.7279 0.00146484 69.1366V45.137C0.00146484 43.5458 0.633594 42.0197 1.75879 40.8945C2.88399 39.7693 4.41009 39.1371 6.00136 39.1371H31.5009C31.8987 39.1371 32.2802 39.2952 32.5615 39.5765C32.8428 39.8578 33.0009 40.2393 33.0009 40.6371V41.9346C33.0009 46.9783 37.1258 51.2307 42.1732 51.1369C44.5301 51.0917 46.7752 50.1236 48.4258 48.4407C50.0765 46.7578 51.001 44.4944 51.0005 42.1371V40.6371C51.0005 40.2393 51.1586 39.8578 51.4399 39.5765C51.7212 39.2952 52.1027 39.1371 52.5005 39.1371H78C79.5913 39.1371 81.1174 39.7693 82.2426 40.8945C83.3678 42.0197 83.9999 43.5458 83.9999 45.137ZM69.0002 57.1368C69.0002 56.2468 68.7363 55.3768 68.2418 54.6368C67.7474 53.8968 67.0446 53.32 66.2223 52.9794C65.4001 52.6388 64.4953 52.5497 63.6224 52.7234C62.7495 52.897 61.9477 53.3256 61.3184 53.9549C60.689 54.5842 60.2605 55.386 60.0868 56.2589C59.9132 57.1318 60.0023 58.0366 60.3429 58.8589C60.6835 59.6811 61.2603 60.3839 62.0003 60.8784C62.7403 61.3728 63.6103 61.6367 64.5003 61.6367C65.6937 61.6367 66.8383 61.1626 67.6822 60.3187C68.5261 59.4748 69.0002 58.3303 69.0002 57.1368Z" fill="#C2C2C2" />
                    </svg>
                    <h4 className="text-uppercase">Drag & Drop or Click to Upload</h4>
                    <p>Quickly share your files and download links anonymously & encrypted</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} lg={6} className='mt-4 mt-lg-0'>
              <div className={`doc-create overflow-hidden ${fullScreenEdit ? 'full-screen position-fixed bottom-0 end-0' : ''}`}>
                <Editor onClick={() => toggleFullScreen()} />
                <Link to="/preview" className='btn bg-white position-absolute bottom-0 end-0 m-2 m-md-3 m-lg-4'>Create</Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="info-items d-grid gap-20">
                {infoCards.map((item, index) => (
                  <div className="info-item" key={index}>
                    <div className="d-flex align-items-center flex-wrap gap-3 mb-2 pb-1">
                      <div className='info-item-icon'>
                        {item.icon}
                      </div>
                      <div className='info-item-content'>
                        <h4 className='mb-0 text-uppercase ps-1'>{item.title}</h4>
                      </div>
                    </div>
                    <p>{item.des}</p>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {uploadModal &&
        <div className="doc-modal position-fixed top-0 left-0 w-100 vh-100 d-flex align-items-center justify-content-center z-3">
          <div className="mx-auto doc-modal-inner">
            {/* <div className="doc-modal-header d-flex flex-wrap gap-3 justify-content-between">
              {uploadFileInfo.map((item, index) => (
                <div key={index} className=''>
                  <div className="d-flex align-items-center gap-2">
                    <span dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                    <h6 className='text-uppercase ps-md-1 mb-0'>{item.title}</h6>
                  </div>
                  <p>{item.value}</p>
                </div>
              ))}
            </div> */}
            <UploadOverview length={files.length} avgSpeed={avgSpeed} totalRemainingTime={hhmmss(totalRemainingTime)} overallProgress={overallProgress} />

            {files.map((file, index) => (
            <div key={file.name} className="doc-modal-body">
              <div className="doc-modal-uploading d-flex gap-3 flex-wrap align-items-center justify-content-between">
                <div className="left d-flex align-items-center gap-2">
                  <div className="icon">
                    <img src={song_icon} alt="" />
                  </div>
                  <div className="ps-1">
                    <h6 className='mb-0 lh-base text-uppercase'
                    style={{
                      maxWidth: '400px',       // Limit the width of the container
                      whiteSpace: 'nowrap',    // Prevent text from wrapping
                      overflow: 'hidden',      // Hide overflow text
                      textOverflow: 'ellipsis' // Add ellipsis (...) when text overflows
                    }}>{file.name}</h6>
                    <p className='text-uppercase lh-base'>{formatBytes(file.size)}</p>
                  </div>
                </div>
                <div className="right d-grid align-items-center gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3H5C4.22343 3 3.83515 3 3.52886 3.12687C3.12048 3.29603 2.79603 3.62048 2.62687 4.02886C2.5 4.33515 2.5 4.72343 2.5 5.5C2.5 6.27657 2.5 6.66485 2.62687 6.97114C2.79603 7.37952 3.12048 7.70398 3.52886 7.87313C3.83515 8 4.22343 8 5 8H15C15.7766 8 16.1648 8 16.4712 7.87313C16.8795 7.70398 17.204 7.37952 17.3732 6.97114C17.5 6.66485 17.5 6.27657 17.5 5.5C17.5 4.72343 17.5 4.33515 17.3732 4.02886C17.204 3.62048 16.8795 3.29603 16.4712 3.12687C16.1648 3 15.7766 3 15 3Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 8H5C4.22343 8 3.83515 8 3.52886 8.12687C3.12048 8.29602 2.79603 8.62048 2.62687 9.02883C2.5 9.33517 2.5 9.72342 2.5 10.5C2.5 11.2766 2.5 11.6648 2.62687 11.9712C2.79603 12.3795 3.12048 12.704 3.52886 12.8732C3.83515 13 4.22343 13 5 13H15C15.7766 13 16.1648 13 16.4712 12.8732C16.8795 12.704 17.204 12.3795 17.3732 11.9712C17.5 11.6648 17.5 11.2766 17.5 10.5C17.5 9.72342 17.5 9.33517 17.3732 9.02883C17.204 8.62048 16.8795 8.29602 16.4712 8.12687C16.1648 8 15.7766 8 15 8Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 13H5C4.22343 13 3.83515 13 3.52886 13.1268C3.12048 13.296 2.79603 13.6205 2.62687 14.0288C2.5 14.3352 2.5 14.7234 2.5 15.5C2.5 16.2766 2.5 16.6648 2.62687 16.9712C2.79603 17.3795 3.12048 17.704 3.52886 17.8732C3.83515 18 4.22343 18 5 18H15C15.7766 18 16.1648 18 16.4712 17.8732C16.8795 17.704 17.204 17.3795 17.3732 16.9712C17.5 16.6648 17.5 16.2766 17.5 15.5C17.5 14.7234 17.5 14.3352 17.3732 14.0288C17.204 13.6205 16.8795 13.296 16.4712 13.1268C16.1648 13 15.7766 13 15 13Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 5.5H5.00833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 10.5H5.00833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 15.5H5.00833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.5 5.5H7.50833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.5 10.5H7.50833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.5 15.5H7.50833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h6 className="mb-0 pl-1">{mirror[1]}</h6>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.2502 11.3333L14.1668 8M11.6668 13C11.6668 13.9205 10.9207 14.6667 10.0002 14.6667C9.07966 14.6667 8.3335 13.9205 8.3335 13C8.3335 12.0795 9.07966 11.3333 10.0002 11.3333C10.9207 11.3333 11.6668 12.0795 11.6668 13Z" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M5 10.5C5 7.73857 7.23857 5.5 10 5.5C10.9107 5.5 11.7646 5.74348 12.5 6.16891" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M2.0835 10.5001C2.0835 6.76809 2.0835 4.90212 3.24286 3.74274C4.40224 2.58337 6.26821 2.58337 10.0002 2.58337C13.7321 2.58337 15.5981 2.58337 16.7574 3.74274C17.9169 4.90212 17.9169 6.76809 17.9169 10.5001C17.9169 14.232 17.9169 16.098 16.7574 17.2573C15.5981 18.4167 13.7321 18.4167 10.0002 18.4167C6.26821 18.4167 4.40224 18.4167 3.24286 17.2573C2.0835 16.098 2.0835 14.232 2.0835 10.5001Z" stroke="#E3DFDF" strokeWidth="1.25" />
                    </svg>
                    <h6 className="mb-0 pl-1">{uploadDetails[index]?.speed} KB/s</h6>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.04798 8.60657L2.53784 8.45376C4.33712 3.70477 9.503 0.999917 14.5396 2.34474C19.904 3.77711 23.0904 9.26107 21.6565 14.5935C20.2227 19.926 14.7116 23.0876 9.3472 21.6553C5.36419 20.5917 2.58192 17.2946 2 13.4844" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8V12L14 14" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h6 className="mb-0 pl-1">{hhmmss(uploadDetails[index]?.remaining)}</h6>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2 justify-content-end">
                    {/* <button className='btn' disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? 'Uploading...' : 'Upload'}</button>
                    <button className='btn' onClick={() => setUploadModal(false)}>Cancel</button> */}
                  </div>
                </div>
              </div>
              
              <ProgressBar now={(progress[file.name]?.loaded/progress[file.name]?.total)*100 || 0} />
              {/* <ProgressBar now={overallProgress} /> */}
            </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}

function UploadOverview({length, avgSpeed, totalRemainingTime, overallProgress}){
  const uploadFileInfofer = [
    {
      icon: `<svg class="position-relative" style="top:-3px" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.3119 2.22946H8.65596L6.73242 0.305908H1.92355C0.865596 0.305908 0 1.1715 0 2.22946V6.07655H19.2355V4.153C19.2355 3.09505 18.3699 2.22946 17.3119 2.22946Z" fill="#AFAFAF"/>
<path d="M17.3119 2.22931H1.92355C0.865596 2.22931 0 3.09491 0 4.15286V13.7706C0 14.8285 0.865596 15.6941 1.92355 15.6941H17.3119C18.3699 15.6941 19.2355 14.8285 19.2355 13.7706V4.15286C19.2355 3.09491 18.3699 2.22931 17.3119 2.22931Z" fill="#AFAFAF"/>
</svg>`,
      title: 'Destination',
      value: 'Files'
    },
    {
      icon: `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.2601 8.75002V8.33335C17.2601 5.19065 17.2601 3.61931 16.2838 2.643C15.3075 1.66669 13.7362 1.66669 10.5934 1.66669H9.76017C6.61753 1.66669 5.0462 1.66669 4.06989 2.64299C3.09358 3.61929 3.09356 5.19062 3.09354 8.3333L3.09351 12.0834C3.09348 14.8229 3.09347 16.1927 3.85007 17.1146C3.98861 17.2834 4.14339 17.4382 4.31219 17.5768C5.23415 18.3334 6.60391 18.3334 9.34342 18.3334" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.42676 5.83331H13.9268" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.42676 10H11.4268" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.26 16.6667V14.1667C17.26 12.9755 16.1408 11.6667 14.76 11.6667C13.3793 11.6667 12.26 12.9755 12.26 14.1667V17.0834C12.26 17.7737 12.8197 18.3334 13.51 18.3334C14.2003 18.3334 14.76 17.7737 14.76 17.0834V14.1667" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>`,
      title: 'Total Files',
      value: `${length} Files`
    },
    {
      icon: `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3676 10.8333L14.2843 7.5M11.7843 12.5C11.7843 13.4205 11.0381 14.1667 10.1176 14.1667C9.19709 14.1667 8.45093 13.4205 8.45093 12.5C8.45093 11.5795 9.19709 10.8333 10.1176 10.8333C11.0381 10.8333 11.7843 11.5795 11.7843 12.5Z" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round"/>
<path d="M5.11768 10C5.11768 7.23857 7.35625 5 10.1177 5C11.0284 5 11.8823 5.24348 12.6177 5.66891" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round"/>
<path d="M2.20093 10C2.20093 6.26803 2.20093 4.40205 3.36029 3.24268C4.51967 2.08331 6.38564 2.08331 10.1176 2.08331C13.8495 2.08331 15.7155 2.08331 16.8749 3.24268C18.0343 4.40205 18.0343 6.26803 18.0343 10C18.0343 13.7319 18.0343 15.5979 16.8749 16.7573C15.7155 17.9167 13.8495 17.9167 10.1176 17.9167C6.38564 17.9167 4.51967 17.9167 3.36029 16.7573C2.20093 15.5979 2.20093 13.7319 2.20093 10Z" stroke="#E3DFDF" strokeWidth="1.25"/>
</svg>`,
      title: 'avg speed',
      value: `${avgSpeed.toFixed(2)} KB/s`
    },
    {
      icon: `<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.10682 8.60657L2.59668 8.45376C4.39596 3.70477 9.56184 0.999917 14.5984 2.34474C19.9628 3.77711 23.1492 9.26107 21.7153 14.5935C20.2815 19.926 14.7704 23.0876 9.40604 21.6553C5.42303 20.5917 2.64076 17.2946 2.05884 13.4844" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.0588 8V12L14.0588 14" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>`,
      title: 'remaining time',
      value: `${totalRemainingTime}`
    },
    {
      icon: `<svg class="position-relative" style="top:-2px" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.66675 13.3334L13.3334 6.66669M8.33341 7.50002C8.33341 7.96025 7.96031 8.33335 7.50008 8.33335C7.03985 8.33335 6.66675 7.96025 6.66675 7.50002C6.66675 7.03979 7.03985 6.66669 7.50008 6.66669C7.96031 6.66669 8.33341 7.03979 8.33341 7.50002ZM13.3334 12.357C13.3334 12.8173 12.9603 13.1904 12.5001 13.1904C12.0398 13.1904 11.6667 12.8173 11.6667 12.357C11.6667 11.8968 12.0398 11.5237 12.5001 11.5237C12.9603 11.5237 13.3334 11.8968 13.3334 12.357Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="#E3DFDF" strokeWidth="1.5"/>
</svg>`,
      title: 'progress',
      value: `${overallProgress}%`
    },
  ]

  return (
    <>
    <div className="doc-modal-header d-flex flex-wrap gap-3 justify-content-between">
              {uploadFileInfofer.map((item, index) => (
                <div key={index} className=''>
                  <div className="d-flex align-items-center gap-2">
                    <span dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                    <h6 className='text-uppercase ps-md-1 mb-0'>{item.title}</h6>
                  </div>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
    </>
  );
}
