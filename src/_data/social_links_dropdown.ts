import type { ComponentType } from "react";
import type { IconBaseProps } from "react-icons";

import * as icons from "react-icons/fa6";

type SocialLinkDropdownItem = {
  label: string;
  value: string;
  icon?: ComponentType<IconBaseProps>;
};

export const socialLinksDropdown: SocialLinkDropdownItem[] = [
  { label: "Facebook", value: "Facebook", icon: icons.FaFacebook },
  { label: "Instagram", value: "Instagram", icon: icons.FaInstagram },
  { label: "Twitter (X)", value: "Twitter", icon: icons.FaSquareXTwitter },
  { label: "LinkedIn", value: "LinkedIn", icon: icons.FaLinkedin },
  { label: "YouTube", value: "YouTube", icon: icons.FaYoutube },
  { label: "GitHub", value: "GitHub", icon: icons.FaGithub },
  { label: "GitLab", value: "GitLab", icon: icons.FaGitlab },
  { label: "Bitbucket", value: "Bitbucket", icon: icons.FaBitbucket },
  { label: "WhatsApp", value: "WhatsApp", icon: icons.FaWhatsapp },
  { label: "Telegram", value: "Telegram", icon: icons.FaTelegram },
  { label: "Pinterest", value: "Pinterest", icon: icons.FaPinterest },
  { label: "Reddit", value: "Reddit", icon: icons.FaReddit },
  { label: "Medium", value: "Medium", icon: icons.FaMedium },
  { label: "Dev.to", value: "DevTo", icon: icons.FaDev },
  {
    label: "Stack Overflow",
    value: "StackOverflow",
    icon: icons.FaStackOverflow,
  },
  { label: "Dribbble", value: "Dribbble", icon: icons.FaDribbble },
  { label: "Behance", value: "Behance", icon: icons.FaBehance },
];
