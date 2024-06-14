import React, { useEffect, useState } from "react";
import { open } from "@tauri-apps/api/shell";
import { LuSettings, LuGift, LuDownload } from "react-icons/lu";

import { appContext } from "../../context";
import icon_white from "../../assets/icon_white.png";

interface HeaderProps {
    setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
}

const Header: React.FC<HeaderProps> = ({ setSelectedPage }) => {
    const [latestRelease, setLatestRelease] = useState<string>("");
    const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);

    useEffect(() => {
        const setReleaseInfo = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/Bamboooz/magnetar/releases/latest");
                
                if (!response.ok) {
                    console.log("Network response was not ok.");
                }

                const data = await response.json();
                const latestReleaseTag = data.tag_name;

                setLatestRelease(latestReleaseTag);
                setUpdateAvailable(latestReleaseTag !== appContext.version);
            } catch (error) {
                setUpdateAvailable(false);
            }
        };

        setReleaseInfo();
    }, []);

    return (
        <>
            <header className="group w-full h-14 shrink-0 bg-header flex items-center justify-between pl-4 pr-6 z-50">
                <button onClick={() => setSelectedPage(0)} className="h-full flex items-center justify-start pr-3">
                    <img src={icon_white} className="h-10 w-10 mt-1" alt="Logo" />

                    <p className="text-neutral-300 text-[12px] font-bold">Magnetar Toolbox</p>
                </button>

                <div className="h-full flex items-center justify-start gap-6">
                    {updateAvailable
                        ? <button onClick={() => open("https://github.com/Bamboooz/magnetar/releases/latest")} title={`Download latest release: ${latestRelease}!`} className="flex items-center justify-center p-1 rounded-full transition-colors hover:bg-header-item-hover">
                            <LuDownload className="text-neutral-300 text-[16px]" />
                        </button>
                        : <button onClick={() => open("https://github.com/Bamboooz/magnetar/releases/latest")} title={`What's new in ${appContext.version}?`} className="flex items-center justify-center p-1 rounded-full transition-colors hover:bg-header-item-hover">
                            <LuGift className="text-neutral-300 text-[16px]" />
                        </button>
                    }

                    <button title="Settings" onClick={() => setSelectedPage(1)} className="flex items-center justify-center p-1 rounded-full transition-colors hover:bg-header-item-hover">
                        <LuSettings className="text-neutral-300 text-[16px]" />
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;