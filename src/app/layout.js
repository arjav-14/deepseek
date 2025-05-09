import { Inter} from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import {Toaster} from "react-hot-toast";
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: "deepseek",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (

    <ClerkProvider>
      <AppContextProvider>
    <html lang="en">
      <body
        className={`${inter.variable}  antialiased`}
      >
        <Toaster toastOptions={
          {
            success : { style :{background : "black" , color : "white"}},
            error : { style :{background : "black" , color : "white"}}
          }
        }></Toaster>
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
  );
}
