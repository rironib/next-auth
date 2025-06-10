"use client";

import { signOut, useSession } from "next-auth/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { atomic_age } from "@/config/fonts";
import Loading from "@/components/Loading";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

const Header = () => {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  console.log(session);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <h1
            className={`block font-bold text-inherit lg:text-3xl ${atomic_age.className}`}
          >
            Next Auth
          </h1>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center">
        <NavbarContent className="hidden gap-3 sm:flex">
          <NavbarItem>
            <Link color="secondary" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/dashboard">
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem isActive={false}>
            <Link color="foreground" href="#">
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
        <ThemeSwitcher />
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={session?.user.name}
                size="sm"
                src={session?.user.image}
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
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout">
                <Button color="danger" onPress={handleLogout}>
                  Log Out
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Link
            href="/auth/login"
            color="secondary"
            className="rounded border border-secondary-500 bg-default-100 px-3 py-1.5"
          >
            Login/Register
          </Link>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
