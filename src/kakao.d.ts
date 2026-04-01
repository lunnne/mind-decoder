interface KakaoStatic {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(options: {
      objectType: 'feed';
      content: {
        title: string;
        description: string;
        imageUrl: string;
        imageWidth?: number;
        imageHeight?: number;
        link: { mobileWebUrl: string; webUrl: string };
      };
      buttons?: Array<{
        title: string;
        link: { mobileWebUrl: string; webUrl: string };
      }>;
    }): void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoStatic;
  }
}

export {};
