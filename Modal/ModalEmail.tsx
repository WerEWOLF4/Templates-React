import React, { useState, useRef } from 'react';
import styles from './ModalEmail.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../Button/Button';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ModalEmail: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(70);
  const [upload, setUpload] = useState(0);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  
  const editableRef = useRef<HTMLDivElement>(null);

  // Handlers for modal visibility
  const handleOpenClick = () => setIsVisible(true);
  const handleCloseClick = () => setIsVisible(false);
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setIsVisible(false);
  };

  // Email input handler
  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
  };

  // Placeholder visibility handler
  const handleFocus = () => {
    if (isPlaceholderVisible) setIsPlaceholderVisible(false);
  };

  const handleBlur = () => {
    if (editableRef.current && editableRef.current.innerText.trim() === '') {
      setIsPlaceholderVisible(true);
    }
  };

  // File upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileName(file.name);
      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const uploadInterval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        setUpload(progress);
      } else {
        clearInterval(uploadInterval);
      }
    }, 500);
  };

  const uploadFile = () => {
    axios
      .post('https://shorturl.at/Zj99K', {}, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      })
      .then(() => {
        alert('File uploaded successfully!');
      })
      .catch(() => {
        alert('File upload failed.');
      });
  };

  // Apply text formatting
  const applyFormatting = (tag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const wrapper = document.createElement(tag === 'bold' ? 'strong' :
      tag === 'italic' ? 'em' :
      tag === 'underline' ? 'u' :
      tag === 'link' ? 'a' :
      tag === 'list' ? 'ul' : 'span');

    if (tag === 'link') {
      wrapper.setAttribute('href', 'https://example.com');
      wrapper.setAttribute('target', '_blank');
    }

    if (tag === 'list') {
      const listItem = document.createElement('li');
      listItem.textContent = selectedText;
      wrapper.appendChild(listItem);
    } else {
      wrapper.textContent = selectedText;
    }

    range.deleteContents();
    range.insertNode(wrapper);
    selection.removeAllRanges();
  };

  // Email parts for greeting
  const emailParts = emailInput.split(',').map(email => email.trim());

  return (
    <>
      <Button appearence='small' onClick={handleOpenClick} className={styles["btn-send"]}>
        <SendIcon /> Send Email
      </Button>

      {isVisible && (
        <div className={`${styles.modal}`} onClick={handleOutsideClick}>
          <div className={styles["modal-content"]}>
            <div className={styles["email-modal"]}>
              {/* Header */}
              <div className={styles["email-header"]}>
                <h2>New Message</h2>
                <span className={styles["close"]} onClick={handleCloseClick}>
                  <CloseIcon />
                </span>
              </div>

              {/* Form */}
              <div className={styles["email-form"]}>
                <div className={styles["form-row"]}>
                  <label htmlFor="from" className={"from"}>From:</label>
                  <input
                    type="text"
                    id="from"
                    placeholder="Olivia Rhye hello@oliviaryhe.com"
                  />
                </div>

                <div className={styles["form-row"]}>
                  <label htmlFor="to" className={styles["to"]}>To:</label>
                  <input
                    type="text"
                    id="to"
                    placeholder="phoenix@catalog.com, candice@catalog.com"
                    value={emailInput}
                    onChange={handleEmailInput}
                  />
                </div>
              </div>

              {/* Body */}
              <div className={styles["email-body"]}>
                <p className={styles["email-greeting"]}>
                  Hey{' '}
                  {emailParts.map((email, index) => {
                    const parts = email.split('@');
                    return (
                      <span key={index}>
                        @{parts[0]}
                        {index < emailParts.length - 1 && ', '}
                      </span>
                    );
                  })}
                </p>

                <div
                  className={styles["textarea"]}
                  contentEditable="true"
                  ref={editableRef}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {isPlaceholderVisible && "Compose your email"}
                </div>

                {/* Toolbar */}
                <div className={styles["toolbar"]}>
                  <button className={styles["bold"]} onClick={() => applyFormatting('bold')}>B</button>
                  <button className={styles["italic"]} onClick={() => applyFormatting('italic')}>I</button>
                  <button className={styles["underline"]} onClick={() => applyFormatting('underline')}>U</button>
                  <button className={styles["link"]} onClick={() => applyFormatting('link')}>Link</button>
                  <button className={styles["list"]} onClick={() => applyFormatting('list')}>List</button>
                </div>
              </div>

              {/* Attachment */}
              <div className={styles["email-attachment"]}>
                <div className={styles["attachment"]}>
                  <label htmlFor="file-upload" className={styles["file-icon"]}>
                    📄
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    className={styles["file-input"]}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.xlsx,.txt,.jpg,.png,.pptx"
                    style={{ display: 'none' }}
                  />
                  <span className={styles["file-upload"]}>
                    {fileName || 'No file uploaded'}
                  </span>
                  <span className={styles["upload-progress"]}>
                    {upload > 0 ? `${upload}% uploaded` : ''}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles["email-footer"]}>
                <Button appearence='small' className={styles["remind-me"]}>Remind me</Button>
                <Button appearence='small' className={styles["send-later"]}>Send later</Button>
                <Button appearence='small' className={styles["send"]} onClick={uploadFile}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalEmail;
