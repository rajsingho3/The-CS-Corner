import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

// Add CSS styles at the top of the file
const pdfControlStyles = `
  .pdf-controls {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    justify-content: center;
  }
  .pdf-button {
    padding: 8px 16px;
    background-color: #4F46E5;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;
  }
  .pdf-button:hover {
    background-color: #4338CA;
  }
`;

// Add custom CSS for the PDF button
const additionalStyles = `
  ${pdfControlStyles}
  .ql-pdf {
    width: 28px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ql-pdf svg {
    width: 18px;
    height: 18px;
  }
`;

// Add style tag to document
const styleTag = document.createElement('style');
styleTag.textContent = additionalStyles;
document.head.appendChild(styleTag);

// Add this helper function before the modules definition
const formatPdfUrl = (url) => {
  // Handle Google Drive URLs
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId[0]}/preview`;
    }
  }
  // Handle direct PDF URLs
  if (url.endsWith('.pdf')) {
    return url;
  }
  return null;
};

// Add custom icons for Quill
const icons = Quill.import('ui/icons');
icons['pdf'] = `<svg viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
</svg>`;

// Add Quill toolbar configuration
const modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['pdf'], // Separate PDF button for better visibility
      [{ 'align': [] }], // Add alignment options
      [{ 'color': [] }, { 'background': [] }], // Add color and background options
      ['code-block'], // Add code block option
      ['clean'], // Add clean option
      ['emoji'], // Add emoji option
      ['table'], // Add table option
      ['formula'] // Add formula option
    ],
    handlers: {
      pdf: function() {
        const value = prompt('Enter PDF URL (Direct link or Google Drive share link)');
        if (value) {
          const formattedUrl = formatPdfUrl(value);
          if (formattedUrl) {
            this.quill.insertEmbed(this.quill.getSelection().index, 'pdf', formattedUrl, 'user');
          } else {
            alert('Please provide a valid PDF URL or Google Drive share link');
          }
        }
      },
      // Add custom handler for emoji
      emoji: function() {
        // Custom handler logic for emoji
      },
      // Add custom handler for table
      table: function() {
        // Custom handler logic for table
      },
      // Add custom handler for formula
      formula: function() {
        // Custom handler logic for formula
      }
    }
  }
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video', 'pdf', // Add 'pdf' here
  'align', 'color', 'background', 'formula' // Add new formats here
];

// Register custom PDF embed module
const Embed = Quill.import('blots/block/embed');

class PdfBlot extends Embed {
  static create(value) {
    const container = document.createElement('div');
    const iframe = document.createElement('iframe');
    const controls = document.createElement('div');
    
    // Configure iframe
    iframe.setAttribute('src', value);
    iframe.setAttribute('type', 'application/pdf');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '500px');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');
    
    // Configure controls
    controls.className = 'pdf-controls';
    
    // Download button
    const downloadBtn = document.createElement('a');
    downloadBtn.innerHTML = '⬇️ Download';
    downloadBtn.className = 'pdf-button';
    downloadBtn.href = value.replace('/preview', '/view');
    downloadBtn.setAttribute('download', '');
    downloadBtn.setAttribute('target', '_blank');
    
    // Full page view button
    const fullViewBtn = document.createElement('a');
    fullViewBtn.innerHTML = '🔍 Full View';
    fullViewBtn.className = 'pdf-button';
    fullViewBtn.href = value;
    fullViewBtn.setAttribute('target', '_blank');
    
    // Append elements
    controls.appendChild(downloadBtn);
    controls.appendChild(fullViewBtn);
    container.appendChild(iframe);
    container.appendChild(controls);
    
    return container;
  }

  static value(node) {
    return node.querySelector('iframe').getAttribute('src');
  }
}

PdfBlot.blotName = 'pdf';
PdfBlot.tagName = 'iframe';
Quill.register(PdfBlot);

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          modules={modules} // Add modules here
          formats={formats} // Add formats here
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}