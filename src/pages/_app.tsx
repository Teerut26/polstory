import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { ChakraProvider } from '@chakra-ui/react'
import { api } from "@/utils/api";

import "@/styles/globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <main className={`font-sans ${inter.variable}`}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </main>
    );
};

export default api.withTRPC(MyApp);
