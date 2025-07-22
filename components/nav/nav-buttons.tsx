'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import {usePathname} from "next/navigation";

const NavButton = ({name, link, path}: {name: string, link: string, path: string}) => {
    if (path === link) {
        return (
            <Button variant="ghost" className={"font-medium text-gray-500"} disabled>
                {name}
            </Button>
        )
    } else {
        return (
            <Link href={link}>
                <Button variant="ghost" className={"font-medium"}>
                    {name}
                </Button>
            </Link>
        )
    }
}

export default function NavButtons() {
    const pathname = usePathname();
    console.log(pathname);

    return (
        <div className="flex items-center gap-4">
            <NavButton name="Swap" link="/" path={pathname}/>
            <NavButton name="Positions" link="/positions" path={pathname}/>
        </div>
    )
}