"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@v1/ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@v1/ui/context-menu";
import { Icons } from "@v1/ui/icons";
import { cn } from "@v1/ui/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import menuAssistantLight from "public/menu-assistant-light.jpg";
import menuAssistantDark from "public/menu-assistant.jpg";
import menuEngineLight from "public/menu-engine-light.png";
import menuEngineDark from "public/menu-engine.png";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import {
  MdOutlineDashboardCustomize,
  MdOutlineDescription,
  MdOutlineIntegrationInstructions,
  MdOutlineMemory,
} from "react-icons/md";
import { DynamicImage } from "./dynamic-image";
import { LogoIcon } from "./logo-icon";

const listVariant = {
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const itemVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export function Header() {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastPath = `/${pathname.split("/").pop()}`;

  useEffect(() => {
    const setPixelRatio = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      document.documentElement.style.setProperty(
        "--pixel-ratio",
        `${1 / pixelRatio}`,
      );
    };

    setPixelRatio();
    window.addEventListener("resize", setPixelRatio);

    return () => window.removeEventListener("resize", setPixelRatio);
  }, []);

  const handleToggleMenu = () => {
    setOpen((prev) => {
      document.body.style.overflow = prev ? "" : "hidden";
      return !prev;
    });
  };

  const handleOnClick = () => {
    setShowBlur(false);
    setHidden(true);

    setTimeout(() => {
      setHidden(false);
    }, 100);
  };

  const links = [
    {
      title: "Features",
      cover: (
        <Link href="/#assistant" onClick={handleOnClick}>
          <DynamicImage
            alt="Assistant"
            darkSrc={menuAssistantDark}
            lightSrc={menuAssistantLight}
          />
        </Link>
      ),
      children: [
        {
          path: "/overview",
          title: "Overview",
          icon: <Icons.Overview size={20} />,
        },
        {
          path: "/inbox",
          title: "Inbox",
          icon: <Icons.Inbox2 size={20} />,
        },
        {
          path: "/vault",
          title: "Vault",
          icon: <Icons.Files size={20} />,
        },
        {
          path: "/tracker",
          title: "Tracker",
          icon: <Icons.Tracker size={20} />,
        },
        {
          path: "/invoice",
          title: "Invoice",
          icon: <Icons.Invoice size={20} />,
        },
      ],
    },
    {
      title: "Pricing",
      path: "/pricing",
    },
    {
      title: "Updates",
      path: "/updates",
    },
    {
      title: "Story",
      path: "/story",
    },
    {
      title: "Download",
      path: "/download",
    },
    {
      title: "Developers",
      cover: (
        <Link href="/engine" onClick={handleOnClick}>
          <DynamicImage
            alt="Engine"
            darkSrc={menuEngineDark}
            lightSrc={menuEngineLight}
          />
        </Link>
      ),
      children: [
        {
          path: "https://git.new/midday",
          title: "Open Source",
          icon: <FaGithub size={19} />,
        },
        {
          path: "https://docs.midday.ai",
          title: "Documentation",
          icon: <MdOutlineDescription size={20} />,
        },
        {
          path: "/engine",
          title: "Engine",
          icon: <MdOutlineMemory size={20} />,
        },
        {
          title: "Join the community",
          path: "https://go.midday.ai/anPiuRx",
          icon: <FaDiscord size={19} />,
        },
        {
          title: "Apps & Integrations",
          path: "https://docs.midday.ai/integrations",
          icon: <MdOutlineIntegrationInstructions size={20} />,
        },
        {
          path: "/components",
          title: "Components",
          icon: <MdOutlineDashboardCustomize size={20} />,
        },
      ],
    },
  ];

  if (pathname.includes("pitch")) {
    return null;
  }

  return (
    <header className="sticky mt-4 top-4 z-50 px-2 md:px-4 md:flex justify-center">
      <nav className="border border-border px-4 flex items-center backdrop-filter backdrop-blur-xl bg-[#FFFFFF] dark:bg-[#121212] bg-opacity-70 h-[50px] z-20">
        <ContextMenu>
          <ContextMenuTrigger>
            <Link href="/">
              <span className="sr-only">Voidream Logo</span>
              <LogoIcon />
            </Link>
          </ContextMenuTrigger>

          <ContextMenuContent
            className="w-[200px] dark:bg-[#121212] bg-[#fff] rounded-none"
            alignOffset={20}
          >
            <div className="divide-y">
              <ContextMenuItem
                className="flex items-center space-x-2"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `<svg
                        width="137"
                        height="30"
                        viewBox="0 0 137 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_108_5)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18.2882 10.3123H25.3195C25.4303 10.3123 25.5392 10.3199 25.6459 10.3348L18.3055 17.6752C18.2902 17.5669 18.2822 17.4561 18.2822 17.3435V10.3123H15.4697V20.9597C15.4697 22.3828 16.854 22.9834 17.8988 22.0103L20.2943 19.664L29.9424 9.9829C30.8579 9.02343 30.6089 7.49976 28.9243 7.49976H18.2882V10.3123ZM0.469727 9.37476V9.38235L10.0796 21.6198C11.2345 23.0906 13.5967 22.2738 13.5967 20.4039V9.37476H10.7842V17.9633L4.0398 9.37476H0.469727Z"
                            fill="currentColor"
                          />
                        </g>
                        <path
                          d="M51.0098 11.2548H49.0154L45.5583 21.0499L42.1012 11.2548H40.1068L44.3838 23H46.7328L51.0098 11.2548Z"
                          fill="currentColor"
                        />
                        <path
                          d="M57.9749 23C61.2325 23 63.3377 20.5845 63.3377 16.8615C63.3377 13.1385 61.2325 10.723 57.9749 10.723C54.7172 10.723 52.612 13.1385 52.612 16.8615C52.612 20.5845 54.7172 23 57.9749 23ZM54.5621 16.8615C54.5621 14.1357 55.8031 12.4958 57.9749 12.4958C60.1466 12.4958 61.3876 14.1357 61.3876 16.8615C61.3876 19.5873 60.1466 21.2271 57.9749 21.2271C55.8031 21.2271 54.5621 19.5873 54.5621 16.8615Z"
                          fill="currentColor"
                        />
                        <path
                          d="M71.4549 11.2548H65.3828V12.8947H69.5934V21.3601H64.9396V23H75.4659V21.3601H71.4549V11.2548ZM69.3496 9.50416H71.4549V7.26593H69.3496V9.50416Z"
                          fill="currentColor"
                        />
                        <path
                          d="M87.4834 7H85.6219V12.5402C84.9571 11.3656 83.7604 10.723 82.0097 10.723C78.6192 10.723 77.0679 13.626 77.0679 16.8615C77.0679 20.0969 78.6192 23 82.0097 23C83.8269 23 85.0901 22.2687 85.7327 21.0499L85.7992 22.7341H87.4834V7ZM79.0181 16.8615C79.0181 14.5346 79.971 12.4072 82.4086 12.4072C84.8241 12.4072 85.7992 14.5789 85.7992 16.8615C85.7992 19.0554 84.8241 21.2271 82.4086 21.2271C79.971 21.2271 79.0181 19.0997 79.0181 16.8615Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.5619 11.2548H89.0854V12.8947H92.1436V21.3601H89.0854V23H97.8389V21.3601H94.0051V15.9972C94.0051 13.9806 94.8472 12.8947 96.6422 12.8947H98.9912V11.2548H96.6422C95.0909 11.2548 94.138 11.964 93.717 13.4709L93.5619 11.2548Z"
                          fill="currentColor"
                        />
                        <path
                          d="M100.593 16.8615C100.593 20.5845 102.72 23 105.978 23C108.238 23 110.211 21.626 110.898 19.41L108.903 19.2548C108.371 20.4958 107.241 21.2271 105.978 21.2271C103.961 21.2271 102.743 19.831 102.587 17.4377H111.097L111.075 16.5956C110.875 12.4294 108.571 10.723 105.978 10.723C102.72 10.723 100.593 13.1385 100.593 16.8615ZM102.61 15.7978C102.92 13.7147 104.116 12.4958 105.978 12.4958C107.418 12.4958 108.726 13.3379 109.058 15.7978H102.61Z"
                          fill="currentColor"
                        />
                        <path
                          d="M112.899 14.446L114.893 14.6011C115.181 13.3823 116.245 12.4958 117.708 12.4958C119.436 12.4958 120.544 13.4487 120.566 15.4432L117.132 16.1302C114.539 16.6177 112.699 17.2382 112.699 19.6537C112.699 21.759 114.605 23 116.932 23C118.794 23 120.123 22.0028 120.589 20.9169C120.788 21.9806 121.63 22.7341 123.048 22.7341H123.625V21.0942H123.159C122.65 21.0942 122.428 20.8504 122.428 20.3629V15.6427C122.428 12.3629 120.544 10.723 117.708 10.723C115.27 10.723 113.342 12.2299 112.899 14.446ZM114.65 19.6537C114.65 18.0138 116.09 17.903 117.841 17.5928L120.611 17.1053V17.6814C120.611 20.0083 119.104 21.3379 117.176 21.3601C115.447 21.3601 114.65 20.5845 114.65 19.6537Z"
                          fill="currentColor"
                        />
                        <path
                          d="M125.226 11.2548V23H127.11V15.9529C127.11 13.8255 127.664 12.6288 128.573 12.6288C129.592 12.6288 129.969 13.5817 129.969 15.9529V23H131.83V15.9529C131.83 13.8255 132.429 12.6288 133.448 12.6288C134.357 12.6288 134.711 13.5596 134.711 15.9529V23H136.573V15.9529C136.573 12.4958 135.797 10.9889 134.002 10.9889C132.783 10.9889 131.83 11.831 131.409 13.1828C131.055 11.6537 130.434 10.9889 129.415 10.9889C128.24 10.9889 127.442 11.6537 126.999 12.8726L126.933 11.2548H125.226Z"
                          fill="currentColor"
                        />
                        <defs>
                          <clipPath id="clip0_108_5">
                            <rect
                              width="30"
                              height="30"
                              fill="white"
                              transform="translate(0.469727)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      `,
                    );
                  } catch {}
                }}
              >
                <Icons.LogoIcon />
                <span className="font-medium text-sm">Copy Logo as SVG</span>
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <Link href="/branding" className="flex items-center space-x-2">
                  <Icons.Change />
                  <span className="font-medium text-sm">Branding</span>
                </Link>
              </ContextMenuItem>
              <ContextMenuItem>
                <a
                  href="https://ui.midday.ai"
                  className="flex items-center space-x-2"
                >
                  <Icons.Palette />
                  <span className="font-medium text-sm">Design System</span>
                </a>
              </ContextMenuItem>
            </div>
          </ContextMenuContent>
        </ContextMenu>

        <ul className="space-x-2 font-medium text-sm hidden md:flex mx-3">
          {links.map(({ path, title, children, cover }) => {
            if (path) {
              return (
                <li key={path}>
                  <Link
                    onClick={handleOnClick}
                    href={path}
                    className="h-8 items-center justify-center text-sm font-medium px-3 py-2 inline-flex text-secondary-foreground transition-opacity hover:opacity-70 duration-200"
                  >
                    {title}
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={title}
                className="group"
                onMouseEnter={() => setShowBlur(true)}
                onMouseLeave={() => setShowBlur(false)}
              >
                <span className="h-8 items-center justify-center text-sm font-medium transition-opacity hover:opacity-70 duration-200 px-3 py-2 inline-flex text-secondary-foreground cursor-pointer">
                  {title}
                </span>

                {children && (
                  <div
                    className={cn(
                      "absolute top-[48px] left-0 -mx-[calc(var(--pixel-ratio)_*_2px)] bg-[#fff] dark:bg-[#121212] flex h-0 group-hover:h-[250px] overflow-hidden transition-all duration-300 ease-in-out border-l border-r",
                      hidden && "hidden",
                    )}
                  >
                    <ul className="p-4 w-[200px] flex-0 space-y-4 mt-2">
                      {children.map((child) => {
                        return (
                          <li key={child.path}>
                            <Link
                              onClick={handleOnClick}
                              href={child.path}
                              className="flex space-x-2 items-center transition-opacity hover:opacity-70 duration-200"
                            >
                              <span>{child.icon}</span>
                              <span className="text-sm font-medium">
                                {child.title}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex-1 p-4">{cover}</div>
                    <div className="absolute bottom-0 w-full border-b-[1px]" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="ml-auto md:hidden p-2"
          onClick={() => handleToggleMenu()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={13}
            fill="none"
          >
            <path
              fill="currentColor"
              d="M0 12.195v-2.007h18v2.007H0Zm0-5.017V5.172h18v2.006H0Zm0-5.016V.155h18v2.007H0Z"
            />
          </svg>
        </button>

        <a
          className="text-sm font-medium pr-2 border-l-[1px] border-border pl-4 hidden md:block"
          href="https://app.midday.ai"
        >
          Sign in
        </a>
      </nav>

      {isOpen && (
        <motion.div
          className="fixed bg-background -top-[2px] right-0 left-0 bottom-0 h-screen z-10 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mt-4 flex justify-between p-3 px-4 relative ml-[1px]">
            <button type="button" onClick={handleToggleMenu}>
              <span className="sr-only">Midday Logo</span>
              <LogoIcon />
            </button>

            <button
              type="button"
              className="ml-auto md:hidden p-2 absolute right-[10px] top-2"
              onClick={handleToggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                className="fill-primary"
              >
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
          </div>

          <div className="h-screen pb-[150px] overflow-auto">
            <motion.ul
              initial="hidden"
              animate="show"
              className="px-3 pt-8 text-xl text-[#878787] space-y-8 mb-8 overflow-auto"
              variants={listVariant}
            >
              {links.map(({ path, title, children }, index) => {
                const isActive =
                  path === "/updates"
                    ? pathname.includes("updates")
                    : path === lastPath;

                if (path) {
                  return (
                    <motion.li variants={itemVariant} key={path}>
                      <Link
                        href={path}
                        className={cn(isActive && "text-primary")}
                        onClick={handleToggleMenu}
                      >
                        {title}
                      </Link>
                    </motion.li>
                  );
                }

                return (
                  <li key={title}>
                    <Accordion collapsible type="single">
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="flex items-center justify-between w-full font-normal p-0 hover:no-underline">
                          <span className="text-[#878787]">{title}</span>
                        </AccordionTrigger>

                        {children && (
                          <AccordionContent className="text-xl">
                            <ul className="space-y-8 ml-4 mt-6">
                              {children.map((child) => {
                                return (
                                  <li key={child.path}>
                                    <Link
                                      onClick={handleToggleMenu}
                                      href={child.path}
                                      className="text-[#878787]"
                                    >
                                      {child.title}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    </Accordion>
                  </li>
                );
              })}

              <motion.li
                className="mt-auto border-t-[1px] pt-8"
                variants={itemVariant}
              >
                <Link
                  className="text-xl text-primary"
                  href="https://app.midday.ai"
                >
                  Sign in
                </Link>
              </motion.li>
            </motion.ul>
          </div>
        </motion.div>
      )}

      <div
        className={cn(
          "fixed w-screen h-screen backdrop-blur-md left-0 top-0 invisible opacity-0 transition-all duration-300 z-10",
          showBlur && "md:visible opacity-100",
        )}
      />
    </header>
  );
}
