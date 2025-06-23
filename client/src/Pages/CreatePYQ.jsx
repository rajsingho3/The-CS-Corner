import { Alert, Button, Select, TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePYQ() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [tags, setTags] = useState('');
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');

  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

  // Function to extract file ID from Google Drive URL and convert to direct link
  const processGoogleDriveUrl = (url) => {
    if (!url) return null;
    
    // Extract file ID from various Google Drive URL formats
    let fileId = null;
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    if (url.includes('/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    }
    
    // Format: https://drive.google.com/open?id=FILE_ID
    if (url.includes('open?id=')) {
      const match = url.match(/open\?id=([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    }
    
    // Format: https://docs.google.com/document/d/FILE_ID/
    if (url.includes('/document/d/')) {
      const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    }

    if (fileId) {
      // Convert to direct download link
      const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
      
      return {
        fileId,
        directUrl,
        viewUrl,
        fileName: `Document_${fileId}`,
        fileType: 'pdf', // Default to PDF, can be updated based on actual file
        fileSize: 0 // Will be unknown for Google Drive links
      };
    }
    
    return null;
  };

  const handleGoogleDriveUrlChange = (e) => {
    const url = e.target.value;
    setGoogleDriveUrl(url);
    
    if (url) {
      const processedData = processGoogleDriveUrl(url);
      if (processedData) {
        setFormData({
          ...formData,
          fileUrl: processedData.directUrl,
          fileName: processedData.fileName,
          fileType: processedData.fileType,
          fileSize: processedData.fileSize,
          googleDriveId: processedData.fileId,
          viewUrl: processedData.viewUrl
        });
        setPublishError(null);
      } else {
        setPublishError('Invalid Google Drive URL format. Please use a valid Google Drive sharing link.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const dataToSubmit = {
        ...formData,
        tags: tagsArray,
        semester: parseInt(formData.semester),
        year: parseInt(formData.year),
      };

      const res = await fetch('/api/pyq/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/pyq/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Upload PYQ Paper</h1>
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
              setFormData({ ...formData, course: e.target.value })
            }
            required
          >
            <option value=''>Select Course</option>
            <option value='BCA'>BCA</option>
            <option value='MCA'>MCA</option>
            <option value='BTech'>BTech</option>
            <option value='MTech'>MTech</option>
            <option value='BSc'>BSc</option>
            <option value='MSc'>MSc</option>
            <option value='Other'>Other</option>
          </Select>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Subject'
            required
            id='subject'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, semester: e.target.value })
            }
            required
          >
            <option value=''>Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </Select>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value })
            }
            required
            className='flex-1'
          >
            <option value=''>Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, examType: e.target.value })
            }
            required
            className='flex-1'
          >
            <option value=''>Select Exam Type</option>
            <option value='Mid-Semester'>Mid-Semester</option>
            <option value='End-Semester'>End-Semester</option>
            <option value='Internal'>Internal</option>
            <option value='External'>External</option>
            <option value='Quiz'>Quiz</option>
            <option value='Assignment'>Assignment</option>
          </Select>
        </div>        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='University'
            required
            id='university'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, university: e.target.value })
            }
          />
        </div>

        <TextInput
          type='text'
          placeholder='Tags (comma separated)'
          id='tags'
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className='flex flex-col gap-4 border-4 border-teal-500 border-dotted p-4 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-700 dark:text-white'>
            Upload from Google Drive
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Paste a Google Drive sharing link. Make sure the file is publicly accessible or shared with anyone with the link.
          </p>
          <TextInput
            type='url'
            placeholder='https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing'
            value={googleDriveUrl}
            onChange={handleGoogleDriveUrlChange}
            helperText='Supported formats: Google Drive file links, Google Docs, Sheets, etc.'
          />
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            <p><strong>How to get Google Drive link:</strong></p>
            <ol className='list-decimal list-inside mt-2 space-y-1'>
              <li>Upload your file to Google Drive</li>
              <li>Right-click on the file → Share</li>
              <li>Change access to "Anyone with the link"</li>
              <li>Copy the link and paste it above</li>
            </ol>
          </div>
        </div>

        {formData.fileUrl && (
          <Alert color='success'>
            <div className='flex flex-col gap-2'>
              <p><strong>File successfully linked!</strong></p>
              <p>File: {formData.fileName}</p>
              <p>Type: {formData.fileType.toUpperCase()}</p>
              <a 
                href={formData.viewUrl || formData.fileUrl} 
                target='_blank' 
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                Preview file in new tab
              </a>
            </div>
          </Alert>
        )}

        <Textarea
          placeholder='Description (optional)'
          className='h-32 mb-12'
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Button type='submit' gradientDuoTone='purpleToPink' disabled={!formData.fileUrl}>
          Upload PYQ Paper
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
