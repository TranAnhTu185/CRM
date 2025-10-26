import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Box, createTheme, DirectionProvider, Flex, MantineProvider } from "@mantine/core";
import { Header } from "../../layout/header/page";
import { Sidebar } from "../../layout/Sidebar/page";
import { ManagerBpmnProvider } from "./libs/contexts/manager-bpmn-context";
import { Notifications } from "@mantine/notifications";
import { StoreProvider } from "./store/context";
import { rootStore } from "./store/RootStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const metadata: Metadata = {
  title: "X-Flow - Nền tảng quản trị doanh nghiệp hàng đầu",
  description: "X-Flow - Nền tảng quản trị doanh nghiệp hàng đầu, tích hợp quy trình, tối ưu năng xuất, quản trị hiện đại, tiết kiệm chi phí",
  icons: {
    icon: '/favicon_io/favicon.ico', // Standard favicon
    shortcut: '/favicon_io/favicon-32x32.png', // Shortcut icon for older browsers/devices
    apple: '/favicon_io/apple-touch-icon.png', // Apple touch icon for iOS devices
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico'
      },
      {
        rel: 'android-chrome-192x192',
        sizes: '192x192',
        url: '/favicon_io/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        sizes: '192x192',
        url: '/favicon_io/android-chrome-512x512.png',
      },
      {
        url: "/favicon_io/favicon-16x16.png",
        type: "image/x-icon",
        sizes: "16x16",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon_io/favicon.ico" type="image/x-icon" sizes="16x16" />
      </head>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <DirectionProvider initialDirection="ltr" detectDirection={false}>
            <MantineProvider >
              <Notifications />
              <Flex flex={1}>
                <Box w={250} style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}>
                  <Sidebar />
                </Box>
                <Box flex={1} className="text-black">
                  <Flex direction="column">
                    <Header />
                    <ManagerBpmnProvider>
                      {children}
                    </ManagerBpmnProvider>
                  </Flex>
                </Box>
              </Flex>
            </MantineProvider>
          </DirectionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
