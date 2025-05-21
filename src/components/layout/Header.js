"use client"

import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@heroui/react";
import Link from "next/link";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";
import {atomic_age} from "@/config/fonts";
import {signOut, useSession} from "next-auth/react";
import Loading from "@/components/Loading";


const Header = () => {
    const {data: session, status} = useSession();

    // console.log(session)

    if (status === "loading") {
        return <Loading/>
    }

    // if (!session) return <p>Access Denied</p>;


    return (
        <Navbar maxWidth="full" isBordered>
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <h1 className={`block font-bold text-inherit lg:text-4xl ${atomic_age.className}`}>Next Auth</h1>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="center">
                <NavbarContent className="hidden sm:flex gap-3">
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Features
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link aria-current="page" color="secondary" href="#">
                            Customers
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Integrations
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                <ThemeSwitcher/>
                {
                    session ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name={session.user.name}
                                    size="sm"
                                    src={session.user.image}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">{session.user.name}</p>
                                </DropdownItem>
                                <DropdownItem key="settings">My Settings</DropdownItem>
                                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                                <DropdownItem key="analytics">Analytics</DropdownItem>
                                <DropdownItem key="system">System</DropdownItem>
                                <DropdownItem key="configurations">Configurations</DropdownItem>
                                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                                <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <Link href="/auth/login"
                              className="border border-secondary-500 px-3 py-1.5 rounded">Login/Register</Link>
                    )
                }

            </NavbarContent>
        </Navbar>
    );
};

export default Header;