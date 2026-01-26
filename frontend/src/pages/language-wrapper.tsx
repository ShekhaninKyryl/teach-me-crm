import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const LanguageWrapper = () => {
  const { i18n } = useTranslation();
  const { lng } = useParams();
  const navigate = useNavigate();

  const navigateToLanguage = (lng: string) => {
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    navigate(`/${lng}/${currentPath}`);
  };

  useEffect(() => {
    if (!i18n.options.supportedLngs)
      throw new Error('supportedLngs is not defined in i18n options');
    if (lng && i18n.language !== lng) {
      i18n.options.supportedLngs.includes(lng)
        ? i18n.changeLanguage(lng)
        : navigateToLanguage(i18n.language);
    }
  }, [lng, i18n]);

  return <Outlet />;
};

export default LanguageWrapper;
