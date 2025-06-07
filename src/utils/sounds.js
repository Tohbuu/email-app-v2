const sounds = {
  hover: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
  error: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-notification-225.mp3'
};

export const playSound = (type) => {
  if (typeof window !== 'undefined' && sounds[type]) {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio playback prevented:', e));
  }
};