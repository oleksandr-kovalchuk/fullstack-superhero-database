import React, { useState, useEffect, useCallback } from 'react';
import { Superhero, CreateSuperheroData } from '../types/superhero';
import { validateSuperheroForm } from '../lib/utils';

interface FormData {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
}

interface UseSuperheroFormProps {
  superhero?: Superhero | null | undefined;
  viewMode?: 'view' | 'edit' | 'create';
  onSubmit: (data: CreateSuperheroData) => Promise<void>;
}

interface AdditionalSubmitData {
  images?: File[];
}

export const useSuperheroForm = ({
  superhero,
  viewMode = 'create',
  onSubmit,
}: UseSuperheroFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    realName: '',
    originDescription: '',
    superpowers: '',
    catchPhrase: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentViewMode, setCurrentViewMode] = useState<
    'view' | 'edit' | 'create'
  >('create');

  useEffect(() => {
    setCurrentViewMode(viewMode);
    if (superhero) {
      setFormData({
        nickname: superhero.nickname,
        realName: superhero.realName,
        originDescription: superhero.originDescription,
        superpowers: superhero.superpowers,
        catchPhrase: superhero.catchPhrase,
      });
    } else {
      setFormData({
        nickname: '',
        realName: '',
        originDescription: '',
        superpowers: '',
        catchPhrase: '',
      });
    }
    setErrors({});
  }, [superhero, viewMode]);

  const validateForm = (): boolean => {
    const newErrors = validateSuperheroForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    additionalData?: AdditionalSubmitData
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        ...(superhero && { id: superhero.id }),
        ...additionalData,
      };
      await onSubmit(submitData);

      if (currentViewMode === 'create') {
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      nickname: '',
      realName: '',
      originDescription: '',
      superpowers: '',
      catchPhrase: '',
    });
    setErrors({});
  }, []);

  const handleEdit = () => {
    setCurrentViewMode('edit');
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
  };

  return {
    formData,
    errors,
    currentViewMode,
    validateForm,
    handleInputChange,
    handleSubmit,
    resetForm,
    handleEdit,
    handleCancel,
    setErrors,
  };
};
