import { Superhero } from '@/types/superhero';

export const getModalTitle = (
  viewMode: 'view' | 'edit' | 'create',
  superhero?: Superhero | null
): string => {
  switch (viewMode) {
    case 'view':
      return superhero?.nickname || 'Superhero Details';
    case 'edit':
      return 'Edit Superhero';
    case 'create':
      return 'Create New Superhero';
    default:
      return 'Superhero';
  }
};

export const getModalSize = (
  viewMode: 'view' | 'edit' | 'create'
): 'sm' | 'md' | 'lg' | 'xl' => {
  return viewMode === 'view' ? 'xl' : 'lg';
};

export const createFormData = (superhero?: Superhero | null) => ({
  nickname: superhero?.nickname || '',
  realName: superhero?.realName || '',
  originDescription: superhero?.originDescription || '',
  superpowers: superhero?.superpowers || '',
  catchPhrase: superhero?.catchPhrase || '',
});

export const resetFormData = () => ({
  nickname: '',
  realName: '',
  originDescription: '',
  superpowers: '',
  catchPhrase: '',
});
