"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import {
  LEATHER,
  MAGIC_EDEN,
  OKX,
  OYL,
  ORANGE,
  PHANTOM,
  UNISAT,
  useLaserEyes,
  WalletIcon,
  WIZZ,
  XVERSE,
  SUPPORTED_WALLETS,
  LaserEyesLogo,
} from "@omnisat/lasereyes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ConnectWallet({ className }: { className?: string }) {
  const {
    connect,
    disconnect,
    isConnecting,
    address,
    provider,
    hasUnisat,
    hasXverse,
    hasOyl,
    hasMagicEden,
    hasOkx,
    hasLeather,
    hasPhantom,
    hasWizz,
    hasOrange,
    hasOpNet,
  } = useLaserEyes();
  const [isOpen, setIsOpen] = useState(false);

  const hasWallet = {
    unisat: hasUnisat,
    xverse: hasXverse,
    oyl: hasOyl,
    [MAGIC_EDEN]: hasMagicEden,
    okx: hasOkx,
    op_net: hasOpNet,
    leather: hasLeather,
    phantom: hasPhantom,
    wizz: hasWizz,
    orange: hasOrange,
  };

  const handleConnect = async (
    walletName:
      | typeof UNISAT
      | typeof MAGIC_EDEN
      | typeof OYL
      | typeof ORANGE
      | typeof PHANTOM
      | typeof LEATHER
      | typeof XVERSE
      | typeof WIZZ
      | typeof OKX
  ) => {
    if (provider === walletName) {
      await disconnect();
    } else {
      setIsOpen(false);
      await connect(walletName as never);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {address ? (
        <Button
          onClick={() => disconnect()}
          className={cn(
            "mb-4 text-black dark:text-white font-bold py-6 px-12 rounded-lg",
            "transition duration-300",
            "bg-white dark:bg-gray-800",
            "hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700",
            className
          )}
        >
          Disconnect
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button
            className={cn(
              "mb-4 text-black dark:text-white font-bold py-6 px-12 rounded-lg",
              "transition duration-300",
              "bg-white dark:bg-gray-800",
              "hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700",
              className
            )}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className={cn(
          "bg-white dark:bg-gray-900 border-none",
          "text-black dark:text-white rounded-3xl mx-auto",
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-[480px] max-h-[560px]",
          "flex flex-col overflow-hidden p-0"
        )}
      >
        <DialogHeader className="px-6 pt-5 pb-3">
          <DialogTitle className="text-center text-[22px] font-medium text-black dark:text-white">
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
          <DialogDescription className="flex flex-col gap-2 w-full">
            {Object.values(SUPPORTED_WALLETS).map((wallet) => {
              const isConnected = provider === wallet;
              const isMissingWallet = !hasWallet[wallet.name];
              return (
                <Button
                  key={wallet.name}
                  onClick={
                    isMissingWallet
                      ? () => null
                      : () => handleConnect(wallet.name as typeof UNISAT | typeof MAGIC_EDEN | typeof OYL | typeof ORANGE | typeof PHANTOM | typeof LEATHER | typeof XVERSE | typeof WIZZ | typeof OKX)
                  }
                  variant="ghost"
                  className={cn(
                    "w-full bg-white dark:bg-gray-800",
                    "hover:bg-gray-50 dark:hover:bg-gray-700",
                    "text-black dark:text-white",
                    "font-normal justify-between",
                    "h-[60px] text-base rounded-xl px-4",
                    "border border-gray-100 dark:border-gray-700",
                    "transition-colors duration-200",
                    "group"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="min-w-[32px] min-h-[32px] w-[32px] h-[32px] flex items-center justify-center">
                      <WalletIcon
                        size={32}
                        walletName={wallet.name}
                        className="!w-[32px] !h-[32px]"
                      />
                    </div>
                    <span className="text-lg">
                      {wallet.name
                        .replace(/[-_]/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                  </div>
                  {hasWallet[wallet.name] ? (
                    <div className="flex items-center">
                      <div className="flex items-center gap-2 group-hover:hidden">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Installed
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 hidden group-hover:block" />
                    </div>
                  ) : (
                    <a
                      href={wallet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-sm">Install</span>
                    </a>
                  )}
                </Button>
              );
            })}
          </DialogDescription>
        </div>

        <div className="w-full bg-gray-50 dark:bg-gray-900 p-4 pt-5 border-t border-gray-200 dark:border-gray-800 group relative">
          <div className="text-gray-500 dark:text-gray-400 text-sm text-center transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
            <a
              href="https://www.lasereyes.build/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by LaserEyes
            </a>
          </div>
          <div className="absolute top-5 left-0 right-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
            <a
              href="https://www.lasereyes.build/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center"
            >
              <LaserEyesLogo width={48} color={"blue"} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
