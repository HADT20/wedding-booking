// Utility để lấy class CSS dựa trên kích thước hiển thị
export const getSizeClasses = (displaySize) => {
  const sizes = {
    small: {
      // Header
      headerPadding: 'px-3 py-3',
      headerTitle: 'text-base',
      headerSubtitle: 'text-xs',
      headerRounded: 'rounded-xl',

      // Container
      containerPadding: 'p-2.5',
      containerSpacing: 'space-y-2.5',
      containerRounded: 'rounded-lg',

      // Cards
      cardPadding: 'p-2.5',
      cardSpacing: 'space-y-2',
      cardRounded: 'rounded-lg',

      // Stats
      statsNumber: 'text-2xl',
      statsLabel: 'text-[10px]',
      statsIcon: 'w-3.5 h-3.5',

      // Text
      textXS: 'text-[10px]',
      textSM: 'text-xs',
      textBase: 'text-sm',
      textLG: 'text-base',
      textXL: 'text-lg',

      // Icons
      iconXS: 'w-3 h-3',
      iconSM: 'w-3.5 h-3.5',
      iconBase: 'w-4 h-4',
      iconLG: 'w-5 h-5',

      // Buttons
      buttonPadding: 'py-2 px-2.5',
      buttonText: 'text-xs',
      buttonIcon: 'w-3.5 h-3.5',
      buttonRounded: 'rounded-lg',

      // Input
      inputPadding: 'px-3 py-2',
      inputRounded: 'rounded-xl',

      // Avatar/Badge
      avatarSM: 'w-7 h-7',
      avatarBase: 'w-8 h-8',
      avatarLG: 'w-10 h-10',

      // Spacing
      gap: 'gap-1.5',
      gapSM: 'gap-1',
      gapLG: 'gap-2',
    },
    medium: {
      // Header
      headerPadding: 'px-4 py-4',
      headerTitle: 'text-lg',
      headerSubtitle: 'text-sm',
      headerRounded: 'rounded-xl',

      // Container
      containerPadding: 'p-3.5',
      containerSpacing: 'space-y-3.5',
      containerRounded: 'rounded-xl',

      // Cards
      cardPadding: 'p-3.5',
      cardSpacing: 'space-y-2.5',
      cardRounded: 'rounded-xl',

      // Stats
      statsNumber: 'text-3xl',
      statsLabel: 'text-xs',
      statsIcon: 'w-4 h-4',

      // Text
      textXS: 'text-xs',
      textSM: 'text-sm',
      textBase: 'text-base',
      textLG: 'text-lg',
      textXL: 'text-xl',

      // Icons
      iconXS: 'w-3.5 h-3.5',
      iconSM: 'w-4 h-4',
      iconBase: 'w-5 h-5',
      iconLG: 'w-6 h-6',

      // Buttons
      buttonPadding: 'py-2.5 px-3',
      buttonText: 'text-sm',
      buttonIcon: 'w-4 h-4',
      buttonRounded: 'rounded-xl',

      // Input
      inputPadding: 'px-3.5 py-2.5',
      inputRounded: 'rounded-xl',

      // Avatar/Badge
      avatarSM: 'w-8 h-8',
      avatarBase: 'w-10 h-10',
      avatarLG: 'w-12 h-12',

      // Spacing
      gap: 'gap-2',
      gapSM: 'gap-1.5',
      gapLG: 'gap-2.5',
    },
    large: {
      // Header
      headerPadding: 'px-5 py-5',
      headerTitle: 'text-xl',
      headerSubtitle: 'text-base',
      headerRounded: 'rounded-2xl',

      // Container
      containerPadding: 'p-4',
      containerSpacing: 'space-y-4',
      containerRounded: 'rounded-xl',

      // Cards
      cardPadding: 'p-4',
      cardSpacing: 'space-y-3',
      cardRounded: 'rounded-xl',

      // Stats
      statsNumber: 'text-4xl',
      statsLabel: 'text-sm',
      statsIcon: 'w-5 h-5',

      // Text
      textXS: 'text-sm',
      textSM: 'text-base',
      textBase: 'text-lg',
      textLG: 'text-xl',
      textXL: 'text-2xl',

      // Icons
      iconXS: 'w-4 h-4',
      iconSM: 'w-5 h-5',
      iconBase: 'w-6 h-6',
      iconLG: 'w-7 h-7',

      // Buttons
      buttonPadding: 'py-3 px-4',
      buttonText: 'text-base',
      buttonIcon: 'w-5 h-5',
      buttonRounded: 'rounded-xl',

      // Input
      inputPadding: 'px-4 py-3',
      inputRounded: 'rounded-2xl',

      // Avatar/Badge
      avatarSM: 'w-10 h-10',
      avatarBase: 'w-12 h-12',
      avatarLG: 'w-14 h-14',

      // Spacing
      gap: 'gap-2.5',
      gapSM: 'gap-2',
      gapLG: 'gap-3',
    },
  };

  return sizes[displaySize] || sizes.small;
};

