import { useEditor, EditorContent } from '@tiptap/react'
import { ReactRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import { createLowlight } from 'lowlight'
import { useState, useCallback, useRef, useEffect } from 'react'
import '../styles/tiptap.css'

const NotionEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const linkInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      CharacterCount,
      Color.configure({ types: [TextStyle.name] }),
      TextStyle.configure({ types: ['textStyle'] }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return "What's the title?"
          }
          return placeholder
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 hover:text-purple-300 underline cursor-pointer',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  })

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setIsLinkDialogOpen(true)
  }, [editor])

  const handleLinkSubmit = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setIsLinkDialogOpen(false)
    setLinkUrl('')
  }

  const addImage = useCallback(() => {
    setIsImageDialogOpen(true)
  }, [])

  const handleImageSubmit = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
    }
    setIsImageDialogOpen(false)
    setImageUrl('')
  }

  const addYoutubeVideo = useCallback(() => {
    const url = prompt('Enter YouTube URL')
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(640, 10)) || 640,
        height: Math.max(180, parseInt(480, 10)) || 480,
      })
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      {/* Fixed Toolbar */}
      <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-600 p-4 rounded-t-xl">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('bold') ? 'bg-purple-600' : ''
              }`}
              title="Bold (⌘B)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.5 4v3.5h2.25c.69 0 1.25-.56 1.25-1.25v-1c0-.69-.56-1.25-1.25-1.25H12.5zM12.5 9.5V13h3.25c.69 0 1.25-.56 1.25-1.25v-1.5c0-.69-.56-1.25-1.25-1.25H12.5zM10.5 2h4.25C16.55 2 18 3.45 18 5.25v1.5c0 .92-.38 1.75-1 2.35.62.6 1 1.43 1 2.35v1.5C18 14.55 16.55 16 14.75 16H10.5V2z"/>
                <path d="M8.5 2v14H6.5V2h2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('italic') ? 'bg-purple-600' : ''
              }`}
              title="Italic (⌘I)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.5 2h6v2h-2.2l-2.6 12H12v2H6v-2h2.2l2.6-12H8.5V2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('underline') ? 'bg-purple-600' : ''
              }`}
              title="Underline (⌘U)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2v8c0 2.2 1.8 4 4 4s4-1.8 4-4V2h2v8c0 3.3-2.7 6-6 6s-6-2.7-6-6V2h2zm-4 16h16v2H2v-2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('strike') ? 'bg-purple-600' : ''
              }`}
              title="Strikethrough"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.2 6c-.3-.8-1.1-1.4-2.2-1.4-1.6 0-2.5 1-2.5 2.2 0 .8.3 1.5.8 2H6.8C6.3 8.2 6 7.4 6 6.8 6 4.3 8 2.5 11 2.5s5 1.8 5 4.3c0 .4-.1.8-.2 1.2H13.2zM2 10h16v1H2v-1zm7 2.5c-1.1 0-2-.9-2-2h3c.6.4 1 1.1 1 1.8 0 1.3-1.1 2.2-2 2.2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('code') ? 'bg-purple-600' : ''
              }`}
              title="Code"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.5 7L12 8.5 13.5 10l1.5-1.5L13.5 7zM6.5 7L5 8.5 6.5 10 8 8.5 6.5 7zM3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium ${
                editor.isActive('heading', { level: 1 }) ? 'bg-purple-600' : ''
              }`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium ${
                editor.isActive('heading', { level: 2 }) ? 'bg-purple-600' : ''
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium ${
                editor.isActive('heading', { level: 3 }) ? 'bg-purple-600' : ''
              }`}
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('bulletList') ? 'bg-purple-600' : ''
              }`}
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="3" cy="6" r="1.5"/><circle cx="3" cy="10" r="1.5"/><circle cx="3" cy="14" r="1.5"/>
                <rect x="7" y="5" width="10" height="2" rx="1"/><rect x="7" y="9" width="10" height="2" rx="1"/>
                <rect x="7" y="13" width="10" height="2" rx="1"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('orderedList') ? 'bg-purple-600' : ''
              }`}
              title="Ordered List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4v2h1v1H2v1h2V6h1V5H4V4H2zm0 6v1h2v1H2v1h3V9H2zm0 5v1h1v1H2v1h2v-1h1v-1H4v-1H2z"/>
                <rect x="7" y="4" width="11" height="2" rx="1"/>
                <rect x="7" y="9" width="11" height="2" rx="1"/>
                <rect x="7" y="14" width="11" height="2" rx="1"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('taskList') ? 'bg-purple-600' : ''
              }`}
              title="Task List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4l3 3L9 4l1.5 1.5L7 9 1.5 5.5 3 4zm0 6l3 3 3-3 1.5 1.5L7 15l-3.5-3.5L3 10zm8-6h8v2h-8V4zm0 6h8v2h-8v-2z"/>
              </svg>
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-purple-600' : ''
              }`}
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3h16v2H2V3zm0 4h10v2H2V7zm0 4h16v2H2v-2zm0 4h10v2H2v-2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-purple-600' : ''
              }`}
              title="Align Center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3h16v2H2V3zm3 4h10v2H5V7zm-3 4h16v2H2v-2zm3 4h10v2H5v-2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-purple-600' : ''
              }`}
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3h16v2H2V3zm6 4h10v2H8V7zm-6 4h16v2H2v-2zm6 4h10v2H8v-2z"/>
              </svg>
            </button>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
            <button
              type="button"
              onClick={setLink}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('link') ? 'bg-purple-600' : ''
              }`}
              title="Add Link"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"/>
                <path d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded-md hover:bg-slate-700 transition-colors"
              title="Add Image"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={addYoutubeVideo}
              className="p-2 rounded-md hover:bg-slate-700 transition-colors"
              title="Add YouTube Video"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l4-2.5-4-2.5v5zM10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/>
              </svg>
            </button>
          </div>

          {/* Block Elements */}
          <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('codeBlock') ? 'bg-purple-600' : ''
              }`}
              title="Code Block"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.5 7L5 8.5 6.5 10 8 8.5 6.5 7zM13.5 7L12 8.5 13.5 10l1.5-1.5L13.5 7zM3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-md hover:bg-slate-700 transition-colors ${
                editor.isActive('blockquote') ? 'bg-purple-600' : ''
              }`}
              title="Blockquote"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.5 2v5c0 2.8 2.2 5 5 5h.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H8.5c-2.2 0-4-1.8-4-4V6h3c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H4c-.3 0-.5.2-.5.5zm8 0v5c0 2.8 2.2 5 5 5h.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-.5c-2.2 0-4-1.8-4-4V6h3c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H12c-.3 0-.5.2-.5.5z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded-md hover:bg-slate-700 transition-colors"
              title="Horizontal Rule"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 9h12v2H4V9z"/>
              </svg>
            </button>
          </div>

          {/* Table */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="p-2 rounded-md hover:bg-slate-700 transition-colors"
              title="Insert Table"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v3h5V5H4zm7 0v3h5V5h-5zM4 10v5h5v-5H4zm7 0v5h5v-5h-5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative bg-slate-700 rounded-b-xl border border-slate-600 border-t-0">
        <EditorContent editor={editor} />
      </div>

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-600">
            <h3 className="text-white font-semibold mb-4">Add Link</h3>
            <input
              ref={linkInputRef}
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLinkSubmit()
                } else if (e.key === 'Escape') {
                  setIsLinkDialogOpen(false)
                  setLinkUrl('')
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsLinkDialogOpen(false)
                  setLinkUrl('')
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {isImageDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-600">
            <h3 className="text-white font-semibold mb-4">Add Image</h3>
            <input
              ref={imageInputRef}
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleImageSubmit()
                } else if (e.key === 'Escape') {
                  setIsImageDialogOpen(false)
                  setImageUrl('')
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsImageDialogOpen(false)
                  setImageUrl('')
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageSubmit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character Count */}
      {editor && (
        <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-t border-slate-600 rounded-b-xl text-sm text-gray-400">
          <div>
            {editor.storage.characterCount.characters()} characters, {editor.storage.characterCount.words()} words
          </div>
          <div>
            Reading time: ~{Math.ceil(editor.storage.characterCount.words() / 200)} min
          </div>
        </div>
      )}
    </div>
  )
}

export default NotionEditor