import localFont from "next/font/local";
import { IBM_Plex_Sans } from "next/font/google";

export const fedraSans = localFont({
  src: [
    { path: "../../public/fonts/fedra-sans/Fedra-Sans-Light.ttf", weight: "300" },
    { path: "../../public/fonts/fedra-sans/Fedra-Sans-Book.ttf", weight: "400" },
  ],
  variable: "--font-fedra",
  display: "swap",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});
