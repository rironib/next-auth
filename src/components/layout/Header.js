"use client";

import Loading from "@/components/Loading";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { atomic_age } from "@/config/fonts";
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
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <Navbar maxWidth="full" className="z-50" isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="z-50 mr-4">
          <Link
            href="/"
            className={`block font-bold text-inherit lg:text-3xl ${atomic_age.className}`}
          >
            Next Auth
          </Link>
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
          <div className="flex text-default-500 md:gap-2">
            <Link href="/auth/login" color="foreground">
              Login
            </Link>
            <div className="hidden md:block">/</div>
            <Link
              href="/auth/register"
              color="foreground"
              className="hidden md:block"
            >
              Sign up
            </Link>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
