import { useState, useEffect, useRef, useCallback } from 'react';
import { FILE_CONFIG } from '../lib/constants';
import {
  validateFiles,
  createPreviewUrl,
  revokePreviewUrl,
  removeItemAtIndex,
  addItemsToArray,
} from '../lib/utils';
import React from 'react';

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileErrors, setFileErrors] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach(revokePreviewUrl);
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const { valid, errors: validationErrors } = validateFiles(files);

    if (validationErrors.length > 0) {
      setFileErrors(validationErrors.join(' '));
      return;
    }

    if (fileErrors) {
      setFileErrors('');
    }

    setSelectedFiles((prev) => addItemsToArray(prev, valid));

    const newPreviewUrls = valid.map(createPreviewUrl);
    setPreviewUrls((prev) => addItemsToArray(prev, newPreviewUrls));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    revokePreviewUrl(previewUrls[index]);

    setSelectedFiles((prev) => removeItemAtIndex(prev, index));
    setPreviewUrls((prev) => removeItemAtIndex(prev, index));
  };

  const resetFiles = useCallback(() => {
    setPreviewUrls((currentUrls) => {
      currentUrls.forEach(revokePreviewUrl);
      return [];
    });

    setSelectedFiles([]);
    setFileErrors('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const getFileInputProps = () => ({
    type: 'file' as const,
    accept: FILE_CONFIG.ALLOWED_TYPES.join(','),
    multiple: true,
    onChange: handleFileChange,
    className: `block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-medium
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`,
  });

  const getFileInfo = () => ({
    acceptedFormats: FILE_CONFIG.ALLOWED_TYPES.map((type) =>
      type.split('/')[1].toUpperCase()
    ).join(', '),
    maxSize: Math.round(FILE_CONFIG.MAX_SIZE / (1024 * 1024)),
  });

  return {
    selectedFiles,
    previewUrls,
    fileErrors,
    fileInputRef,
    handleFileChange,
    removeImage,
    resetFiles,
    getFileInputProps,
    getFileInfo,
  };
};
