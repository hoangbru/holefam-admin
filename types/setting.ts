export interface Setting {
  theme: {
    backgroundImage: {
      default: string;
      home: string;
      projects: string;
      contacts: string;
      login: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      error: string;
      success: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        base: string;
        heading: string;
        subheading: string;
      };
    };
  };
  socialLinks: {
    id: number;
    name: string;
    url: string;
    icon: string;
  }[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  footer: {
    text: string;
    links: {
      id: number;
      name: string;
      url: string;
    }[];
  };
}
