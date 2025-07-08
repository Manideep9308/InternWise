
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Logo } from './logo';
import { Briefcase, Bot, User, Menu, X, LogIn, UserCheck, LayoutDashboard, ClipboardList } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/internships', label: 'Internships', icon: Briefcase },
  { href: '/ai-coach', label: 'AI Coach', icon: Bot },
  { href: '/hiring-manager-simulator', label: 'Resume Review', icon: UserCheck },
  { href: '/my-applications', label: 'My Applications', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Header() {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: typeof navLinks[0]) => (
    <Link href={href} passHref>
      <Button variant="ghost" className={cn(
        'justify-start gap-2',
        pathname.startsWith(href) ? 'bg-primary/10 text-primary' : ''
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );

  const NavLinkMobile = ({ href, label, icon: Icon }: typeof navLinks[0]) => (
    <SheetClose asChild>
      <Link href={href} passHref>
        <Button variant="ghost" className={cn(
          'w-full justify-start gap-3 text-lg py-6',
          pathname.startsWith(href) ? 'bg-primary/10 text-primary' : ''
        )}>
          <Icon className="h-5 w-5" />
          {label}
        </Button>
      </Link>
    </SheetClose>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
            <Link href="/login" passHref>
              <Button variant="outline" className="ml-4">Login</Button>
            </Link>
            <Link href="/post-internship" passHref>
              <Button>Post Internship</Button>
            </Link>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[320px]">
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" passHref>
                        <SheetClose>
                            <Logo />
                        </SheetClose>
                    </Link>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <X />
                        </Button>
                    </SheetClose>
                </div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLinkMobile key={link.href} {...link} />
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link href="/login" passHref>
                        <Button variant="outline" className="w-full">
                            <LogIn className="mr-2" />
                            Login
                        </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/post-internship" passHref>
                        <Button size="lg" className="w-full">Post Internship</Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
