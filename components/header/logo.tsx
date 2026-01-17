import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import logoIcon from "@/public/logo-icon.png";
import { appStore } from "@/stores/appStore";
import { getGroupChainIconSrc } from "@/lib/utils";
import { ClientResponse } from "@/lib/interfaces";

interface LogoProps {
  pathname: string;
  clientData?: ClientResponse;
}

export function Logo({ pathname, clientData }: LogoProps) {
  const { currentBranch } = appStore();

  const groupChain = clientData?.data[0]?.GROUP_CHAIN;
  const headerIconSrc = getGroupChainIconSrc(groupChain);
  const logoContent = (
    <>
      {headerIconSrc ? (
        <img src={headerIconSrc} alt="Group icon" width={80} height={80} />
      ) : (
        <>
          <Image
            src={headerIconSrc ?? logoIcon}
            alt="Logo"
            width={36}
            height={36}
            className="h-10 w-10 translate-y-px"
          />
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={40}
            className={`h-10 w-auto sm:h-11 ${
              pathname.startsWith("/products") &&
              currentBranch?.GROUP_CHAIN !== "L'ARTIGIANO"
                ? "hidden md:block"
                : "block"
            }`}
            priority
          />
        </>
      )}
    </>
  );

  if (
    pathname === "/stores" ||
    (currentBranch?.GROUP_CHAIN === "L'ARTIGIANO" &&
      pathname.startsWith("/products"))
  ) {
    return <div className="flex items-center shrink-0">{logoContent}</div>;
  }

  return (
    <Link href="/" className="flex items-center shrink-0">
      {logoContent}
    </Link>
  );
}
