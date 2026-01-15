import { Separator } from '@radix-ui/themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageButton } from 'components/language-switcher/language-button';

const LanguageSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLanguage = location.pathname.split('/')[1];

  const handleLanguageChange = (newLng: string) => {
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    navigate(`/${newLng}/${currentPath}`);
  };

  return (
    <div className="flex gap-2">
      <LanguageButton
        label={'Укр'}
        isActive={currentLanguage === 'ua'}
        onClick={() => handleLanguageChange('ua')}
      />
      <Separator orientation="vertical" />
      <LanguageButton
        label={'En'}
        isActive={currentLanguage === 'en'}
        onClick={() => handleLanguageChange('en')}
      />
    </div>
  );
};

export default LanguageSwitcher;
