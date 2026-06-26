import { useEffect } from 'react';

const APP_NAME = '✈️ The Friendship Tours & Travels';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${APP_NAME}`
      : APP_NAME;

    document.title = fullTitle;

    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
};